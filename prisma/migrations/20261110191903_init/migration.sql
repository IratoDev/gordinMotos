-- CreateEnum
CREATE TYPE "TiposEventos" AS ENUM ('VISUALIZOU', 'BUSCOU', 'CLICOU_WHATSAPP');

-- CreateEnum
CREATE TYPE "Combustivel" AS ENUM ('GASOLINA', 'ETANOL', 'FLEX', 'DIESEL', 'ELETRICO', 'HIBRIDO');

-- CreateTable
CREATE TABLE "veiculos" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ano_fab" INTEGER NOT NULL,
    "detalhes" TEXT,
    "opicionais" TEXT,
    "km" INTEGER NOT NULL,
    "placa" TEXT NOT NULL,
    "destaque" BOOLEAN NOT NULL,
    "combustivel" "Combustivel" NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "modelo_id" INTEGER NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagem_veiculos" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagem_veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_veiculos" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ano_mod" INTEGER NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modelos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cores" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "hexadecimal" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "celular" TEXT,
    "telefone" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "aprovada" BOOLEAN NOT NULL DEFAULT false,
    "texto" TEXT,
    "cliente_id" INTEGER NOT NULL,
    "estrelas" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "veiculo_id" INTEGER,
    "tipo" "TiposEventos" NOT NULL,
    "termo_busca" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoresToVeiculos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CoresToVeiculos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_public_id_key" ON "veiculos"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_key" ON "veiculos"("placa");

-- CreateIndex
CREATE INDEX "veiculos_modelo_id_idx" ON "veiculos"("modelo_id");

-- CreateIndex
CREATE INDEX "veiculos_categoria_id_idx" ON "veiculos"("categoria_id");

-- CreateIndex
CREATE UNIQUE INDEX "imagem_veiculos_public_id_key" ON "imagem_veiculos"("public_id");

-- CreateIndex
CREATE INDEX "imagem_veiculos_veiculo_id_idx" ON "imagem_veiculos"("veiculo_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_veiculos_public_id_key" ON "categorias_veiculos"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "modelos_public_id_key" ON "modelos"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "modelos_marca_id_descricao_ano_mod_key" ON "modelos"("marca_id", "descricao", "ano_mod");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_public_id_key" ON "marcas"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "cores_public_id_key" ON "cores"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_public_id_key" ON "clientes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_public_id_key" ON "avaliacao"("public_id");

-- CreateIndex
CREATE INDEX "avaliacao_veiculo_id_aprovada_idx" ON "avaliacao"("veiculo_id", "aprovada");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_cliente_id_veiculo_id_key" ON "avaliacao"("cliente_id", "veiculo_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_public_id_key" ON "usuario"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_public_id_key" ON "eventos"("public_id");

-- CreateIndex
CREATE INDEX "eventos_tipo_criado_em_idx" ON "eventos"("tipo", "criado_em");

-- CreateIndex
CREATE INDEX "eventos_veiculo_id_tipo_idx" ON "eventos"("veiculo_id", "tipo");

-- CreateIndex
CREATE INDEX "_CoresToVeiculos_B_index" ON "_CoresToVeiculos"("B");

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias_veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_modelo_id_fkey" FOREIGN KEY ("modelo_id") REFERENCES "modelos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_veiculos" ADD CONSTRAINT "imagem_veiculos_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos" ADD CONSTRAINT "modelos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoresToVeiculos" ADD CONSTRAINT "_CoresToVeiculos_A_fkey" FOREIGN KEY ("A") REFERENCES "cores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoresToVeiculos" ADD CONSTRAINT "_CoresToVeiculos_B_fkey" FOREIGN KEY ("B") REFERENCES "veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
