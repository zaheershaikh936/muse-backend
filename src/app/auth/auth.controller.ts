import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { LoginDTO, RegisterDTO } from './dto';
import { LoginService } from './login/login.service';
import { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private registerService: RegisterService, private loginService: LoginService) { }

    @Post('/login')
    async login(@Body() loginDto: LoginDTO, @Res({ passthrough: true }) response: Response) {
        const data = await this.loginService.login(loginDto)
        response.cookie('refresh_token', data.token.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
        return data
    }

    @Get('/access-token')
    refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: any) {
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) throw new Error('Please login again')
        return this.registerService.generateAccessToken(refreshToken)
    }

    @Post('/logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('refresh_token')
        return { success: true }
    }

    @Post('/register')
    registerUser(@Body() registerDTO: RegisterDTO) { return this.registerService.create(registerDTO); }

}
