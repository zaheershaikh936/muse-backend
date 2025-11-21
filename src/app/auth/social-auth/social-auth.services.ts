import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/user/users.service';
import { SocialRegisterDTO } from '../dto';
import { RegisterService } from '../register/register.service';
import axios from 'axios';
import { EmailTemplateService } from 'src/app/mail/email-template/email.template.service';

@Injectable()
export class SocialAuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly registerService: RegisterService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}
  async githubAuth(socialRegisterBody: SocialRegisterDTO) {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${socialRegisterBody.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });
    let token: { accessToken: string; refreshToken: string };
    let user;
    if (response?.status === 200) {
      const isExist = await this.userService.isExist(socialRegisterBody.email);
      if (isExist) {
        user = await this.userService.findByEmail(socialRegisterBody.email);
        const userDate = {
          email: user.email,
          _id: user._id.toString(),
          role: user.role,
        };
        token = await this.generateAccessToken(userDate);
      } else {
        user = await this.userService.socialAuthCreate(socialRegisterBody);
        const userDate = {
          email: user.email,
          _id: user._id.toString(),
          role: user.role,
        };
        token = await this.generateAccessToken(userDate);
      }
      await this.emailTemplateService.sendUserWelcome({
        name: user.name,
        email: user.email,
      });
      return {
        user: {
          sub: user._id,
          name: user.name,
          isMentor: user.isMentor,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        token: token,
      };
    }
    throw new Error('Invalid token');
  }

  async googleAuth(socialRegisterBody: SocialRegisterDTO) {
    let token: { accessToken: string; refreshToken: string };
    let user;
    const isExist = await this.userService.isExist(socialRegisterBody.email);
    if (isExist) {
      user = await this.userService.findByEmail(socialRegisterBody.email);
      const userDate = {
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
      };
      token = await this.generateAccessToken(userDate);
    } else {
      user = await this.userService.socialAuthCreate(socialRegisterBody);
      const userDate = {
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
      };
      token = await this.generateAccessToken(userDate);
    }
    await this.emailTemplateService.sendUserWelcome({
      name: user.name,
      email: user.email,
    });
    return {
      user: {
        sub: user._id,
        name: user.name,
        isMentor: user.isMentor,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      token: token,
    };
  }

  async generateAccessToken(userData: {
    email: string;
    _id: string;
    role: string;
  }) {
    const accessToken = await this.registerService.generateToken(userData);
    const refreshToken =
      await this.registerService.generateRefreshToken(userData);
    return { accessToken, refreshToken };
  }
}
