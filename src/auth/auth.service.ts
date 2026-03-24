import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async findOrCreateGoogleUser(googleUser: any) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        password: googleUser.accessToken,
      });
    }

    return user;
  }

  async register(data: {
    email: string;
    password: string;
    meta: {
      deviceName: string;
      userAgent: string;
      ipAddress: string;
    };
  }) {
    const { email, password } = data;

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser);

    await this.refreshTokenService.create({
      userId: newUser.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ...data.meta,
    });

    return tokens;
  }

  async login(data: {
    email: string;
    password: string;
    meta: {
      deviceName: string;
      userAgent: string;
      ipAddress: string;
    };
  }) {
    const { email, password } = data;

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.lockUntil && user.lockUntil > new Date()) {
      const secondsLeft = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 1000,
      );
      throw new UnauthorizedException(
        `Account locked. Try again in ${secondsLeft} seconds.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.usersService.recordFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.resetFailedLogin(user.id);

    const tokens = await this.generateTokens(user);

    await this.refreshTokenService.create({
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 86400),
      ...data.meta,
    });

    return tokens;
  }

  async logout(userId: string, refreshToken: string) {
    const matched = await this.refreshTokenService.findMatchingToken(
      userId,
      refreshToken,
    );
    if (matched) {
      await this.refreshTokenService.revoke(matched.id);
    }
  }

  async refresh(id: string, refreshToken: string) {
    const user = await this.usersService.findById(id);

    if (!user || !user) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokens[0].token,
    );

    if (!isRefreshTokenValid) {
      await this.usersService.update(id, { refreshToken: null });
      throw new ForbiddenException(
        'Refresh token reuse detected — all sessions revoked',
      );
    }

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async generateTokens(user: UserDocument) {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(id: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(id, { refreshToken: hashed });
  }
}
