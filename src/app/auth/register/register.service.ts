import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from '../dto';
import { UsersService } from 'src/app/users/user/users.service';
import { welcomeEmail } from 'src/utils/email-template';
import axios from 'axios';

@Injectable()
export class RegisterService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async create(registerDTO: RegisterDTO) {
    const validateEmail = await axios.get(
      `https://emailvalidation.abstractapi.com/v1?api_key=${process.env.EMAIL_VALIDATION}&email=${registerDTO.email}`,
    );
    if (parseFloat(validateEmail.data.quality_score) < 0.8)
      throw new HttpException(
        'Temporary email addresses are not allowed. Please use a valid email address.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const isExist = await this.userService.isExist(registerDTO.email);
    if (isExist)
      throw new HttpException(
        'User already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const user = await this.userService.create(registerDTO);
    const accessToken = this.generateToken({
      email: user.email,
      _id: String(user._id),
      role: user.role,
    });
    const refreshToken = this.generateRefreshToken({
      email: user.email,
      _id: String(user._id),
      role: user.role,
    });
    await welcomeEmail(registerDTO.email.toLowerCase(), {
      name: registerDTO.name,
      website_url: process.env.WEB_URL,
    });
    return {
      user: { name: user.name, email: user.email, role: user.role },
      token: { accessToken, refreshToken },
    };
  }

  generateToken(user: { email: string; _id: string; role: string }) {
    return this.jwtService.sign(user, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
  }

  async generateAccessToken(token: string) {
    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return this.generateToken({
      email: payload.email,
      _id: payload._id,
      role: payload.role,
    });
  }

  generateRefreshToken(user: { email: string; _id: string; role: string }) {
    return this.jwtService.sign(user, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
      algorithm: 'HS512',
    });
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
