import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { RoleService } from './role/role.service';
import { CreateRoleDto } from './dto/role.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id)
  }

}
