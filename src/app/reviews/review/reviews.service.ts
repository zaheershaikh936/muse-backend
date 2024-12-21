import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas';
import { CreateReviewDto } from '../dto/review.dto';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) { }

  create(createReviewBody: CreateReviewDto): Promise<Review> {
    return this.reviewModel.create(createReviewBody)
  }

  async getAllByMentorId(id: string, option: { limit: number, page: number }) {
    const total = await this.reviewModel.countDocuments({ mentorId: new ObjectId(id) }).lean().exec();
    const data = await this.reviewModel.aggregate([
      {
        $match: {
          mentorId: new ObjectId(id),
          status: 'post'
        }
      },
      {
        $project: {
          user: 1,
          createdDate: 1,
          comment: 1,
          sessionRating: 1
        }
      },
      {
        $skip: (option.page - 1) * option.limit
      }
    ])
    return { total, data }
  }
}
