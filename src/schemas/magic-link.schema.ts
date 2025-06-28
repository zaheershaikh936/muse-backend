import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MagicLinkDocument = HydratedDocument<MagicLink>;

@Schema({ versionKey: false })
export class MagicLink {
  @Prop({ type: String, required: true })
  uniqueId: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Date, required: true })
  expiration: Date;

  @Prop({ type: Boolean, required: true, default: false })
  isOpen: boolean;
}

export const MagicLinkSchema = SchemaFactory.createForClass(MagicLink);
