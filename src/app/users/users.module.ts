import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas';
import { BookingsModule, MentorModule, RoleModule } from '../index';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => MentorModule),
    forwardRef(() => BookingsModule),
    forwardRef(() => RoleModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
