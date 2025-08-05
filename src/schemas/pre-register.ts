import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PreRegisterDocument = HydratedDocument<PreRegister>;
@Schema({ versionKey: false })
export class PreRegister {
  @Prop({ required: true, unique: true, searchIndex: true })
  email: string;

  @Prop({ required: false, select: false, hidden: true })
  password: string;

  @Prop({
    required: false,
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: false },
      slag: { type: String, required: false },
    },
  })
  role: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    slag: string;
  };

  @Prop({
    required: false,
    type: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: false },
      slag: { type: String, required: false },
    },
  })
  profession: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    slag: string;
  };

  @Prop({
    required: true,
    default: 'email',
    enum: ['github', 'google', 'email'],
  })
  provider: string;

  @Prop({
    searchIndex: true,
    type: { city: String, country: String, flag: String, iso2: String },
  })
  location: {
    city: string;
    country: string;
    flag: string;
    iso2: string;
  };

  @Prop({ required: true, searchIndex: true })
  name: string;

  @Prop({ default: true })
  isMentor: boolean;

  @Prop({
    default:
      'https://muse-upload-bucket.s3.eu-west-2.amazonaws.com/2024/12/17/image/default-avatar-icon-of-social-media-user-vector.jpg',
  })
  image: string;

  @Prop({ required: true, default: '', type: String })
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: String, required: true })
  bio: string;
}

export const PreRegisterSchema = SchemaFactory.createForClass(PreRegister);
