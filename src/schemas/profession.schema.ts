import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'

export type ProfessionDocument = HydratedDocument<Profession>;
@Schema({ versionKey: false })
export class Profession {
    @Prop({ required: true, unique: true, searchIndex: true })
    name: string;

    @Prop({ required: true, default: "" })
    image: string;

    @Prop({ required: true, default: "" })
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