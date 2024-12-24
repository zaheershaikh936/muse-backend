import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/role.dto';
import { Role } from 'src/schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  create(createRoleDto: CreateRoleDto) {
    const newRole = new this.roleModel({
      name: createRoleDto.name,
      profession: { _id: createRoleDto.professionId },
      sort: createRoleDto.sort,
    });
    return newRole.save();
  }

  findOne(id: string) {
    return this.roleModel.findById({ _id: id }).lean();
  }
  getSuggestions(search: string) {
    return this.roleModel.aggregate([
      {
        $match: {
          name: { $regex: search, $options: 'i' }
        },
      },
      {
        $project: {
          professionSlug: '$profession.slug', 
          name: 1,
          slag: 1,
          category: 'role'
        }
      }
    ]);
  }
}
