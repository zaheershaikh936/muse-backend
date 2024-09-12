import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { RegisterDTO } from '../dto';
import { UsersService } from 'src/app/users/user/users.service';
@Injectable()
export class RegisterService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    async create(registerDTO: RegisterDTO) {
        const isExist = await this.userService.isExist(registerDTO.email)
        if (isExist) throw new UnauthorizedException('User already exist')
        const user = await this.userService.create(registerDTO)
        const token = this.generateToken({ email: user.email, _id: String(user._id), role: user.role })
        return { user: { name: user.name, email: user.email, role: user.role }, token }
    }


    generateToken(user: { email: string, _id: string, role: string }) {
        const accessToken = this.jwtService.sign(user)
        const refreshToken = this.jwtService.sign(user)
        return { accessToken, refreshToken }
    }

}
