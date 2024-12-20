import { Module, forwardRef } from '@nestjs/common';
import { AvailabilityService } from './availability/availability.service';
import { AvailabilityController } from './availability.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Availability, AvailabilitySchema } from 'src/schemas';
import { MentorModule } from '../mentor/mentor.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
    forwardRef(() => MentorModule),
    forwardRef(() => BookingsModule),

  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule { }
