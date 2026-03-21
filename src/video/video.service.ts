import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class VideoService {
  constructor(@InjectQueue('video') private readonly videoQueue: Queue) {}

  async addVideoToQueue(videoData: any) {
    const job = await this.videoQueue.add('process-video', videoData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
      priority: 1,
    });

    return {
      message: 'Video added to queue',
      jobId: job.id,
    };
  }
}
