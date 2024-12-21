import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfessionDocument = HydratedDocument<Profession>;
@Schema({ versionKey: false })
export class Profession {
  @Prop({ required: true, unique: true, searchIndex: true })
  name: string;

  @Prop({ required: true, default: '' })
  image: string;

  @Prop({ required: false })
  slag: string;

  @Prop({ required: true, default: '' })
  sort: number;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: true, default: false })
  deleted: boolean;
}

export const ProfessionSchema = SchemaFactory.createForClass(Profession);

ProfessionSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    try {
      const name: any = this.name;
      this.slag = name.trim().replace(/\s+/g, '-').toLowerCase();
    } catch (error) {
      return error;
    }
  }
  next();
});
