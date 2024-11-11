import { Controller, Post, Body, UseGuards, Param, Patch, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorator/user.decorator';
import { UsersService } from '../users/user/users.service';
import { MentorService } from '../mentor/mentor/mentor.service';
import { decryptBookingData } from 'src/utils/helper/booking-encrypt-decrypt'
@UseGuards(AuthGuard('jwt'))
@Controller('booking')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly userService: UsersService,
    private readonly mentorService: MentorService
  ) { }

  @Patch('/payment/:id')
  async updatePayment(@Param() id: string) {
    return this.bookingsService.updateBookingPayment(id);
  }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @User('_id') id: string) {
    createBookingDto.userId = id;
    const user = await this.userService.findOneForBooking(id)
    const mentor = await this.mentorService.findOneForBooking(createBookingDto.mentorId)
    createBookingDto.user = {
      name: user.name,
      email: user.email,
      image: user.image
    }
    createBookingDto.mentor = {
      name: mentor.user.name,
      email: mentor.user.email,
      image: mentor.user.image
    }
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Patch('/conform/:id/booking')
  async ConformBooking(@Param() id: string) {
    return this.bookingsService.updateConformBooking(id);
  }

  @Get('/:url')
  async findBooking(@Param('url') url: string) {
    const data = decryptBookingData(url);
    const booking: string[] = data.split('__');
    const id = booking[0];
    return this.bookingsService.findOneById(id)
  }
}
