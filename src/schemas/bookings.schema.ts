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
            isUserJoin: { type: Boolean, required: false, default: false },
        },
    })
    user: {
        name: string;
        email: string;
        image: string;
            isUserJoin: boolean
    };

    @Prop({
        required: false,
        type: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, required: false },
            isUserJoin: { type: Boolean, required: false, default: false },
        },
    })
    mentor: {
        name: string;
        email: string;
        image: string;
            isUserJoin: boolean
    };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
    userId: string;

    @Prop({ type: String, required: false })
    roomId: string;

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
            id: { type: String, required: true },
            amount: { type: { currency_code: { type: String, required: true }, value: { type: String, required: true } }, required: true },
            seller_payable_breakdown: {
                gross_amount: { type: { currency_code: { type: String, required: true }, value: { type: String, required: true } }, required: true },
                paypal_fee: { type: { currency_code: { type: String, required: true }, value: { type: String, required: true } }, required: true },
                net_amount: { type: { currency_code: { type: String, required: true }, value: { type: String, required: true } }, required: true },
            },
            status: { type: String, required: true },
            create_time: { type: String, required: true },
            update_time: { type: String, required: true },
            links: [{ href: { type: String, required: true }, rel: { type: String, required: true }, method: { type: String, required: true } }],
        },
        required: false,
    })
    refundDetails: {
        id: string;
        amount: {
            currency_code: string;
            value: string;
        };
        seller_payable_breakdown: {
            gross_amount: {
                currency_code: string;
                value: string;
            };
            paypal_fee: {
                currency_code: string;
                value: string;
            };
            net_amount: {
                currency_code: string;
                value: string;
            };
        };
        status: string;
        create_time: string;
        update_time: string;
        links: [{ href: string; rel: string; method: string }];
    };


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
            refundId: { type: String, required: false },
            purchase_units: { amount: { currency_code: { type: String, required: true }, value: { type: String, required: true } } },
            create_time: { type: Date, required: true },
            links: [{ href: { type: String, required: true }, rel: { type: String, required: true }, method: { type: String, required: true } }],
        },
    })
    payment: {
        payment_url: string;
        orderId: string;
            refundId: string;
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
