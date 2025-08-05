import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRegister, PreRegisterSchema, User, UserSchema } from 'src/schemas';
import { BookingsModule, MentorModule, RoleModule } from '../index';
import { PreRegisterService } from './pre-register/pre-register.service';
import { PreRegisterController } from './controller/pre-register.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: PreRegister.name, schema: PreRegisterSchema },
    ]),
    forwardRef(() => MentorModule),
    forwardRef(() => BookingsModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [UsersController, PreRegisterController],
  providers: [UsersService, PreRegisterService],
  exports: [UsersService],
})
export class UsersModule {}
