import { Logger } from '@nestjs/common';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';

@QueueEventsListener('video')
export class VideoEventsListener extends QueueEventsHost {
  private readonly logger = new Logger(VideoEventsListener.name);

  @OnQueueEvent('added')
  onAdded(args: { jobId: string; name: string }) {
    this.logger.log(`Job added to queue`);
    this.logger.log(`Job ID: ${args.jobId}`);
    this.logger.log(`Job type: ${args.name}`);
  }

  @OnQueueEvent('active')
  onActive(args: { jobId: string; prev?: string }) {
    this.logger.log(`▶️ Job ${args.jobId} started processing`);
  }

  @OnQueueEvent('completed')
  onCompleted(args: {
    jobId: string;
    returnvalue: any; // Result from process() function
    prev?: string;
  }) {
    this.logger.log(`✅ Job ${args.jobId} completed`);
    this.logger.log(`   Result: ${JSON.stringify(args.returnvalue)}`);
  }

  @OnQueueEvent('failed')
  onFailed(args: {
    jobId: string;
    failedReason: string; // Error message
    prev?: string;
  }) {
    this.logger.error(`❌ Job ${args.jobId} failed`);
    this.logger.error(`   Reason: ${args.failedReason}`);
  }

  @OnQueueEvent('progress')
  onProgress(args: {
    jobId: string;
    data: any; // Progress value (0-100)
  }) {
    this.logger.log(`📊 Job ${args.jobId} progress: ${args.data}%`);
  }

  @OnQueueEvent('waiting')
  onWaiting(args: { jobId: string; prev?: string }) {
    this.logger.log(`⏳ Job ${args.jobId} is waiting in queue`);
  }

  @OnQueueEvent('delayed')
  onDelayed(args: { jobId: string; delay: number }) {
    this.logger.log(`⏰ Job ${args.jobId} delayed by ${args.delay}ms`);
  }

  @OnQueueEvent('removed')
  onRemoved(args: { jobId: string; prev: string }) {
    this.logger.log(`🗑️ Job ${args.jobId} removed from queue`);
  }

  @OnQueueEvent('drained')
  onDrained() {
    this.logger.log(`🎉 Queue is empty! All jobs completed`);
  }

  @OnQueueEvent('paused')
  onPaused() {
    this.logger.log(`⏸️ Queue paused`);
  }

  @OnQueueEvent('resumed')
  onResumed() {
    this.logger.log(`▶️ Queue resumed`);
  }
}
