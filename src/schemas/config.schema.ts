import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;
@Schema({ versionKey: false })
export class Config {}

export const ConfigSchema = SchemaFactory.createForClass(Config);
