import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { MarcasService } from "./brands.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brands.dto.js";


@Controller('brands')
export class MarcaController {

    constructor( private readonly marcasSevice: MarcasService) {}

/* rotas publicas */
    @Get('all')
    getAllMarcas(){
        return this.marcasSevice.getAllMarcas()
    }
    

/* rotas admin */

    @UseGuards(AuthTokenGuard)
    @Post()
    create(
    @Body() data:CreateBrandDto
    ){
        return this.marcasSevice.createMarcas(data)
    }
    
    @UseGuards(AuthTokenGuard)
    @Patch()
    updateMarca(
    @Body() data: UpdateBrandDto
    ){
        return this.marcasSevice.updateMarcas( data)
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    deleteMarca(
    @Param('id') marcaId: string,
    ){
        return this.marcasSevice.deleteMarcas( marcaId)
    }


}