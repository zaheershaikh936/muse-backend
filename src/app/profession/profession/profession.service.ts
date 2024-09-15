import { Injectable } from '@nestjs/common';
import { CreateProfessionDto } from '../dto/profession.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profession } from 'src/schemas';
import { Model } from 'mongoose';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(Profession.name) private professionModel: Model<Profession>,
  ) {}
  async create(createProfessionDto: CreateProfessionDto) {
    try {
      const profession = new this.professionModel(createProfessionDto);
      return await profession.save();
    } catch (error) {
      return error;
    }
  }

  findAll() {
    return this.professionModel
      .find(
        { isActive: true, deleted: false },
        { isActive: 0, deleted: 0, updatedAt: 0 },
      )
      .sort({ sort: 1 })
      .lean();
  }

  getRoles() {
    return this.professionModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          let: { professionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$profession._id', '$$professionId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                slag: 1,
              },
            },
          ],
          as: 'roles',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          roles: 1,
          slag: 1,
        },
      },
    ]);
  }
}
