import { Injectable } from '@nestjs/common';
import { CreateProfessionDto } from '../dto/profession.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profession } from 'src/schemas';
import mongoose, { Model } from 'mongoose';
const { ObjectId } = mongoose.Types;

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
          let: {
            professionId: '$_id',
          },
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
        $lookup: {
          from: 'mentors',
          let: {
            professionId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$profession._id', '$$professionId'],
                },
              },
            },
            {
              $facet: {
                mentorsList: [
                  {
                    $project: {
                      image: '$user.image',
                      name: '$user.name',
                    },
                  },
                  {
                    $limit: 4,
                  },
                ],
                totalMentorCount: [
                  {
                    $count: 'totalMentors',
                  },
                ],
              },
            },
          ],
          as: 'mentorsData',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          roles: 1,
          slag: 1,
          mentors: {
            $arrayElemAt: ['$mentorsData.mentorsList', 0],
          },
          totalMentorCount: {
            $first: '$mentorsData.totalMentorCount.totalMentors',
          },
        },
      },
    ]);
  }

  async getRolesByProfession(id: string) {
    const [{ roles }] = await this.professionModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
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
                value: '$_id',
                label: '$name',
              },
            },
          ],
          as: 'roles',
        },
      },
      {
        $project: {
          roles: 1,
        },
      },
    ]);
    return roles;
  }
}
