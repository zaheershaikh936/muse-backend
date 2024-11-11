import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { CountryService } from './country/country.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    private readonly countryService: CountryService,
  ) {}

  @Get('country')
  async findAll() {
    return await this.countryService.getAll();
  }

  @Get('city/:country')
  @UseGuards(AuthGuard('jwt'))
  async getCity(@Param('country') country: string) {
    return await this.countryService.getCity(country);
  }
}
