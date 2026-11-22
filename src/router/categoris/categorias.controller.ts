import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoriService } from "./categoria.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";
import { CreateCategoriaDto, UpdateCategoriaDto } from "./dto/categoria.dto.js";



@Controller('categori')
export class CategoriController{

    constructor( private readonly categoriService: CategoriService){}
    
    @Get('all')
    findAll(){
        return this.categoriService.getAllCategoras()
    }

    @UseGuards(AuthTokenGuard)
    @Post()
    create(
    @Body() categoriData:CreateCategoriaDto,
    ){
        return this.categoriService.createCategoria(categoriData)
    }



    @UseGuards(AuthTokenGuard)
    @Patch()
    patch(
    @Body() categoriData: UpdateCategoriaDto,
    ){
        return this.categoriService.updateCategoriaes(categoriData)
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    delete(
    @Param('id') id: string   
    ){
        return this.categoriService.deleteCategoria(id)
    }

}