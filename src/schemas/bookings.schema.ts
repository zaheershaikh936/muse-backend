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

    @Prop({ type: String, enum: ['pending', 'paid', 'accepted', 'cancelled', 'completed'], default: 'pending' })
    status: string;


    @Prop({
        type: {
            cancelReason: { type: String, required: true },
            email: { type: String, required: true },
            name: { type: String, required: true },
            isMentor: { type: Boolean, required: true },
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        }, required: false
    })
    cancelReason: {
        cancelReason: string;
        email: string;
        name: string;
        isMentor: boolean;
        userId: string;
    };

    @Prop({ type: Number, required: true })
    amount: number;

    @Prop({ type: String, required: true, default: 'AED' })
    currency: string;

    @Prop({ type: String })
    notes: string;

    @Prop({ type: String })
    uniqueUrl: string;

    @Prop({
        required: false,
        type: {
            payment_url: { type: String, required: true },
            orderId: { type: String, required: true },
            purchase_units: { amount: { currency_code: { type: String, required: true }, value: { type: String, required: true } } },
            create_time: { type: Date, required: true },
            links: [{ href: { type: String, required: true }, rel: { type: String, required: true }, method: { type: String, required: true } }],
        },
    })
    payment: {
        payment_url: string;
        orderId: string;
        purchase_units: { amount: { currency_code: string; value: string } };
        create_time: Date;
        links: { href: string; rel: string; method: string }[];
    };

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
