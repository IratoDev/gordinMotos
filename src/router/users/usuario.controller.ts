import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UsuarioService } from "./usuarius.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto.js";


@Controller('user')
export class UsuarioController {

constructor (private readonly usuarioService: UsuarioService){}


@Post('signup')
create(
@Body() usuarioData: CreateUserDto,
){
    return this.usuarioService.createUsuario(usuarioData)
}

@UseGuards(AuthTokenGuard)
@Get('all')
findAll(){
    return this.usuarioService.getAllUsuarios()
}

@UseGuards(AuthTokenGuard)
@Patch()
update(
@Body() usuarioData: UpdateUserDto,
){
    return this.usuarioService.updateUsuario(usuarioData)
}

@UseGuards(AuthTokenGuard)
@Delete(':id')
delete(
@Param('id') id:string,
){
    return this.usuarioService.deleteUsuario(id)
}

}