import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MentorDocument = HydratedDocument<Mentor>;
@Schema({ versionKey: false, timestamps: true })
export class Mentor {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String })
  bgImage: string;


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
    searchIndex: true,
    type: { city: String, country: String, flag: String, iso2: String },
  })
  location: {
    city: string;
    country: string;
    flag: string;
    iso2: string;
  };

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

  @Prop({ type: String })
  about: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({
    required: false,
    type: [
      {
        image: { type: String, default: '', required: true },
        company: { type: String, required: true },
        role: { type: String, required: true },
        experienceId: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],
  })
  experience: {
      image: string;
      company: string;
      role: string;
      experienceId: string;
  }[];

  @Prop({ type: String })
  bio: string;

  @Prop({ type: String })
  profile: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: 0, required: true })
  ratings: number;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  banned: boolean;
}



export const MentorSchema = SchemaFactory.createForClass(Mentor);

MentorSchema.index({ 'user.name': 1, 'profession.name': 1, 'location.country': 1, 'skills': 1 });

