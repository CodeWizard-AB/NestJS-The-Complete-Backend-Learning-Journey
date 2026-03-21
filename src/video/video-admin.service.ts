import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class VideoAdminService {
  private readonly logger = new Logger(VideoAdminService.name);

  constructor(@InjectQueue('video') private readonly videoQueue: Queue) {}

  async getQueueStats() {
    const waiting = await this.videoQueue.getWaitingCount();
    const active = await this.videoQueue.getActiveCount();
    const completed = await this.videoQueue.getCompletedCount();
    const failed = await this.videoQueue.getFailedCount();
    const delayed = await this.videoQueue.getDelayedCount();

    return { waiting, active, completed, failed, delayed };
  }

  async getAllJobs() {
    const waitingJobs = await this.videoQueue.getWaiting();
    const activeJobs = await this.videoQueue.getActive();
    const completedJobs = await this.videoQueue.getCompleted();
    const failedJobs = await this.videoQueue.getFailed();
    const delayedJobs = await this.videoQueue.getDelayed();

    return {
      waiting: waitingJobs.map((job) => this.formatJob(job)),
      active: activeJobs.map((job) => this.formatJob(job)),
      completed: completedJobs.map((job) => this.formatJob(job)),
      failed: failedJobs.map((job) => this.formatJob(job)),
      delayed: delayedJobs.map((job) => this.formatJob(job)),
    };
  }

  private formatJob(job: Job) {
    return {
      id: job.id, // Unique job ID
      name: job.name, // Job type
      data: job.data, // Job data
      progress: job.progress, // Progress (0-100)
      attempts: job.attemptsMade, // Times tried
      timestamp: job.timestamp, // When created
      processedOn: job.processedOn, // When processing started
      finishedOn: job.finishedOn, // When completed
      failedReason: job.failedReason, // Error message if failed
    };
  }

  async getJob(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    return this.formatJob(job);
  }

  async pauseQueue() {
    await this.videoQueue.pause();
    this.logger.log('Queue paused');
    return { message: 'Queue paused' };
  }

  async resumeQueue() {
    await this.videoQueue.resume();
    this.logger.log('Queue resumed');
    return { message: 'Queue resumed' };
  }

  async removeJob(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await job.remove();
    this.logger.log(`Job ${jobId} removed from queue`);

    return { message: 'Job removed from queue' };
  }

  async retryJob(jobId: string) {
    const job = await this.videoQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await job.retry();
    this.logger.log(`Job ${jobId} retried`);

    return { message: 'Job retried' };
  }

  async cleanQueue(olderThan: number = 24 * 60 * 60 * 1000) {
    const completedRemoved = await this.videoQueue.clean(
      olderThan, // Age in milliseconds
      100, // Limit (max jobs to clean per call)
      'completed', // Job state to clean
    );

    const failedRemoved = await this.videoQueue.clean(olderThan, 100, 'failed');

    this.logger.log(
      `🧹 Cleaned ${completedRemoved.length} completed and ${failedRemoved.length} failed jobs`,
    );

    return {
      completedRemoved: completedRemoved.length,
      failedRemoved: failedRemoved.length,
    };
  }

  async drainQueue() {
    await this.videoQueue.drain();

    this.logger.warn('⚠️ Queue drained! All jobs removed!');

    return { message: 'All jobs removed from queue' };
  }
}
