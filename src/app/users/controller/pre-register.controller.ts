import {
  Controller,
  Body,
  UseGuards,
  Param,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserPreRegister } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { slugHelper } from 'src/utils/helper/slug-helper';
import { getIso2Code } from 'src/utils/api/getLocation';
import { PreRegisterService } from '../pre-register/pre-register.service';
import { RoleService } from 'src/app/role/role/role.service';
import { UsersService } from '../user/users.service';

@Controller('users')
export class PreRegisterController {
  constructor(
    private readonly usersService: UsersService,
    private readonly roleService: RoleService,
    private readonly preRegisterService: PreRegisterService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/approve-mentor/:id')
  async approveMentorById(@Param('id') id: string): Promise<any> {
    return this.usersService.update(id, {
      isMentor: true,
      verified: true,
      updatedAt: new Date(),
    });
  }

  @Post('pre-register')
  async preRegister(@Body() becomeMentor: UserPreRegister) {
    const isExist = await this.preRegisterService.isExist(becomeMentor.email);
    if (isExist)
      throw new HttpException(
        'You already register. Will Update you soon.',
        HttpStatus.BAD_REQUEST,
      );

    const role = await this.roleService.findOne(becomeMentor.role);
    becomeMentor.profession = {
      _id: role.profession._id,
      name: role.profession.name,
      slag: role.profession.slag,
    } as any;
    becomeMentor.role = {
      _id: role._id,
      name: role.name,
      slag: role.slag,
    } as any;
    const { flag, iso2 } = await getIso2Code(becomeMentor.country);
    becomeMentor.location = {} as {
      country: string;
      city: string;
      flag?: string;
      iso2?: string;
    };
    becomeMentor.userId = slugHelper(becomeMentor.name);
    becomeMentor.location = {
      country: becomeMentor.country,
      city: becomeMentor.city,
      flag: flag,
      iso2: iso2,
    };
    return this.preRegisterService.preRegister(becomeMentor);
  }
}
