import { Module, forwardRef } from '@nestjs/common';
import { MentorService } from './mentor/mentor.service';
import { ProfileService } from './profile/profile.service';
import { ExperienceService } from './experience/experience.service';
import { MentorController } from './mentor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Experience,
  ExperienceSchema,
  Mentor,
  MentorSchema,
} from 'src/schemas';
import { RoleModule } from '../role/role.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mentor.name, schema: MentorSchema },
      { name: Experience.name, schema: ExperienceSchema },
    ]),
    forwardRef(() => RoleModule),
    forwardRef(() => BookingsModule),
  ],
  controllers: [MentorController],
  providers: [MentorService, ProfileService, ExperienceService],
  exports: [ProfileService, MentorService],
})
export class MentorModule { }
