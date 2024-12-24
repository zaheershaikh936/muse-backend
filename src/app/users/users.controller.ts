import { Controller, Body, UseGuards, Patch, Param, Get, Query, Delete } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';
import { ProfileService } from '../mentor/profile/profile.service';
import { User } from 'src/utils/decorator/user.decorator';
import { MentorBookingService } from '../bookings/mentor-booking/bookingsMentor.service';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private profileService: ProfileService,
    private readonly bookingService: MentorBookingService,
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/bookings')
  async getUserBookings(@User('_id') id: string, @Query('status') status: string, @Query('limit') limit: number, @Query('page') page: number) {
    const filter = {
      status: status?.length ? status.split(',') : [],
      limit: limit || 10,
      page: page || 1,
    }
    return this.bookingService.getUserBookings(id, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/booking/:id')
  async getUserBookingById(@Param('id') id: string) {
    return this.bookingService.getUserBookingById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/booking/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
