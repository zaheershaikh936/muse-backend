import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AvailabilityService } from './availability/availability.service';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/create-availability.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorator/user.decorator';
import { MentorService } from '../mentor/mentor/mentor.service';
import { BookingsService } from '../bookings/booking/bookings.service';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly bookingService: BookingsService,
    private readonly mentorService: MentorService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createAvailabilityDto: CreateAvailabilityDto, @User("_id") _id: string) {
    const mentor = await this.mentorService.getMentorId(_id)
    const mentorId: string = mentor._id.toString();
    // check if the user has availability then update 
    const availability = await this.availabilityService.findAvailability(mentorId)
    if (!availability) {
      createAvailabilityDto.userId = _id;
      createAvailabilityDto.mentorId = mentorId
      createAvailabilityDto.mentor = mentor.user;
      return this.availabilityService.create(createAvailabilityDto);
    } else {
      return this.availabilityService.updateOne(availability.userId, createAvailabilityDto);
    }
  }


  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAvailability(@User("_id") id: string) {
    return this.availabilityService.findMentorAvailability(id);
  }

  @Get("/:id/:day")
  async getAvailabilityTimeSlot(@Param("id") id: string, @Param('day') day: string) {
    const data = await this.availabilityService.findOne(id, day);
    const availability = [];
    for (const item of data.availability[day]) if (item.status) availability.push(item);
    const bookings = await this.bookingService.findAllByMentorId(id, day)
    const availableSlots = this.availabilityService.getAvailableSlots(availability, bookings);
    return availableSlots;
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch()
  updateOne(@User("_id") id: string, @Body() body: UpdateAvailabilityDto) {
    return this.availabilityService.updateOne(id, body);
  }
}
