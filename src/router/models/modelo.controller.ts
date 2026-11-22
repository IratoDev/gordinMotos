import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ModelService } from "./modelo.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";
import { CreateModelDto, UpdateModelDto } from "./dto/modelos.dto.js";


@Controller('model')
export class ModelController {

    constructor( private readonly modelSevice: ModelService) {}
    

/* rotas admin */

    @UseGuards(AuthTokenGuard)
    @Post()
    create(
    @Body() data:CreateModelDto
    ){
        return this.modelSevice.createModelo(data)
    }
    
    @UseGuards(AuthTokenGuard)
    @Put()
    update(
    @Body() data: UpdateModelDto
    ){
        return this.modelSevice.updateModelos(data)
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    delete(
    @Param('id') id:string,
    ){
        return this.modelSevice.deleteModelo(id)
    }


}