import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CONFIG } from 'src/config/config';
import { ConsoleLogger, FileLogger } from './logger.service';

@Module({
  providers: [
    {
      provide: 'LOGGER',
      useClass: process.env.LOGGER === 'file' ? FileLogger : ConsoleLogger,
    },
    BooksService,
    {
      provide: 'CONFIG',
      useValue: CONFIG,
    },
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (config: { dbHost: string; dbPort: number }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              `Connected to database at ${config.dbHost}:${config.dbPort}`,
            );
          }, 1000);
        });
      },
      inject: ['CONFIG'],
    },
  ],
  controllers: [BooksController],
})
export class BooksModule {}
