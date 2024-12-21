import { Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Availability } from 'src/schemas/availability.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
// import { updateAvailability } from 'src/utils/helper/merge.time.slot'
const { ObjectId } = mongoose.Types;
@Injectable()
export class AvailabilityService {
  constructor(@InjectModel(Availability.name) private availabilityModel: Model<Availability>) { }

  create(createAvailabilityDto: CreateAvailabilityDto) {
    try {
      return this.availabilityModel.create(createAvailabilityDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  findOne(id: string, day: string) {
    return this.availabilityModel.findOne({ mentorId: new ObjectId(id) }, { mentor: 1, [`availability.${day}`]: 1 }).lean().exec();
  }


  findAvailability(id: string) {
    return this.availabilityModel.findOne({ mentorId: new ObjectId(id) }, { userId: 1 }).lean().exec();
  }

  findAllAvailability(id: string) {
    return this.availabilityModel.findOne({ userId: new ObjectId(id) }, { _id: 1, availability: 1 }).lean().exec();
  }

  async updateOne(id: string, body: any) {
    return this.availabilityModel.findOneAndUpdate({ userId: new ObjectId(id) }, { availability: body.availability }, { new: true }).lean().exec();
  }

  findMentorAvailability(id: string) {
    return this.availabilityModel.findOne({ userId: new ObjectId(id) }, { availability: 1 }).lean().exec();
  }

  getAvailableSlots(availability: any[], bookings: any[]) {
    const currentDate = new Date();
    const slots = [];

    availability.forEach(slot => {
      const { startTime, endTime } = slot;

      let current = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ...startTime.split(':').map(Number)
      );

      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ...endTime.split(':').map(Number)
      );

      while (current < end) {
        const nextSlot = new Date(current.getTime() + 30 * 60 * 1000);

        // Check if the current slot overlaps with any booked slot
        const isBooked = bookings.some(booking => {
          const bookingStartTime = new Date(booking.booking.startTime);
          const bookingEndTime = new Date(booking.booking.endTime);

          return current >= bookingStartTime && current < bookingEndTime;
        });

        if (!isBooked) {
          slots.push({
            start_time_string: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end_time_string: nextSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            start_time: new Date(current),
            end_time: new Date(nextSlot)
          });
        }

        current = nextSlot;
      }
    });

    return slots;
  }

}


