import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { MentorService } from './mentor/mentor.service';
import { ProfileService } from './profile/profile.service';
import { ExperienceService } from './experience/experience.service';

import {
  CreateProfileDTO,
  UpdateAboutDTO,
  UpdateBannerDTO,
  UpdateSkillsDTO,
} from './dto/profile.dto';
import { JwtAuthGuard } from 'src/utils/guard/jwt-user.guards';
import { Request } from 'src/utils/types/index';
import { ExperienceMentorDto } from './dto/experience.dto';
import { RoleService } from '../role/role/role.service';
import { User } from 'src/utils/decorator/user.decorator';
import { GetMentorDto } from './dto/mentor.dto';
import { MentorBookingService } from '../bookings/mentor-booking/bookingsMentor.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('mentor')
export class MentorController {
  constructor(
    private readonly mentorService: MentorService,
    private readonly experienceService: ExperienceService,
    private readonly profileService: ProfileService,
    private readonly roleService: RoleService,
    private readonly bookingService: MentorBookingService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/bookings')
  async mentorBooking(@User('_id') id: string, @Query('status') status: string, @Query('limit') limit: number, @Query('page') page: number) {
    const filter = {
      status: status?.length ? status.split(',') : [],
      limit: limit || 10,
      page: page || 1,
    }
    const mentor = await this.mentorService.getMentorIdByUserId(id);
    return this.bookingService.mentorBookings(mentor._id.toString(), filter)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  async create(
    @Body() createMentorDto: CreateProfileDTO,
    @Req() request: Request,
  ) {
    createMentorDto.userId = request.user._id;
    const isExist = await this.profileService.isExist(createMentorDto.userId);
    const iso2: { iso2: string; flag: string } = await this.getIso2Code(
      createMentorDto.location.country,
    );
    createMentorDto.location.flag = iso2.flag;
    createMentorDto.location.iso2 = iso2.iso2;
    const professionRole = await this.roleService.findOne(
      createMentorDto.role._id,
    );
    createMentorDto.role.name = professionRole.name;
    createMentorDto.profession.name = professionRole.profession.name;
    if (!isExist) {
      return this.profileService.create(createMentorDto);
    } else {
      return this.profileService.update(createMentorDto);
    }
  }

  async getIso2Code(country: string) {
    const response = await fetch(
      'https://countriesnow.space/api/v0.1/countries/states',
      {
        method: 'POST',
        body: JSON.stringify({
          country: country,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow' as RequestRedirect,
      },
    );
    const data = await response.json();
    const iso2: string = data?.data?.iso2;
    const raw = JSON.stringify({
      iso2: iso2,
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: raw,
      redirect: 'follow' as RequestRedirect,
    };

    const flagResponse = await fetch(
      'https://countriesnow.space/api/v0.1/countries/flag/images',
      requestOptions,
    );
    const flagData = await flagResponse.json();
    return { iso2, flag: flagData?.data?.flag };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Req() request: Request) {
    const id = request.user._id;
    return this.profileService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/about')
  async updateAbout(
    @Req() request: Request,
    @Body() aboutMentorDto: UpdateAboutDTO,
  ) {
    aboutMentorDto.userId = request.user._id;
    return this.profileService.about(aboutMentorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/skills')
  async updateSkills(
    @Req() request: Request,
    @Body() skillsMentorDto: UpdateSkillsDTO,
  ) {
    skillsMentorDto.userId = request.user._id;
    return this.profileService.skills(skillsMentorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/experience')
  async createExperience(
    @User('_id') id: string,
    @Body() experienceMentorDto: ExperienceMentorDto,
  ) {
    experienceMentorDto.userId = id;
    return this.experienceService.create(experienceMentorDto);
  }

  @Get('/experience/:id')
  async getExperienceById(@Param('id') id: string) {
    return this.experienceService.getExperienceById(id);
  }

  @Get('featured/mentors')
  featuredMentors() {
    return this.mentorService.featuredMentors();
  }

  @Post('/mentor/get-all')
  async getAllMentor(@Body() body: GetMentorDto) {
    return this.mentorService.getAll(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/experience')
  async getExperience(@User('_id') id: string) {
    return this.experienceService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/banner')
  async updateBannerImg(
    @Req() request: Request,
    @Body() updateBannerDTO: UpdateBannerDTO,
  ) {
    updateBannerDTO.userId = request.user._id;
    const isExist = await this.profileService.isExist(updateBannerDTO.userId);
    if (!isExist) {
      return this.profileService.create(updateBannerDTO);
    } else {
      return this.profileService.updateBanner(updateBannerDTO);
    }
  }

  @Get('/:id')
  async getMentorById(@Param('id') id: string) {
    return this.mentorService.getMentorById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/bookings/kpi')
  async bookingMentorKpi(@User('_id') id: any) {
    const mentor = await this.mentorService.getMentorIdByUserId(id)
    return this.bookingService.bookingKpi(mentor._id.toString())
  }
}
