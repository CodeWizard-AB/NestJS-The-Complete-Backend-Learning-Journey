import { registerAs } from '@nestjs/config';

interface AppConfig {
  port: number;
  environment: string;
  apiUrl: string;
}

export default registerAs(
  'appConfig',
  () =>
    ({
      port: parseInt(process.env.PORT!) || 3000,
      environment: process.env.NODE_ENV || 'development',
      apiUrl: process.env.API_URL || 'http://localhost:3000',
    }) as AppConfig,
);
