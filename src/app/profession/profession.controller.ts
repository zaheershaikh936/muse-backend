import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfessionService } from './profession/profession.service';
import { CreateProfessionDto } from './dto/profession.dto';
import { AuthGuard } from '@nestjs/passport';
@UseGuards(AuthGuard('jwt'))
@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) { }

  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionService.create(createProfessionDto);
  }

  @Get()
  findAll() {
    return this.professionService.findAll();
  }
}
