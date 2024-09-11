import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas';
import { Model } from 'mongoose';
import { hash } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }


  isExist(email: string) {
    return this.userModel.countDocuments({ email }).lean()
  }

  async create(createUserDto: CreateUserDto) {
    const password = await hash(createUserDto.password, 10)
    delete createUserDto.password
    createUserDto.password = password
    return this.userModel.create(createUserDto)
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }, { _id: 1, email: 1, password: 1 }).lean()
  }
}
function compareSync(password: string, password1: any) {
  throw new Error('Function not implemented.');
}

