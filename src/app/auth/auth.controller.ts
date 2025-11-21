import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RegisterService } from './register/register.service';
import {
  ForgetPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetForgetPasswordDTO,
  SocialRegisterDTO,
  VerifyForgetPasswordDTO,
} from './dto';
import { LoginService } from './login/login.service';
import { Response, Request } from 'express';
import { SocialAuthService } from './social-auth/social-auth.services';
import { ForgetPasswordService } from './forget-password/forget-password.service';
import { FirebaseService } from '../firebase/firebase.service';
@Controller('auth')
export class AuthController {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService,
    private socialAuthService: SocialAuthService,
    private firebaseService: FirebaseService,
    private forgetPasswordService: ForgetPasswordService,
  ) {}

  @Post('/login')
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.loginService.login(loginDto);
    response.cookie('refresh_token', data.token.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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

  @Post('/social-register')
  async socialRegister(@Body() socialRegisterBody: SocialRegisterDTO) {
    switch (socialRegisterBody.provider) {
      case 'github':
        Logger.log('Github Auth');
        return this.socialAuthService.githubAuth(socialRegisterBody);
      case 'google':
        await this.firebaseService.firebaseUserIsExist(
          socialRegisterBody.email,
        );
        return this.socialAuthService.googleAuth(socialRegisterBody);
      default:
        break;
    }
  }

  @Post('/forget-password')
  async forgetPassword(@Body() forgetPasswordDTO: ForgetPasswordDTO) {
    return this.forgetPasswordService.forgetPassword(forgetPasswordDTO);
  }

  @Post('/verify/forget-password')
  async verifyForgetPassword(
    @Body() verifyForgetPasswordDTO: VerifyForgetPasswordDTO,
  ) {
    return this.forgetPasswordService.verifyForgetPassword(
      verifyForgetPasswordDTO,
    );
  }

  @Post('/reset/forget-password')
  async resetForgetPassword(
    @Body() verifyForgetPasswordDTO: ResetForgetPasswordDTO,
  ) {
    return this.forgetPasswordService.resetForgetPassword(
      verifyForgetPasswordDTO,
    );
  }
}
