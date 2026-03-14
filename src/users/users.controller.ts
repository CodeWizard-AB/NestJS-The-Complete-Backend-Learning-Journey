import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InSufficientBalanceException } from 'src/exceptions/insufficient-balance.exception';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  findOne(@Param('id') id: string) {
    const isAdmin = false;

    if (!isAdmin) {
      throw new UnauthorizedException('You are not authorized');
    }

    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('purchase')
  purchase(@Body() data: any) {
    const price = 100;
    const balance = 50;

    if (balance < price) {
      throw new InSufficientBalanceException(price, balance);
    }

    return { message: 'Purchase successful' };
  }
}
