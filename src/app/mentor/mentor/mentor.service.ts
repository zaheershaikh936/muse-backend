import { Injectable } from '@nestjs/common';
import { GetMentorDto } from '../dto/mentor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mentor } from 'src/schemas';
import { Model } from 'mongoose';
import { getMentorFilter } from 'src/utils/helper/get-mentor';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
@Injectable()
export class MentorService {
  constructor(@InjectModel(Mentor.name) private mentorModel: Model<Mentor>) { }

  async featuredMentors() {
    return await this.mentorModel.aggregate([
      {
        $limit: 20,
      },
      {
        $project: {
          image: '$user.image',
          tag: 'Top Mentor',
          name: '$user.name',
          country: '$location.country',
          city: '$location.city',
          flag: '$location.flag',
          ratings: 1,
          bio: 1,
          skills: 1,
          experience: 1,
        },
      },
    ]);
  }

  async getAll(body: GetMentorDto) {
    const filter = getMentorFilter(body.filter);
    const pipeline = [...filter];
    const [{ total = 0 }] = await this.mentorModel.aggregate([
      ...pipeline,
      {
        $count: 'total',
      },
    ]);
    const data = await this.mentorModel.aggregate([
      ...pipeline,
      {
        $project: {
          ...body.filed,
        },
      },
      {
        $skip: (body.page - 1) * (body.limit || 10),
      },
      {
        $limit: body.limit || 10,
      },
      {
        $sort: body.sort,
      },
    ]);
    return { total, data };
  }

  async getMentorById(id: string) {
    const [data = {}] = await this.mentorModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
    ]);
    return data;
  }

  getMentorId(userId: string) {
    return this.mentorModel.findOne({ userId: new ObjectId(userId) }, { _id: 1, user: 1 }).lean().exec();
  }

  findOneForBooking(id: string) {
    return this.mentorModel.findById(id, { _id: 1, user: 1 }).lean().exec();
  }
}
