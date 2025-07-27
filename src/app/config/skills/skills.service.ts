import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Experience } from 'src/schemas';
import { Model } from 'mongoose';
@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Experience.name) private skillsModel: Model<Experience>,
  ) {}

  async getAllSkills() {
    const [{ uniqueSkills }] = await this.skillsModel.aggregate([
      {
        $unwind: '$skills',
      },
      {
        $group: {
          _id: null,
          uniqueSkills: {
            $addToSet: '$skills',
          },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueSkills: 1,
        },
      },
    ]);
    return uniqueSkills;
  }
}
