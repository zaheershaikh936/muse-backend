import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        if (!isExist) throw new UnauthorizedException('User not found with this email')
        const user = await this.userService.findByEmail(loginDto.email)
        const isValid = compareSync(loginDto.password, user.password)
        if (!isValid) throw new UnauthorizedException('Invalid credentials')
        const token = this.registerService.generateToken({ email: user.email, _id: String(user._id), role: user.role })
        return { user: { name: user.name, email: user.email, role: user.role }, token }
    }
}
