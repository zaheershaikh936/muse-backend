import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { CountryService } from './country/country.service';
import { SkillsService } from './skills/skills.service';
import { ConfigController } from './config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Config,
  ConfigSchema,
  Experience,
  ExperienceSchema,
} from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Config.name, schema: ConfigSchema },
      { name: Experience.name, schema: ExperienceSchema },
    ]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService, CountryService, SkillsService],
})
export class AppConfigModule {}
