import { Controller, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    try {
      updateUserDto.updatedAt = new Date();
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
