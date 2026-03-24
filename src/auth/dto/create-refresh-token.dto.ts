export class CreateRefreshTokenDto {
  userId: string;
  token: string;
  expiresAt: Date;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
}
