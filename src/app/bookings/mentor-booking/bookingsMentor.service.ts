import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MentorFilterType } from 'src/app/mentor/dto/mentor.dto';
import { Booking } from 'src/schemas';
import { decryptBookingData } from 'src/utils/helper/booking-encrypt-decrypt';

const ObjectId = mongoose.Types.ObjectId;
export class MentorBookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async mentorBookings(id: string, filter: MentorFilterType) {
    const pipeline = [];
    if (filter?.status?.length) {
      pipeline.push({ $match: { status: { $in: filter.status } } });
    }
    const [{ total = 0 }] = await this.bookingModel.aggregate([
      { $match: { mentorId: new ObjectId(id), isPaid: true } },
      ...pipeline,
      { $count: 'total' },
    ]);
    pipeline.push({ $skip: (filter.page - 1) * filter.limit });
    pipeline.push({ $limit: filter.limit });

    const data = await this.bookingModel.aggregate([
      {
        $match: {
          mentorId: new ObjectId(id),
          isPaid: true,
        },
      },
      ...pipeline,
      {
        $project: {
          user: 1,
          mentor: 1,
          userId: 1,
          mentorId: 1,
          booking: 1,
          status: 1,
          uniqueUrl: 1,
          refundDetails: 1,
          cancelReason: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return { total, totalPage: Math.ceil(total / filter.limit), data };
  }

  async getUserBookings(id: string, filter: MentorFilterType) {
    const pipeline = [];
    if (filter?.status?.length)
      pipeline.push({ $match: { status: { $in: filter.status } } });
    const [{ total = 0 }] = await this.bookingModel.aggregate([
      { $match: { userId: new ObjectId(id) } },
      ...pipeline,
      { $count: 'total' },
    ]);
    pipeline.push({ $skip: (filter.page - 1) * filter.limit });
    pipeline.push({ $limit: filter.limit });
    const data = await this.bookingModel.aggregate([
      {
        $match: { userId: new ObjectId(id) },
      },
      ...pipeline,
      {
        $project: {
          _id: 0,
          mentor: 1,
          userId: 1,
          booking: 1,
          status: 1,
          uniqueUrl: 1,
          pendingPaymentUrl: {
            $cond: {
              if: { $eq: ['$status', 'pending'] },
              then: { $arrayElemAt: ['$payment.links.href', 1] },
              else: null,
            },
          },
          paymentId: '$payment.payment_url',
          refundDetails: 1,
          cancelReason: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return { total, totalPage: Math.ceil(total / filter.limit), data };
  }

  getUserBookingById(url: string) {
    const decorData = decryptBookingData(url);
    return this.bookingModel
      .findById(
        {
          status: { $in: ['accepted', 'completed', 'paid'] },
          _id: new ObjectId(decorData[0]),
        },
        {
          currency: 1,
          user: 1,
          mentor: 1,
          booking: 1,
          status: 1,
          amount: 1,
          notes: 1,
          isPaid: 1,
          createdAt: 1,
          'payment.orderId': 1,
          'payment.create_time': 1,
        },
      )
      .lean()
      .exec();
  }

  deleteBooking(url: string) {
    const decorData = decryptBookingData(url);
    return this.bookingModel.deleteOne({ _id: new ObjectId(decorData[0]) });
  }
}
