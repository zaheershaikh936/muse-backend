import { Module, forwardRef } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/schemas';
import { MentorModule, UsersModule } from '../index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => MentorModule),

  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }
