import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

const Status = ['pending', 'resolved', 'closed', 'deleted'] as const;

export type SupportDocument = HydratedDocument<Support>;
@Schema({ versionKey: false })
export class Support {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    type: {
      booking: Boolean,
      mentor: Boolean,
      account: Boolean,
      other: Boolean,
    },
  })
  enquiryType: {
    booking: boolean;
    mentor: boolean;
    account: boolean;
    other: boolean;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ required: true, default: 'pending', enum: Status, type: String })
  status: typeof Status;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
