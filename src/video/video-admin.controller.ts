import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { VideoAdminService } from './video-admin.service';

@Controller('admin/video-queue')
export class VideoAdminController {
  constructor(private videoAdminService: VideoAdminService) {}

  @Get('stats')
  getStats() {
    return this.videoAdminService.getQueueStats();
  }

  @Get('jobs')
  getAllJobs() {
    return this.videoAdminService.getAllJobs();
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.videoAdminService.getJob(id);
  }

  @Post('pause')
  pauseQueue() {
    return this.videoAdminService.pauseQueue();
  }

  @Post('resume')
  resumeQueue() {
    return this.videoAdminService.resumeQueue();
  }

  @Delete('jobs/:id')
  removeJob(@Param('id') id: string) {
    return this.videoAdminService.removeJob(id);
  }

  @Post('jobs/:id/retry')
  retryJob(@Param('id') id: string) {
    return this.videoAdminService.retryJob(id);
  }

  @Post('clean')
  cleanQueue(@Query('hours') hours: string = '24') {
    const milliseconds = parseInt(hours) * 60 * 60 * 1000;
    return this.videoAdminService.cleanQueue(milliseconds);
  }
}
