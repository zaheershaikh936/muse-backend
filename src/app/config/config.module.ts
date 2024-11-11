import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { CountryService } from './country/country.service';
import { ConfigController } from './config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [ConfigController],
  providers: [ConfigService, CountryService],
})
export class AppConfigModule {}
