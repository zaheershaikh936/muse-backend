import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, versionKey: false })
export class Booking {
    @Prop({
        required: false,
        type: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, required: false },
        },
    })
    user: {
        name: string;
        email: string;
        image: string;
    };

    @Prop({
        required: false,
        type: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, required: false },
        },
    })
    mentor: {
        name: string;
        email: string;
        image: string;
    };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
    userId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'mentors', required: true })
    mentorId: string;

    @Prop({
        required: false,
        type: {
            day: { type: String, required: true },
            bookingDate: { type: Date, required: true },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: false },
            startTimeString: { type: String, required: true },
            endTimeString: { type: String, required: false },
        },
    })
    booking: {
        day: string;
        bookingDate: Date;
        startTimeString: string;
        endTimeString: string;
        startTime: Date;
        endTime: Date;
    };

    @Prop({ type: String, enum: ['pending', 'paid', 'confirmed', 'canceled'], default: 'pending' })
    status: string;

    @Prop({ type: Number, required: true })
    amount: number;

    @Prop({ type: String, required: true, default: 'AED' })
    currency: string;

    @Prop({ type: String })
    notes: string;

    @Prop({ type: String })
    uniqueUrl: string;

    @Prop({ type: Boolean, default: false })
    isPaid: boolean;

    @Prop({ type: Date })
    paymentDate?: Date;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
