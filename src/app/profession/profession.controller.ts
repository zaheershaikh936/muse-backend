import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProfessionService } from './profession/profession.service';
import { CreateProfessionDto } from './dto/profession.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionService.create(createProfessionDto);
  }

  @Get()
  findAll() {
    return this.professionService.findAll();
  }

  @Get('/roles')
  getRoles() {
    return this.professionService.getRoles();
  }
}
