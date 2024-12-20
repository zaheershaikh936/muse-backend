import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from 'src/schemas';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { encryptBookingData, decryptBookingData } from 'src/utils/helper/booking-encrypt-decrypt'
import { getBookingStatus } from 'src/utils/helper/booking-status-on-time';

const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

  createBooking(createBookingDto: CreateBookingDto) {
    return this.bookingModel.create(createBookingDto);
  }

  updateBookingPaymentDetails(_id: string, body: any) {
    return this.bookingModel.updateOne({ _id: new ObjectId(_id) },
      {
        $set: { payment: body }
      });
  }

  updateBookingPayment(_id: string) {
    return this.bookingModel.updateOne({ _id: new ObjectId(_id) }, { $set: { isPaid: true, paymentDate: new Date(), updatedAt: new Date(), status: "paid" } });
  }

  async updateBookingStatus(paymentUrl: string, body: any) {
    const decryptData: string[] = decryptBookingData(paymentUrl);
    if (body.status !== 'cancelled') body.uniqueUrl = await encryptBookingData(decryptData[0], decryptData[1], decryptData[2]);
    const data = await this.bookingModel.findByIdAndUpdate({ _id: new ObjectId(decryptData[0]) }, { $set: { ...body } }, { new: true });
    return { mentor: data.mentor, user: data.user, booking: data.booking, status: data.status, uniqueUrl: data?.uniqueUrl, amount: data?.amount, paymentId: data?.payment?.orderId, refundId: data?.payment?.refundId };
  }


  async findOneByPaymentUrl(paymentUrl: string) {
    const decryptData: string[] = await decryptBookingData(paymentUrl);
    return this.bookingModel.findById({ _id: new ObjectId(decryptData[0]), status: 'paid', isPaid: true }, { mentor: 1, user: 1, booking: 1, status: 1, uniqueUrl: 1, amount: 1 }).lean().exec();
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

  findAllByMentorId(id: string, day: string) {
    const dayInString = day.charAt(0).toUpperCase() + day.slice(1);
    return this.bookingModel.aggregate([
      {
        $match: {
          mentorId: new ObjectId(id),
          status: { $nin: ['cancelled'] },
          'booking.day': dayInString
        }
      }
    ]);
  }
}
