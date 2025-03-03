import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MagicLinkService } from 'src/app/magic-link/magic-link/magic-link.service';
import {
  ForgetPasswordDTO,
  ResetForgetPasswordDTO,
  VerifyForgetPasswordDTO,
} from '../dto';
import { UsersService } from 'src/app/users/user/users.service';
import { forgetPasswordTemplate } from 'src/utils/email-template';

@Injectable()
export class ForgetPasswordService {
  constructor(
    private readonly magicLinkService: MagicLinkService,
    private readonly userService: UsersService,
  ) {}

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
    const isExist = await this.userService.isExist(forgetPasswordDTO.email);
    if (!isExist)
      throw new HttpException('Invalid email', HttpStatus.NOT_FOUND);
    const magicLink = await this.magicLinkService.create(
      forgetPasswordDTO.email,
    );
    await this.sendForgetPasswordEmail(forgetPasswordDTO.email, magicLink);
    return magicLink;
  }

  verifyForgetPassword(verifyForgetPasswordDTO: VerifyForgetPasswordDTO) {
    return this.magicLinkService.validateMagicLink(
      verifyForgetPasswordDTO.token,
    );
  }

  async resetForgetPassword(verifyForgetPasswordDTO: ResetForgetPasswordDTO) {
    const data = await this.magicLinkService.validateMagicLink(
      verifyForgetPasswordDTO.token,
    );
    verifyForgetPasswordDTO.email = data;
    if (
      verifyForgetPasswordDTO.password !==
      verifyForgetPasswordDTO.conformPassword
    )
      throw new HttpException(
        "Password don't not match",
        HttpStatus.BAD_REQUEST,
      );
    const result = await this.userService.resetPassword(
      verifyForgetPasswordDTO,
    );
    await this.magicLinkService.updateMagicLink(data);
    return result;
  }

  async sendForgetPasswordEmail(email: string, token: string) {
    const base_url: string =
      process.env.NODE_ENV === 'dev'
        ? process.env.REDIRECT_URL_LOCAL
        : process.env.REDIRECT_URL_PROD;
    await forgetPasswordTemplate(email, {
      RESET_LINK: `${base_url}?screen=reset-password&token=${token}`,
    });
  }
}
