import { Module, forwardRef } from '@nestjs/common';
import { BookingsService } from './booking/bookings.service';
import { MentorBookingService } from './mentor-booking/bookingsMentor.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/schemas';
import { MentorModule, PaymentModule, UsersModule, } from '../index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => MentorModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, MentorBookingService],
  exports: [MentorBookingService, BookingsService]
})
export class BookingsModule { }
