import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor('video')
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(@InjectQueue('video') private readonly videoQueue: Queue) {
    super();
    this.logger.log('🆕 New processor instance created for job');
  }

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id} ${job.name}`);
    this.logger.log(`Video : ${job.data.filename}`);

    if (job.name === 'process-video') {
      return this.processVideo(job);
    }

    if (job.name === 'generate-thumbnail') {
      return this.generateThumbnail(job);
    }

    throw new Error(`Unknown job type: ${job.name}`);
  }

  private async processVideo(job: Job) {
    await job.updateProgress(0);
    this.logger.log('Step 1: Loading video...');

    await this.sleep(2000);
    await job.updateProgress(20);

    this.logger.log('Step 2: Processing video...');
    await this.sleep(3000);
    await job.updateProgress(60);

    this.logger.log('Step 3: Generating thumbnail...');
    const { thumbnailUrl } = await this.generateThumbnail(job);
    await job.updateProgress(80);

    this.logger.log('Step 4: Saving results...');
    await this.sleep(1000);
    await job.updateProgress(100);

    return {
      sucess: true,
      message: 'Video processed successfully',
      filename: job.data.filename,
      thumbnailUrl,
    };
  }

  private async generateThumbnail(job: Job) {
    this.logger.log('📸 Generating thumbnail...');
    await this.sleep(2000);

    return {
      success: true,
      thumbnailUrl: `/thumbnails/${job.data.filename}.jpg`,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed!`);
    this.logger.log(result);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: any) {
    this.logger.error(`Job ${job.id} failed!`);
    this.logger.error(error);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number) {
    this.logger.log(`Job ${job.id} progress: ${progress}%`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is active!`);
  }
}
