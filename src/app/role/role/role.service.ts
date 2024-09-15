import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from '../dto/role.dto';
import { Role } from 'src/schemas';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class RoleService {

    constructor(
        @InjectModel(Role.name) private roleModel: Model<Role>,
    ) { }

    create(createRoleDto: CreateRoleDto) {
        const newRole = new this.roleModel({ name: createRoleDto.name, profession: { _id: createRoleDto.professionId }, sort: createRoleDto.sort });
        return newRole.save();
    }

    findOne(id: string) {
        return this.roleModel.findById({ _id: id }).lean();
    }
}
