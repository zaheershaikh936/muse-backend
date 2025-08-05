import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreRegister } from 'src/schemas';
import { UserPreRegister } from '../dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class PreRegisterService {
  constructor(
    @InjectModel(PreRegister.name) private preRegisterModel: Model<PreRegister>,
  ) {}

  isExist(email: string) {
    return this.preRegisterModel.countDocuments({ email: email }).lean();
  }
  async preRegister(body: UserPreRegister) {
    const password = await hash('123456789', 10);
    body.password = password;
    return this.preRegisterModel.create(body);
  }
}
