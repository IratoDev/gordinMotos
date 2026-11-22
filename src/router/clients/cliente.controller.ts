import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ClienteService } from "./clientes.service.js";
import { AuthTokenGuard } from "../../auth/guard/auth-token.guard.js";



@Controller('client')
export class ClientController {

constructor (private readonly clienteService: ClienteService){}


@Post('signup')
create (
@Body() clienteData: any,
){
    return this.clienteService.createCliente(clienteData)
}

@UseGuards(AuthTokenGuard)
@Get('all')
findAll(){

    return this.clienteService.getAllClientes()

}

@UseGuards(AuthTokenGuard)
@Patch('update')
update(
@Body() clienteData: any,
){
    return this.clienteService.updateclientes(clienteData)
}

}