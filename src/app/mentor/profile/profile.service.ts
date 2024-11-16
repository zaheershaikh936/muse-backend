import { Injectable } from '@nestjs/common';
import {
  CreateProfileDTO,
  UpdateAboutDTO,
  UpdateBannerDTO,
  UpdateSkillsDTO,
} from '../dto/profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mentor } from 'src/schemas';
import mongoose, { Model } from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Mentor.name) private mentorModel: Model<Mentor>) { }
  isExist(userId: string) {
    return this.mentorModel.countDocuments({ userId }).lean();
  }
  async create(createMentorDto: any) {
    const mentor = new this.mentorModel(createMentorDto);
    return await mentor.save();
  }

  async getProfile(userId: string) {
    const [data] = await this.mentorModel.aggregate([
      {
        $match: { userId: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'users',
          let: { id: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                image: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          location: 1,
          userId: 1,
          bgImage: 1,
          bio: 1,
          skills: 1,
          ratings: 1,
          verified: 1,
          experience: 1,
          name: '$user.name',
          image: '$user.image',
          about: 1,
          profession: 1,
        },
      },
    ]);
    return data;
  }

  updateBanner(createMentorDto: UpdateBannerDTO) {
    return this.mentorModel.findOneAndUpdate(
      { userId: createMentorDto.userId },
      createMentorDto,
      { new: true },
    );
  }

  update(createMentorDto: CreateProfileDTO) {
    return this.mentorModel.findOneAndUpdate(
      { userId: createMentorDto.userId },
      createMentorDto,
      { new: true },
    );
  }

  about(aboutMentorDto: UpdateAboutDTO) {
    return this.mentorModel.findOneAndUpdate(
      { userId: aboutMentorDto.userId },
      aboutMentorDto,
      { new: true },
    );
  }

  skills(skillsMentorDto: UpdateSkillsDTO) {
    return this.mentorModel.findOneAndUpdate(
      { userId: skillsMentorDto.userId },
      skillsMentorDto,
      { new: true },
    );
  }
}
