import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from '../dto/support.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Support, SupportDocument } from 'src/schemas';
import { Model } from 'mongoose';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name)
    private readonly supportModel: Model<SupportDocument>,
  ) {}
  create(createSupportDto: CreateSupportDto) {
    return this.supportModel.create(createSupportDto);
  }
}
