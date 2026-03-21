import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function boostrapWorker() {
  const app = await NestFactory.create(WorkerModule);
  await app.init();
  console.log('👷 Worker process started');
  console.log('📋 Listening for jobs in Redis queue...');
}

boostrapWorker();
