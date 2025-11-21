import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Experience } from 'src/schemas';
import { Model } from 'mongoose';
import {
  ExperienceMentorDto,
  UpdateExperienceMentorDto,
} from '../dto/experience.dto';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name) private experienceModel: Model<Experience>,
  ) {}

  create(experienceMentorDto: ExperienceMentorDto) {
    return this.experienceModel.create(experienceMentorDto);
  }

  async getById(id: string) {
    return await this.experienceModel.aggregate([
      {
        $match: {
          userId: new ObjectId(id),
        },
      },
      {
        $unwind: '$positions',
      },
      {
        $addFields: {
          startDate: '$positions.startDate',
          endDate: {
            $cond: {
              if: { $eq: ['$positions.currentlyEmployed', true] },
              then: new Date(),
              else: '$positions.endDate',
            },
          },
        },
      },
      {
        $addFields: {
          diffInYears: {
            $subtract: [{ $year: '$endDate' }, { $year: '$startDate' }],
          },
          diffInMonths: {
            $subtract: [{ $month: '$endDate' }, { $month: '$startDate' }],
          },
        },
      },
      {
        $addFields: {
          diffInYears: {
            $cond: {
              if: { $lt: ['$diffInMonths', 0] },
              then: { $subtract: ['$diffInYears', 1] },
              else: '$diffInYears',
            },
          },
          diffInMonths: {
            $cond: {
              if: { $lt: ['$diffInMonths', 0] },
              then: { $add: ['$diffInMonths', 12] },
              else: '$diffInMonths',
            },
          },
        },
      },
      {
        $addFields: {
          duration: {
            $cond: [
              { $gt: ['$diffInYears', 0] },
              {
                $concat: [
                  { $toString: '$diffInYears' },
                  ' yr',
                  {
                    $cond: [
                      { $gt: ['$diffInMonths', 0] },
                      { $concat: [' ', { $toString: '$diffInMonths' }, 'mos'] },
                      '',
                    ],
                  },
                ],
              },
              {
                $cond: [
                  { $gt: ['$diffInMonths', 0] },
                  {
                    $concat: [{ $toString: '$diffInMonths' }, ' mos'],
                  },
                  '',
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          company: { $first: '$company' },
          image: { $first: '$image' },
          skills: { $first: '$skills' },
          positions: {
            $push: {
              title: '$positions.title',
              duration: '$duration',
            },
          },
          totalYears: { $sum: '$diffInYears' },
          totalMonths: {
            $sum: {
              $cond: [{ $gt: ['$diffInMonths', 0] }, '$diffInMonths', 0],
            },
          },
        },
      },
      {
        $addFields: {
          totalDuration: {
            $cond: {
              if: { $gt: ['$totalYears', 0] },
              then: {
                $concat: [
                  { $toString: '$totalYears' },
                  ' yr',
                  {
                    $cond: [
                      { $gt: ['$totalMonths', 0] },
                      { $concat: [' ', { $toString: '$totalMonths' }, ' mos'] },
                      '',
                    ],
                  },
                ],
              },
              else: {
                $cond: [
                  { $gt: ['$totalMonths', 0] },
                  {
                    $concat: [{ $toString: '$totalMonths' }, ' mos'],
                  },
                  '',
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          company: 1,
          image: 1,
          positions: 1,
          skills: 1,
          totalDuration: 1,
        },
      },
    ]);
  }

  async getExperienceByMentorId(id: string): Promise<unknown> {
    const [data] = await this.experienceModel.aggregate([
      // Stage 1: Find all experience documents for the given user
      {
        $match: {
          userId: new ObjectId(id),
        },
      },

      // Stage 2: Use $facet to run two parallel pipelines
      {
        $facet: {
          // Pipeline 1: Get the detailed list of experiences (your original query)
          experiences: [
            {
              $project: {
                company: 1,
                country: 1,
                city: 1,
                image: 1,
                positions: {
                  $map: {
                    input: '$positions',
                    as: 'position',
                    in: {
                      title: '$$position.title',
                      duration: {
                        $let: {
                          vars: {
                            totalMonths: {
                              $dateDiff: {
                                startDate: '$$position.startDate',
                                endDate: {
                                  $ifNull: ['$$position.endDate', new Date()],
                                }, // Simplified logic for end date
                                unit: 'month',
                              },
                            },
                          },
                          in: {
                            $let: {
                              vars: {
                                years: {
                                  $floor: { $divide: ['$$totalMonths', 12] },
                                },
                                months: { $mod: ['$$totalMonths', 12] },
                              },
                              in: {
                                $trim: {
                                  input: {
                                    $concat: [
                                      {
                                        $cond: {
                                          if: { $gt: ['$$years', 0] },
                                          then: {
                                            $concat: [
                                              { $toString: '$$years' },
                                              ' yr ',
                                            ],
                                          },
                                          else: '',
                                        },
                                      },
                                      {
                                        $cond: {
                                          if: { $gt: ['$$months', 0] },
                                          then: {
                                            $concat: [
                                              { $toString: '$$months' },
                                              ' mon',
                                            ],
                                          },
                                          else: '',
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                employmentType: 1,
                skills: 1,
              },
            },
            {
              $sort: {
                _id: -1,
              },
            },
          ],

          // Pipeline 2: Calculate the total experience
          totalExperience: [
            // Deconstruct the positions array to process each position individually
            {
              $unwind: '$positions',
            },
            // Calculate the duration of each position in months
            {
              $addFields: {
                durationInMonths: {
                  $dateDiff: {
                    startDate: '$positions.startDate',
                    endDate: {
                      $ifNull: ['$positions.endDate', new Date()], // If endDate is null (current job), use today's date
                    },
                    unit: 'month',
                  },
                },
              },
            },
            // Group all positions together and sum their durations
            {
              $group: {
                _id: null, // Group all documents into a single one
                totalMonths: { $sum: '$durationInMonths' },
              },
            },
            // Format the final total duration into "years" and "months"
            {
              $project: {
                _id: 0,
                totalMonths: 1, // Keep the numeric total for easy parsing
                formatted: {
                  $let: {
                    vars: {
                      totalYears: { $floor: { $divide: ['$totalMonths', 12] } },
                      remainingMonths: { $mod: ['$totalMonths', 12] },
                    },
                    in: {
                      $trim: {
                        input: {
                          $concat: [
                            {
                              $cond: {
                                if: { $gt: ['$$totalYears', 0] },
                                then: {
                                  $concat: [
                                    { $toString: '$$totalYears' },
                                    ' yr ',
                                  ],
                                },
                                else: '',
                              },
                            },
                            {
                              $cond: {
                                if: { $gt: ['$$remainingMonths', 0] },
                                then: {
                                  $concat: [
                                    { $toString: '$$remainingMonths' },
                                    ' mon',
                                  ],
                                },
                                else: '',
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
      // Stage 3: Reshape the output to be more convenient
      {
        $project: {
          experiences: '$experiences',
          // Use $arrayElemAt to get the single object from the totalExperience array
          totalExperience: { $arrayElemAt: ['$totalExperience', 0] },
        },
      },
    ]);
    return data;
  }

  async getExperienceById(id: string): Promise<any> {
    return this.experienceModel.findById(id).lean().exec();
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceMentorDto,
  ): Promise<any> {
    return this.experienceModel
      .findByIdAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateExperienceDto },
        { new: true },
      )
      .lean()
      .exec();
  }
}
