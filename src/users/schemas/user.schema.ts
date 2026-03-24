import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/auth/schema/refreshToken.schema';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.USER })
  role: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop({ default: null, type: Date })
  lockUntil: Date;

  @Prop([RefreshTokenSchema])
  refreshTokens: RefreshToken[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
