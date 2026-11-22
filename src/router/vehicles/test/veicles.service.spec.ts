import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VeiculosService } from '../veicles.service.js';
import { Prisma } from '../../../../generated/prisma/client.js';
import type { CreateVeiculoDto } from '../dto/veicles.dto.js';

// sharp falso: não processa imagem de verdade
vi.mock('sharp', () => {
  const chain: any = {};
  chain.rotate = vi.fn(() => chain);
  chain.resize = vi.fn(() => chain);
  chain.webp = vi.fn(() => chain);
  chain.toBuffer = vi.fn().mockResolvedValue(Buffer.from('img'));
  return { default: vi.fn(() => chain) };
});

// cria um erro do Prisma de verdade, com o código que você quiser
const erroPrisma = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('erro', { code, clientVersion: 'test' });

const foto = () => ({ buffer: Buffer.from('x') }) as Express.Multer.File;

const dto = {
  nome: 'CG 160',
  ano_fab: 2022,
  km: 1000,
  placa: 'ABC1D23',
  destaque: true,
  combustivel: 'FLEX',
  preco: 15000,
  categoria: { public_id: 'cat-uuid' },
  modelo: { public_id: 'mod-uuid' },
  cores: [{ public_id: 'cor-uuid' }],
} as unknown as CreateVeiculoDto;

describe('VeiculosService', () => {
  let service: VeiculosService;
  let prisma: any;
  let modeloService: any;
  let categoriaService: any;
  let storage: any;

  beforeEach(() => {
    prisma = {
      veiculos: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      imagem_Veiculos: {
        findFirst: vi.fn(),
        count: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      // aceita os dois formatos de $transaction: função ou lista
      $transaction: vi.fn(),
    };
    prisma.$transaction.mockImplementation((arg: any) =>
      typeof arg === 'function' ? arg(prisma) : Promise.all(arg));

    modeloService = { getIdByPublicId: vi.fn().mockResolvedValue(20) };
    categoriaService = { getIdByPublicId: vi.fn().mockResolvedValue(10) };
    storage = {
      upload: vi.fn((key: string) => Promise.resolve(key)),
      remove: vi.fn().mockResolvedValue(undefined),
      publicUrl: vi.fn((k: string) => `https://cdn.teste/${k}`),
    };

    service = new VeiculosService(prisma, modeloService, categoriaService, storage);
  });

  // ───────────────────────── createVeiculo ─────────────────────────
  describe('createVeiculo', () => {
    it('recusa quando não vem nenhuma foto', async () => {
      await expect(service.createVeiculo(dto, [])).rejects.toBeInstanceOf(BadRequestException);
      expect(storage.upload).not.toHaveBeenCalled();
    });

    it('recusa índice da principal maior que o número de fotos', async () => {
      const d = { ...dto, indice_principal: 5 } as CreateVeiculoDto;
      await expect(service.createVeiculo(d, [foto()])).rejects.toBeInstanceOf(BadRequestException);
      expect(storage.upload).not.toHaveBeenCalled();
    });

    // este teste FALHA até você trocar a validação por: if (idx < 0 || idx >= files.length)
    it('recusa índice negativo', async () => {
      const d = { ...dto, indice_principal: -1 } as CreateVeiculoDto;
      await expect(service.createVeiculo(d, [foto()])).rejects.toBeInstanceOf(BadRequestException);
    });

    it('cria o veículo e marca só a foto escolhida como principal', async () => {
      prisma.veiculos.create.mockResolvedValue({ public_id: 'v-uuid' });
      const d = { ...dto, indice_principal: 1 } as CreateVeiculoDto;

      const res = await service.createVeiculo(d, [foto(), foto()]);

      expect(res).toEqual({ message: 'Veículo criado com sucesso', public_id: 'v-uuid' });
      expect(categoriaService.getIdByPublicId).toHaveBeenCalledWith('cat-uuid');
      expect(modeloService.getIdByPublicId).toHaveBeenCalledWith('mod-uuid');

      const { data } = prisma.veiculos.create.mock.calls[0][0];
      expect(data.categorias).toEqual({ connect: { id: 10 } });
      expect(data.modelo).toEqual({ connect: { id: 20 } });
      expect(data.cores).toEqual({ connect: [{ public_id: 'cor-uuid' }] });
      expect(data.imagens.create).toHaveLength(2);
      expect(data.imagens.create[0].principal).toBe(false);
      expect(data.imagens.create[1].principal).toBe(true);
      expect(data.imagens.create[0].url).toMatch(/^veiculos\/.+\.webp$/);
    });

    it('usa a primeira foto como principal quando não informa o índice', async () => {
      prisma.veiculos.create.mockResolvedValue({ public_id: 'v-uuid' });

      await service.createVeiculo(dto, [foto(), foto()]);

      const { data } = prisma.veiculos.create.mock.calls[0][0];
      expect(data.imagens.create[0].principal).toBe(true);
      expect(data.imagens.create[1].principal).toBe(false);
    });

    it('se uma foto falhar, apaga as que já subiram e não salva no banco', async () => {
      storage.upload
        .mockResolvedValueOnce('veiculos/ok.webp')
        .mockRejectedValueOnce(new Error('falhou'));

      await expect(service.createVeiculo(dto, [foto(), foto()]))
        .rejects.toBeInstanceOf(BadRequestException);

      expect(storage.remove).toHaveBeenCalledWith(['veiculos/ok.webp']);
      expect(prisma.veiculos.create).not.toHaveBeenCalled();
    });

    it('se o banco falhar, apaga as fotos enviadas (placa duplicada)', async () => {
      prisma.veiculos.create.mockRejectedValue(erroPrisma('P2002'));

      await expect(service.createVeiculo(dto, [foto()]))
        .rejects.toThrow('Já existe um veículo com essa placa');

      expect(storage.remove).toHaveBeenCalledTimes(1);
      expect(storage.remove.mock.calls[0][0]).toHaveLength(1);
    });
  });

  // ───────────────────────── getAllVeiculos ─────────────────────────
  describe('getAllVeiculos', () => {
    it('lista só os ativos e troca a chave pela URL pública', async () => {
      prisma.veiculos.findMany.mockResolvedValue([
        { public_id: 'v1', nome: 'CG', imagens: [{ url: 'veiculos/a.webp' }] },
      ]);

      const res = await service.getAllVeiculos();

      expect(prisma.veiculos.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ativo: true } }));
      expect(res[0].imagens[0].url).toBe('https://cdn.teste/veiculos/a.webp');
    });

    it('devolve lista vazia quando não há veículos', async () => {
      prisma.veiculos.findMany.mockResolvedValue([]);
      expect(await service.getAllVeiculos()).toEqual([]);
    });
  });

  // ───────────────────────── getVeiculo ─────────────────────────
  describe('getVeiculo', () => {
    it('lança NotFound quando o veículo não existe', async () => {
      prisma.veiculos.findUnique.mockResolvedValue(null);
      await expect(service.getVeiculo('x')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('devolve o veículo com as URLs públicas das fotos', async () => {
      prisma.veiculos.findUnique.mockResolvedValue({
        public_id: 'v1',
        imagens: [
          { public_id: 'i1', url: 'veiculos/a.webp', principal: true },
          { public_id: 'i2', url: 'veiculos/b.webp', principal: false },
        ],
      });

      const res = await service.getVeiculo('v1');

      expect(prisma.veiculos.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { public_id: 'v1' } }));
      expect(res.imagens.map((i) => i.url)).toEqual([
        'https://cdn.teste/veiculos/a.webp',
        'https://cdn.teste/veiculos/b.webp',
      ]);
    });
  });

  // ───────────────────────── definirPrincipal ─────────────────────────
  describe('definirPrincipal', () => {
    it('lança NotFound quando a imagem não existe', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue(null);

      await expect(service.definirPrincipal('v1', 'i1')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('desmarca todas e marca a escolhida', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue({ id: 7, veiculo_id: 5 });

      await service.definirPrincipal('v1', 'i1');

      expect(prisma.imagem_Veiculos.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'i1', veiculo: { public_id: 'v1' } },
      });
      expect(prisma.imagem_Veiculos.updateMany).toHaveBeenCalledWith({
        where: { veiculo_id: 5 }, data: { principal: false },
      });
      expect(prisma.imagem_Veiculos.update).toHaveBeenCalledWith({
        where: { id: 7 }, data: { principal: true },
      });
    });
  });

  // ───────────────────────── removerImagem ─────────────────────────
  describe('removerImagem', () => {
    const imagem = { id: 1, veiculo_id: 5, url: 'veiculos/a.webp', principal: false };

    it('lança NotFound quando a imagem não existe', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue(null);
      await expect(service.removerImagem('v1', 'i1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('não deixa apagar a única foto do veículo', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue(imagem);
      prisma.imagem_Veiculos.count.mockResolvedValue(1);

      await expect(service.removerImagem('v1', 'i1')).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.imagem_Veiculos.delete).not.toHaveBeenCalled();
      expect(storage.remove).not.toHaveBeenCalled();
    });

    it('apaga uma foto comum sem mexer na principal', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue(imagem);
      prisma.imagem_Veiculos.count.mockResolvedValue(3);

      await service.removerImagem('v1', 'i1');

      expect(prisma.imagem_Veiculos.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.imagem_Veiculos.update).not.toHaveBeenCalled();
      expect(storage.remove).toHaveBeenCalledWith(['veiculos/a.webp']);
    });

    it('apagando a principal, promove outra foto', async () => {
      prisma.imagem_Veiculos.findFirst
        .mockResolvedValueOnce({ ...imagem, principal: true }) // a que será apagada
        .mockResolvedValueOnce({ id: 9 });                     // a que vira principal
      prisma.imagem_Veiculos.count.mockResolvedValue(2);

      await service.removerImagem('v1', 'i1');

      expect(prisma.imagem_Veiculos.update).toHaveBeenCalledWith({
        where: { id: 9 }, data: { principal: true },
      });
    });

    it('se o banco falhar, não apaga o arquivo do bucket', async () => {
      prisma.imagem_Veiculos.findFirst.mockResolvedValue(imagem);
      prisma.imagem_Veiculos.count.mockResolvedValue(3);
      prisma.$transaction.mockRejectedValue(new Error('banco caiu'));

      await expect(service.removerImagem('v1', 'i1')).rejects.toThrow('banco caiu');
      expect(storage.remove).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── updateVeiculo ─────────────────────────
  describe('updateVeiculo', () => {
    it('atualiza e liga categoria e cores pelo public_id', async () => {
      prisma.veiculos.update.mockResolvedValue({});

      const res = await service.updateVeiculo({
        public_id: 'v1', nome: 'Nova', categoria_id: 'cat-1', cores: ['c1', 'c2'],
      });

      expect(res).toEqual({ message: 'Veículo atualizado com sucesso' });
      const arg = prisma.veiculos.update.mock.calls[0][0];
      expect(arg.where).toEqual({ public_id: 'v1' });
      expect(arg.data.categorias).toEqual({ connect: { public_id: 'cat-1' } });
      expect(arg.data.cores).toEqual({ set: [{ public_id: 'c1' }, { public_id: 'c2' }] });
    });

    it('não mexe em modelo e cores quando não são enviados', async () => {
      prisma.veiculos.update.mockResolvedValue({});

      await service.updateVeiculo({ public_id: 'v1', nome: 'Nova' });

      const { data } = prisma.veiculos.update.mock.calls[0][0];
      expect(data.modelo).toBeUndefined();
      expect(data.cores).toBeUndefined();
    });

    it('P2025 vira NotFound', async () => {
      prisma.veiculos.update.mockRejectedValue(erroPrisma('P2025'));
      await expect(service.updateVeiculo({ public_id: 'x' })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('P2002 vira BadRequest (placa duplicada)', async () => {
      prisma.veiculos.update.mockRejectedValue(erroPrisma('P2002'));
      await expect(service.updateVeiculo({ public_id: 'x' })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('erro desconhecido é repassado do jeito que veio', async () => {
      prisma.veiculos.update.mockRejectedValue(new Error('boom'));
      await expect(service.updateVeiculo({ public_id: 'x' })).rejects.toThrow('boom');
    });
  });

  // ───────────────────────── deleteVeiculo ─────────────────────────
  describe('deleteVeiculo', () => {
    it('lança NotFound quando o veículo não existe', async () => {
      prisma.veiculos.findUnique.mockResolvedValue(null);

      await expect(service.deleteVeiculo('x')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.veiculos.delete).not.toHaveBeenCalled();
    });

    it('apaga o veículo e depois as fotos do bucket', async () => {
      prisma.veiculos.findUnique.mockResolvedValue({
        imagens: [{ url: 'veiculos/a.webp' }, { url: 'veiculos/b.webp' }],
      });
      prisma.veiculos.delete.mockResolvedValue({});

      const res = await service.deleteVeiculo('v1');

      expect(res).toEqual({ message: 'Veículo deletado com sucesso!' });
      expect(prisma.veiculos.delete).toHaveBeenCalledWith({ where: { public_id: 'v1' } });
      expect(storage.remove).toHaveBeenCalledWith(['veiculos/a.webp', 'veiculos/b.webp']);
    });

    it('se o banco falhar, mantém as fotos no bucket', async () => {
      prisma.veiculos.findUnique.mockResolvedValue({ imagens: [{ url: 'veiculos/a.webp' }] });
      prisma.veiculos.delete.mockRejectedValue(erroPrisma('P2025'));

      await expect(service.deleteVeiculo('v1')).rejects.toBeInstanceOf(NotFoundException);
      expect(storage.remove).not.toHaveBeenCalled();
    });
  });
});