import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
}
