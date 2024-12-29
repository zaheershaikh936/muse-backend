import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { LoginDTO, RegisterDTO } from './dto';
import { LoginService } from './login/login.service';
import { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDTO,
  ) {
    const data = await this.loginService.login(loginDto);
    // @Res({ passthrough: true }) response: Response
    // response.cookie('refresh_token', data.token.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });
    return data;
  }

  @Get('/access-token')
  async refreshToken(@Req() request: Request) {
    const refreshToken = request.cookies['refresh_token'];
    if (!request.cookies.refresh_token)
      throw new HttpException(
        'Your are not authenticated. Please try to login.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    const isValid = await this.registerService.verifyRefreshToken(refreshToken);
    if (!isValid)
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    return this.registerService.generateAccessToken(refreshToken);
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return { success: true };
  }

  @Post('/register')
  registerUser(@Body() registerDTO: RegisterDTO) {
    return this.registerService.create(registerDTO);
  }
}
