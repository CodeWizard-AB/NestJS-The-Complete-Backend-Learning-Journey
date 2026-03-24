import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() data: CreateAuthDto) {
    return await this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: CreateAuthDto) {
    return await this.authService.login(body);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request & { user: UserDocument }) {
    return await this.authService.refresh(req.user.id, req.user.refreshToken!);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() req: Request & { user: UserDocument }) {
    return await this.authService.logout(req.user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(req.user as any);

    res.redirect(
      `http://localhost:3000/auth/success?token=${tokens.accessToken}`,
    );
  }

  @Get('/success')
  async success(@Req() req: Request) {
    return req.user;
  }
}
