import { Module } from '@nestjs/common';
import { DateService, LoggerService } from './shared.service';

@Module({
  providers: [LoggerService, DateService],
  exports: [LoggerService, DateService],
})
export class SharedModule {}
