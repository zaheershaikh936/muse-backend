import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>;
@Schema({ versionKey: false })
export class User {
    @Prop({ required: true, unique: true, searchIndex: true })
    email: string;

    //don pass pass this field
    @Prop({ required: true, select: false, hidden: true })
    password: string;

    @Prop({ required: true, default: 'user', enum: ['user', 'mentor', 'admin'] })
    role: string;

    @Prop({ required: true, searchIndex: true })
    name: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: false })
    deleted: boolean;

    @Prop({ default: false })
    verified: boolean;

    @Prop({ default: false })
    banned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);