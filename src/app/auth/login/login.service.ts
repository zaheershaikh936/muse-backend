import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/app/users/user/users.service';
import { LoginDTO } from '../dto';
import { compareSync } from 'bcrypt'
import { RegisterService } from '../register/register.service';
@Injectable()
export class LoginService {
    constructor(
        private readonly userService: UsersService,
        private readonly registerService: RegisterService
    ) { }

    async login(loginDto: LoginDTO) {
        const isExist = await this.userService.isExist(loginDto.email)
        if (!isExist) throw new HttpException('Invalid email', HttpStatus.NOT_ACCEPTABLE);
        const user = await this.userService.findByEmail(loginDto.email)
        const isValid = compareSync(loginDto.password, user.password)
        if (!isValid) throw new HttpException('Invalid password', HttpStatus.NOT_ACCEPTABLE);
        const accessToken = this.registerService.generateToken({ email: user.email, _id: String(user._id), role: user.role })
        const refreshToken = this.registerService.generateRefreshToken({ email: user.email, _id: String(user._id), role: user.role })
        return {
            user: { name: user.name, email: user.email, role: user.role }, token: {
                accessToken, refreshToken
            }
        }
    }
}
