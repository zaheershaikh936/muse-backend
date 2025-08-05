import {
  Controller,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  Delete,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './user/users.service';
import { BecomeMentorDto, UpdateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';
import { User } from 'src/utils/decorator/user.decorator';
import { MentorBookingService } from '../bookings/mentor-booking/bookingsMentor.service';
import { slugHelper } from 'src/utils/helper/slug-helper';
import { getIso2Code } from 'src/utils/api/getLocation';
import { ProfileService } from '../mentor/profile/profile.service';
import { RoleService } from '../role/role/role.service';
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly bookingService: MentorBookingService,
    private readonly mentorProfileService: ProfileService,
    private readonly roleService: RoleService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    try {
      updateUserDto.updatedAt = new Date();
      delete updateUserDto.email;
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bookings')
  async getUserBookings(
    @User('_id') id: string,
    @Query('status') status: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const filter = {
      status: status?.length ? status.split(',') : [],
      limit: limit || 10,
      page: page || 1,
    };
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/become-mentor')
  async becomeMentor(
    @Body() becomeMentor: BecomeMentorDto,
    @User() user: { email: string; _id: string },
  ): Promise<any> {
    const isExist = await this.usersService.isExist(user._id);
    if (isExist)
      throw new HttpException(
        'You already have a mentor profile. please contact support team.',
        HttpStatus.BAD_REQUEST,
      );
    const { flag, iso2 } = await getIso2Code(becomeMentor.country);
    becomeMentor.user = {} as {
      name: string;
      email: string;
      userId: string;
      image: string;
    };
    becomeMentor.location = {} as {
      country: string;
      city: string;
      flag?: string;
      iso2?: string;
    };
    becomeMentor.userId = user._id;
    becomeMentor.user.email = user?.email;
    becomeMentor.user.name = becomeMentor.name;
    becomeMentor.user.userId = slugHelper(becomeMentor.name);
    becomeMentor.ratings = 0;
    becomeMentor.verified = false;
    becomeMentor.bio = becomeMentor.bio;
    becomeMentor.location = {
      country: becomeMentor.country,
      city: becomeMentor.city,
      flag: flag,
      iso2: iso2,
    };
    const role = await this.roleService.findOne(becomeMentor.role);
    becomeMentor.profession = {
      _id: role.profession._id,
      name: role.profession.name,
      slag: role.profession.slag,
    } as any;
    becomeMentor.role = {
      _id: role._id,
      name: role.name,
      slag: role.slag,
    } as any;
    delete becomeMentor.name;
    return await this.mentorProfileService.create(becomeMentor);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/approve-mentor/:id')
  async approveMentorById(@Param('id') id: string): Promise<any> {
    return this.usersService.update(id, {
      isMentor: true,
      verified: true,
      updatedAt: new Date(),
    });
  }
}
