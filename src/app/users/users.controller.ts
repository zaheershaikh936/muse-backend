import { Controller, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';
import { ProfileService } from '../mentor/profile/profile.service';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private profileService: ProfileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    try {
      updateUserDto.updatedAt = new Date();
      if (updateUserDto.isMentor) {
        const mentor = await this.profileService.create({ userId: id });
        console.log(mentor);
      }
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
