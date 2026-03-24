import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: false })
  isRevoked: boolean;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
