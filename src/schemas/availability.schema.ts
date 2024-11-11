import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AvailabilityDocument = HydratedDocument<Availability>;

@Schema()
class DayAvailability {
  @Prop({ type: Number, required: true })
  day: number;

  @Prop({ type: String, required: true })
  dayString: string;

  @Prop({ type: String, required: true })
  startTime: string;

  @Prop({ type: String, required: true })
  endTime: string;

  @Prop({ type: Boolean, required: true })
  status: boolean;
}

const DayAvailabilitySchema = SchemaFactory.createForClass(DayAvailability);

@Schema({ versionKey: false })
export class Availability {
  @Prop({
    type: {
      name: { type: String, required: true },
      image: { type: String, required: false },
      email: { type: String, required: true },
    },
    required: true,
  })
  mentor: {
    name: string;
    image: string;
    email: string;
  };

  @Prop({
    type: Map,
    of: [DayAvailabilitySchema],
    required: true,
  })
  availability: Map<string, DayAvailability[]>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'mentor', required: true })
  mentorId: string;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
