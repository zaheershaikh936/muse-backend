import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export enum employmentType {
  full_time = 'Full Time',
  part_time = 'Part Time',
}

@Schema()
class Position {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Boolean, required: true, default: false })
  currentlyEmployed: boolean;
}
export const PositionSchema = SchemaFactory.createForClass(Position);

export type ExperienceDocument = HydratedDocument<Experience>;
@Schema({ versionKey: false, timestamps: true })
export class Experience {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    default:
      'https://utfs.io/f/cR9cRSofyZ3W9VbrfwOVfEQWAGx2Jgm5zuHynZ4bB8vU0oDX',
  })
  image: string;

  @Prop({ type: String, required: true })
  company: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: [PositionSchema], required: true })
  positions: Position[];

  @Prop({
    type: String,
    enum: employmentType,
    required: true,
    default: 'Full time',
  })
  employmentType: 'Full Time' | 'Part Time';

  @Prop({ type: [String], default: [] })
  skills: string[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
