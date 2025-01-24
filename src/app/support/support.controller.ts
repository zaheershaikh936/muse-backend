import { Controller, Post, Body } from '@nestjs/common';
import { SupportService } from './customer-support/support.service';
import { CreateSupportDto } from './dto/support.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }
}
