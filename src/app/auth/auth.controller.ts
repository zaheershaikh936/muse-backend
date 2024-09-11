import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { LoginDTO, RegisterDTO } from './dto';
import { LoginService } from './login/login.service';

@Controller('auth')
export class AuthController {
    constructor(private registerService: RegisterService, private loginService: LoginService) { }

    @Post('/login')
    login(@Body() loginDto: LoginDTO) { return this.loginService.login(loginDto) }

    @Post('/register')
    registerUser(@Body() registerDTO: RegisterDTO) { return this.registerService.create(registerDTO); }

}
