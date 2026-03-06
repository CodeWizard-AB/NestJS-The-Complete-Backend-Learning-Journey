import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  HttpCode,
  Header,
  Redirect,
  Scope,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { type Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('users controller created');
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ]);
      }, 2000);
    });
  }

  @Get('profile')
  @Redirect()
  findProfile() {
    const isAdmin = true;

    if (!isAdmin) {
      return {
        url: '/users',
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      };
    }

    return {
      url: '/users/1',
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    };
  }

  @Get('request')
  findRequest(@Req() request: Request) {
    console.log(request.url); // Current URL
    console.log(request.method); // HTTP method
    console.log(request.headers); // Request headers
    console.log(request.query); // Query parameters
    console.log(request.ip); // Client IP

    return {
      url: request.url,
      method: request.method,
    };
  }

  @Get('ab*cd')
  @HttpCode(HttpStatus.NO_CONTENT)
  getPattern() {
    return 'Matches: abcd, ab_cd, abXYZcd, etc.';
  }

  @Get('file1')
  @Header('Cache-Control', 'no-cache, no-store')
  @Header('Content-Type', 'application/pdf')
  downloadFile1() {
    return 'This is a PDF file content.';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':userId/posts/:postId')
  getUserPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<string> {
    return Promise.resolve(`User ID: ${userId}, Post ID: ${postId}`);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
