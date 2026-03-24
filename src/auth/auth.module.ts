import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshToken, RefreshTokenSchema } from './schema/refreshToken.schema';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenService,
    JwtStrategy,
    GoogleStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
