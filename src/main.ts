import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { type Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });
  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor(req: Request) {
      if (req.query?.version) {
        return req.query.version as string;
      }

      return '';
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
