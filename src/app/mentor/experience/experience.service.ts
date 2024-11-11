import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Experience } from 'src/schemas';
import { Model } from 'mongoose';
import { ExperienceMentorDto } from '../dto/experience.dto';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name) private experienceModel: Model<Experience>,
  ) {}

  create(experienceMentorDto: ExperienceMentorDto) {
    try {
      return this.experienceModel.create(experienceMentorDto);
    } catch (error) {
      console.log(error);
      return error;
    }
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

  async getExperienceById(id: string) {
    return await this.experienceModel.aggregate([
      {
        $match: {
          userId: new ObjectId(id),
        },
      },
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
                      endDate: {
                        $cond: {
                          if: {
                            $or: [
                              '$$position.currentlyEmployed',
                              { $eq: ['$$position.endDate', null] },
                            ],
                          },
                          then: new Date(),
                          else: '$$position.endDate',
                        },
                      },
                      totalMonths: {
                        $dateDiff: {
                          startDate: '$$position.startDate',
                          endDate: {
                            $cond: {
                              if: {
                                $or: [
                                  '$$position.currentlyEmployed',
                                  { $eq: ['$$position.endDate', null] },
                                ],
                              },
                              then: new Date(),
                              else: '$$position.endDate',
                            },
                          },
                          unit: 'month',
                        },
                      },
                    },
                    in: {
                      $let: {
                        vars: {
                          years: { $floor: { $divide: ['$$totalMonths', 12] } },
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
    ]);
  }
}
