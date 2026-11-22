import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ColorService } from "./cores.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";
import { CreateColorDto, UpdateColorDto } from "./dto/cor.dto.js";


@Controller('color')
export class ColorController {

constructor( private readonly colorService: ColorService){}


@Get('all')
findAll(){
    return this.colorService.getAllCores()
}

@UseGuards(AuthTokenGuard)
@Post()
create(
@Body() colorData:CreateColorDto,
){
    return this.colorService.createCor(colorData)
}

@UseGuards(AuthTokenGuard)
@Patch()
update(
@Body() colorData:UpdateColorDto,
){
    return this.colorService.updateCores(colorData)
}

@UseGuards(AuthTokenGuard)
@Delete(':id')
delete(
@Param('id') id:string,
){
    return this.colorService.deleteCor(id)
}

}