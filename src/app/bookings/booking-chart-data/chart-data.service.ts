import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from 'src/schemas';

export class ChartDataService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async bookingKpi(id: string) {
    const getWeekLabelsForMonth = await this.getWeeklyBookingChartData(id);
    const totalBooking = await this.bookingModel.countDocuments({
      mentorId: new ObjectId(id),
      isPaid: true,
      status: { $in: ['accepted', 'paid', 'cancelled'] },
    });
    const cancelBookingThisMonth = await this.bookingModel.countDocuments({
      mentorId: new ObjectId(id),
      isPaid: true,
      status: 'cancelled',
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        $lt: new Date(),
      },
    });
    const cancelBookings = await this.bookingModel.countDocuments({
      mentorId: new ObjectId(id),
      isPaid: true,
      status: 'cancelled',
    });
    const [{ totalEarningThisMonth = 0 }] = await this.bookingModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(),
          },
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          totalEarningThisMonth: { $sum: '$amount' },
        },
      },
      {
        $project: {
          totalEarningThisMonth: { $ifNull: ['$totalEarningThisMonth', 0] },
        },
      },
    ]);
    const [{ totalEarning = 0 }] = await this.bookingModel.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: null,
          totalEarning: { $sum: '$amount' },
        },
      },
      {
        $project: {
          totalEarning: { $ifNull: ['$totalEarning', 0] },
        },
      },
    ]);
    return {
      getWeekLabelsForMonth,
      totalBooking,
      cancelBookingThisMonth,
      cancelBookings,
      totalEarningThisMonth,
      totalEarning,
    };
  }

  private getWeekLabelsForMonth(date: Date): string[] {
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const totalDays = end.getDate();
    const totalWeeks = Math.ceil(totalDays / 7);
    return Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`);
  }

  async getWeeklyBookingChartData(mentorId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const mentorObjectId = new ObjectId(mentorId);

    const rawData = await this.bookingModel.aggregate([
      {
        $match: {
          mentorId: new ObjectId('685c16e0c65988d273fe3265'),
          isPaid: true,
          status: 'completed',
          createdAt: {
            $gte: startOfMonth,
            $lt: now,
          },
        },
      },
      {
        $addFields: {
          week: {
            $ceil: {
              $divide: [
                { $subtract: ['$createdAt', startOfMonth] },
                1000 * 60 * 60 * 24 * 7,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$week',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const weekLabels = this.getWeekLabelsForMonth(now);

    const chartData = weekLabels.map((label, index) => {
      const weekData = rawData.find((item) => item._id === index + 1);
      return {
        key: label,
        count: weekData ? weekData.count : 0,
      };
    });

    return chartData;
  }
}
