import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './review/reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from 'src/schemas';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';

@Controller('/mentor/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('/:id')
  findAllByMentorId(@Param('id') id: string, @Query('limit') limit: string, @Query('page') page: string) {
    const options = { limit: parseInt(limit) || 4, page: parseInt(page) || 1 }
    return this.reviewsService.getAllByMentorId(id, options)
  }
}
