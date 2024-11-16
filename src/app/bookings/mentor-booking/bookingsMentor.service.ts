import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { MentorFilterType } from "src/app/mentor/dto/mentor.dto";
import { Booking } from "src/schemas";

const ObjectId = mongoose.Types.ObjectId
export class MentorBookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

    async bookingKpi(id: string) {
        const totalBookingThisMonth = await this.bookingModel.countDocuments({
            mentorId: new ObjectId(id),
            isPaid: true,
            status: { $in: ['accepted', 'paid'] },
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date()
            }
        });
        const totalBooking = await this.bookingModel.countDocuments({
            mentorId: new ObjectId(id),
            isPaid: true,
            status: { $in: ['accepted', 'paid', 'cancelled'] },
        })
        const cancelBookingThisMonth = await this.bookingModel.countDocuments({
            mentorId: new ObjectId(id),
            isPaid: true,
            status: 'cancelled',
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date()
            }
        });
        const cancelBookings = await this.bookingModel.countDocuments({
            mentorId: new ObjectId(id),
            isPaid: true,
            status: 'cancelled',
        })
        const [{ totalEarningThisMonth = 0 }] = await this.bookingModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date()
                    },
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarningThisMonth: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    totalEarningThisMonth: { $ifNull: ["$totalEarningThisMonth", 0] }
                }
            }
        ])
        const [{ totalEarning = 0 }] = await this.bookingModel.aggregate([
            {
                $match: {
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarning: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    totalEarning: { $ifNull: ["$totalEarning", 0] }
                }
            }
        ])
        return { totalBookingThisMonth, totalBooking, cancelBookingThisMonth, cancelBookings, totalEarningThisMonth, totalEarning }
    }

    async mentorBookings(id: string, filter: MentorFilterType) {
        const pipeline = [];
        if (filter?.status?.length) {
            pipeline.push({ $match: { status: { $in: filter.status } } })
        }
        const [{ total = 0 }] = await this.bookingModel.aggregate([{ $match: { mentorId: new ObjectId(id), isPaid: true, } }, ...pipeline, { $count: "total" }])
        pipeline.push({ $skip: (filter.page - 1) * filter.limit })
        pipeline.push()
        const data = await this.bookingModel.aggregate([
            {
                $match: {
                    mentorId: new ObjectId(id),
                    isPaid: true
                }
            },
            ...pipeline,
            {
                $project: {
                    user: 1,
                    mentor: 1,
                    userId: 1,
                    mentorId: 1,
                    booking: 1,
                    status: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ])
        return { total, totalPage: Math.ceil(total / filter.limit), data }
    }
}