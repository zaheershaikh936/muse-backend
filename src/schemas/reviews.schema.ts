import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: { createdAt: 'createdDate' }, versionKey: false })
export class Review {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        type: {
            image: String,
            name: String,
        },
    })
    user: {
        image: string;
        name: string;
    };

    @Prop({
        required: true,
        type: {
            image: String,
            name: String,
        },
    })
    mentor: {
        image: string;
        name: string;
    };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "mentor", required: true })
    mentorId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, min: 1, max: 5 })
    sessionRating: number;

    @Prop({ required: true, type: String })
    comment: string;

    @Prop({ enum: ['pending', 'post', 'on-review'], default: 'post' })
    status: string;

    @Prop({ default: Date.now })
    createdDate: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
