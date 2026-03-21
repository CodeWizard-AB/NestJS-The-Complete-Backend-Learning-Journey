import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly scheduleRegistry: SchedulerRegistry) {}

  getCronJobs() {
    const jobs = this.scheduleRegistry.getCronJobs();
    const jobList: { name: string; nextRun: any }[] = [];

    jobs.forEach((value, key) => {
      jobList.push({
        name: key,
        nextRun: value.nextDate(),
      });
    });

    return jobList;
  }

  getIntervals() {
    const intervals = this.scheduleRegistry.getIntervals();

    return intervals.map((name) => ({
      name,
      type: 'interval',
    }));
  }

  getTimeouts() {
    const timeouts = this.scheduleRegistry.getTimeouts();

    return timeouts.map((name) => ({
      name,
      type: 'timeout',
    }));
  }

  addCronJob(name: string, cronExpression: string, callback: () => void) {
    const job = new CronJob(cronExpression, callback, null, true);
    this.scheduleRegistry.addCronJob(name, job);
    this.logger.log(`Cron job ${name} added`);
  }

  deleteCronJob(name: string) {
    this.scheduleRegistry.getCronJob(name).stop();
    this.scheduleRegistry.deleteCronJob(name);
    this.logger.log(`Cron job ${name} deleted`);
  }
}
