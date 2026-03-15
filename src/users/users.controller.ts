import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('public')
  getPublicData() {
    return { message: 'this is public data' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile() {
    return { message: 'this is protected data' };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create() {
    return 'Create user (admin only)';
  }
}
