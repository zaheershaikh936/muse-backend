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
import { ExperienceMentorDto } from '../dto/experience.dto';
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
        $addFields: {
          profileCompletion: {
            $multiply: [
              {
                $divide: [
                  {
                    $sum: [
                      { $cond: [{ $ifNull: ['$user.image', false] }, 10, 0] },
                      { $cond: [{ $ifNull: ['$bgImage', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$user.name', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$user.email', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$bio', false] }, 10, 0] },
                      { $cond: [{ $ifNull: ['$about', false] }, 10, 0] },
                      { $cond: [{ $gt: [{ $size: '$skills' }, 0] }, 10, 0] },
                      { $cond: [{ $gt: [{ $size: '$experience' }, 0] }, 15, 0] },
                      { $cond: [{ $ifNull: ['$location', false] }, 10, 0] },
                      { $cond: [{ $ifNull: ['$profession.name', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$role.name', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$tag', false] }, 5, 0] },
                      { $cond: [{ $ifNull: ['$totalExperience', false] }, 5, 0] },
                    ],
                  },
                  100,
                ],
              },
              100,
            ],
          },
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
          role: 1,
          profession: 1,
          profileCompletion: 1
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


  findMentorExperience(userId: string) {
    return this.mentorModel.findOne({ userId: new ObjectId(userId) }, { experience: 1 }).lean().exec();
  }

  async updateExperience(experienceMentorDto: ExperienceMentorDto, id: string) {
    const mentor = await this.findMentorExperience(experienceMentorDto.userId);
    const title = experienceMentorDto.positions[experienceMentorDto.positions.length - 1].title;
    const newExperienceEntry = {
      image: experienceMentorDto.image,
      company: experienceMentorDto.company,
      role: title,
      experienceId: id
    };
    const updatedExperience = [
      ...mentor.experience,
      newExperienceEntry
    ];

    await this.mentorModel.updateOne(
      { userId: new ObjectId(experienceMentorDto.userId) },
      { $set: { experience: updatedExperience } }
    );
    return
  }

  async findAndUpdateExperienceById(experienceMentorDto: ExperienceMentorDto, experienceId: string) {
    const mentor = await this.findMentorExperience(experienceMentorDto.userId);
    if (!mentor) {
      throw new Error('Mentor not found');
    }
    const title = experienceMentorDto.positions[experienceMentorDto.positions.length - 1].title;
    const experienceIndex = mentor.experience.findIndex(
      (item: { experienceId: string }) => item.experienceId.toString() === experienceId
    );
    console.log('Experience index found:', experienceIndex);

    if (experienceIndex !== -1) {
      mentor.experience[experienceIndex] = {
        ...mentor.experience[experienceIndex],
        image: experienceMentorDto.image,
        company: experienceMentorDto.company,
        role: title
      };
    }
    await this.mentorModel.updateOne(
      { userId: new ObjectId(experienceMentorDto.userId) },
      { $set: { experience: mentor.experience } }
    );
    return;
  }
}
