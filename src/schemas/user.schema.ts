import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, unique: true, searchIndex: true })
  email: string;

  @Prop({ required: true, select: false, hidden: true })
  password: string;

  @Prop({ required: true, default: 'user', enum: ['user', 'mentor', 'admin'] })
  role: string;

  @Prop({ required: true, searchIndex: true })
  name: string;

  @Prop({ default: false })
  isMentor: boolean;

  @Prop({ default: 'https://muse-upload-bucket.s3.eu-west-2.amazonaws.com/2024/12/17/image/default-avatar-icon-of-social-media-user-vector.jpg' })
  image: string;

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
