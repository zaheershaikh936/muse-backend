import { Inject, Injectable } from '@nestjs/common';
import { CreateProfessionDto } from '../dto/profession.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profession } from 'src/schemas';
import { Model } from 'mongoose';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(Profession.name) private professionModel: Model<Profession>,
  ) { }
  create(createProfessionDto: CreateProfessionDto) {
    return this.professionModel.create(createProfessionDto)
  }

  findAll() {
    return this.professionModel.find({ isActive: true, deleted: false }, { isActive: 0, deleted: 0, updatedAt: 0 }).sort({ sort: 1 }).lean()
  }
}
