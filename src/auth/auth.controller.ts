import { Body, Controller, Get, Headers, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/auth.dto.js";
import { RefreshTokenDto } from "./dto/refresh-token.dto.js";
import { AuthTokenGuard } from "./guard/auth-token.guard.js";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('user')
    loginUser(
    @Body()usuarioData: LoginDto,
    ) {
        return this.authService.loginUser(usuarioData)
    }

    @UseGuards(AuthTokenGuard)
    @Get('valid/')
    validUser(
    @Headers('authorization') authorization: string,
    ) {

        const [, token] = authorization.split(' ')

        return this.authService.validateUser(token)
    }

    @Post('user/refresh')
    refreshTokensUser(
    @Body() refreshTokenDto: RefreshTokenDto,
    ) {
        return this.authService.refreshTokensUser(refreshTokenDto)
    }

    @UseGuards(AuthTokenGuard)
    @Get('valid/client')
    validClient(
    @Headers('authorization') authorization: string,
    ) {

        const [, token] = authorization.split(' ')

        return  this.authService.validateClient(token)
    }

    @Post('client')
    loginClient(
    @Body()clientData: LoginDto,
    ) {
        return this.authService.loginClient(clientData)
    }

    @Post('client/refresh')
    refreshTokensClient(
    @Body() refreshTokenDto: RefreshTokenDto,
    ) {
        return this.authService.refreshTokensClient(refreshTokenDto)
    }
}