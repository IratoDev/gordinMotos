import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode,
  Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { VeiculosService } from './veicles.service.js';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/veicles.dto.js';
import { AuthTokenGuard } from '../../auth/guard/auth-token.guard.js';

@Controller('vehicles')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  /* rotas publicas */

  @Get('all/vehicles')
  publicFindAll() { 
    return this.veiculosService.getAllVeiculosClient();
  }


  /* rotas admin */

  @Post()
  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FilesInterceptor('imagens', 5, {
    storage: memoryStorage(),
    limits: { fileSize: 18 * 1024 * 1024 }, // 8 MB por foto
    fileFilter: (req, file, cb) => {
      if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype))
        return cb(new BadRequestException('Só imagens JPG, PNG ou WebP'), false);
      cb(null, true);
    },
  }))

  @UseGuards(AuthTokenGuard)
  create(
    @Body() dto: CreateVehicleDto,
    @UploadedFiles() imagens: Express.Multer.File[],
  ) {
    return this.veiculosService.createVeiculo(dto, imagens);
  }

  @Get('all')
  @UseGuards(AuthTokenGuard)
  findAll() { 
    return this.veiculosService.getAllVeiculos();
  }

  @UseGuards(AuthTokenGuard)
  @Patch()
  @UseInterceptors(FilesInterceptor('files'))
  update(@Body() body: UpdateVehicleDto, @UploadedFiles() files: Express.Multer.File[]) {
      return this.veiculosService.updateVeiculo(body, files);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteVeiculo(@Param('id') id: string) {
    return this.veiculosService.deleteVeiculo(id);
  }
}