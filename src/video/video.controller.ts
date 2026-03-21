import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    console.log('video uploaded', file.filename);
    const result = await this.videoService.addVideoToQueue(file);
    return {
      success: true,
      message: 'Video uploaded! Processing in background...',
      jobId: result.jobId,
    };
  }
}
