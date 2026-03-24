import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schema/refreshToken.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(data: CreateRefreshTokenDto) {
    data.token = await hash(data.token, 10);
    return await this.refreshTokenModel.create(data);
  }

  async findMatchingToken(userId: string, refreshToken: string) {
    const activeRefreshTokens = await this.refreshTokenModel.find({
      userId,
      isRevoked: false,
    });

    for (const token of activeRefreshTokens) {
      if (token.expiresAt < new Date()) continue;
      const match = await compare(refreshToken, token.token);
      if (match) return token;
    }

    return null;
  }

  async revoke(tokenId: string) {
    return await this.refreshTokenModel.findByIdAndUpdate(
      tokenId,
      { isRevoked: true },
      { returnDocument: 'after' },
    );
  }

  async revokeAllSession(userId: string) {
    return await this.refreshTokenModel.updateMany(
      { userId },
      { isRevoked: true },
    );
  }
}
