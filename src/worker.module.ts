import { Module } from '@nestjs/common';
import { VideoProcessor } from './video/video.processor';
import { VideoEventsListener } from './video/video.listener';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL as string },
    }),
    BullModule.registerQueue({
      name: 'video',
    }),
  ],
  providers: [VideoProcessor, VideoEventsListener],
})
export class WorkerModule {}
