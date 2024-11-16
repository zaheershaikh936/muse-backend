import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from 'src/schemas';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { encryptBookingData } from 'src/utils/helper/booking-encrypt-decrypt'
import { getBookingStatus } from 'src/utils/helper/booking-status-on-time';

const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

  createBooking(createBookingDto: CreateBookingDto) {
    return this.bookingModel.create(createBookingDto);
  }

  updateBookingPayment(_id: string) {
    return this.bookingModel.updateOne({ _id: new ObjectId(_id) },
      {
        $set: { isPaid: true, paymentDate: new Date(), updatedAt: new Date(), status: "paid" }
      });
  }

  async updateBookingStatus(_id: string, status: string) {
    const data = await this.bookingModel.findByIdAndUpdate({ _id: new ObjectId(_id) }, { $set: { updatedAt: new Date(), status: status.toLowerCase() } }, { new: true });
    const uniqueUrl = encryptBookingData(data?._id.toString(), data?.booking?.startTime.toString(), data?.booking?.endTime.toString())
    await this.bookingModel.updateOne({ _id: new ObjectId(_id) }, { $set: { uniqueUrl } });
    return data;
  }

  async findOneById(id: string): Promise<any> {
    const data = await this.bookingModel.findById(id, { paymentDate: 0, uniqueUrl: 0, updatedAt: 0, isPaid: 0 }).lean()
    const bookingDate = String(data?.booking?.bookingDate);
    const startTime = String(data?.booking?.startTime);
    const result = getBookingStatus(bookingDate, startTime)
    return {
      ...data,
      bookingStatus: result
    }
  }
}
