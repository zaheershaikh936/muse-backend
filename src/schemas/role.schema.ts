import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose'
import { Logger } from '@nestjs/common';

export type RoleDocument = HydratedDocument<Role>;
@Schema({ versionKey: false })
export class Role {

    @Prop({
        type: {
            _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: false }
        },
        required: true
    })
    profession: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop({ required: true, unique: true, searchIndex: true })
    name: string;

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

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', async function (next) {
    if (this.isModified('profession._id')) {
        try {
            const _id: any = this.profession._id;
            const profession: any = await this.model('Profession').findById(_id, { _id: 1, name: 1 }).lean();
            if (!profession) throw new Error('Profession not found');
            this.profession.name = profession.name;
        } catch (error) {
            Logger.error('Error fetching profession', error.message);
            return next(error);
        }
    }
    next();
});