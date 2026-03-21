import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { BullModule } from '@nestjs/bullmq';
import { VideoProcessor } from './video.processor';
import { VideoEventsListener } from './video.listener';
import { VideoAdminController } from './video-admin.controller';
import { VideoAdminService } from './video-admin.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'video' })],
  controllers: [VideoController, VideoAdminController],
  providers: [VideoService, VideoAdminService],
})
export class VideoModule {}
