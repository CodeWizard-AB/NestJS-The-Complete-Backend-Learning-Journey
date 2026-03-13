import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    console.log('global middleware');
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
