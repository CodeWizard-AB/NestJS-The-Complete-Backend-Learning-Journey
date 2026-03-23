import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: CreateAuthDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.generateToken(req.user as any);

    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }

  @Get('/success')
  async success(@Req() req: Request) {
    return req.user;
  }
}
