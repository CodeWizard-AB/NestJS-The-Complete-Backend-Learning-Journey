import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class AppService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    BeforeApplicationShutdown,
    OnModuleDestroy
{
  private readonly logger = new Logger(AppService.name);
  private processingQueue: string[] = [];
  private isProcessing: boolean = false;
  private intervalId: NodeJS.Timeout;

  async onModuleInit() {
    this.logger.log('📦 App Module initialized');
    this.logger.log('🔌 Connecting to database...');
    await this.connectToDatabase();
    this.logger.log('✅ Connected to database');
  }

  async onApplicationBootstrap() {
    this.logger.log('🚀 Application bootstrapped');
    this.logger.log('▶️ Starting file processor...');
    this.startProcessing();
    this.logger.log('✅ File processor started');
  }

  async onModuleDestroy() {
    this.logger.log('🛑 App Module destroying');
    this.logger.log('⏸️ Stopping file acceptance');
    this.isProcessing = false;
  }

  async beforeApplicationShutdown(signal?: string) {
    this.logger.log(`⚠️ Before shutdown (${signal})`);
    this.logger.log(
      `📂 Processing ${this.processingQueue.length} remaining files...`,
    );
    await this.processRemaining();
    this.logger.log('✅ All files processed');
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`🔌 Shutting down (${signal})`);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.logger.log('⏹️ Stopped background processor');
    }
    await this.disconnectFromDatabase();
    this.logger.log('👋 File processor shut down');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async connectToDatabase() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  private async disconnectFromDatabase() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  private startProcessing() {
    this.isProcessing = true;
    this.intervalId = setInterval(() => {
      if (this.isProcessing && this.processingQueue.length > 0) {
        const file = this.processingQueue.shift();
        this.logger.log('📦 Processing: ', file);
      }
    }, 2000);
  }

  private async processRemaining() {
    while (this.processingQueue.length > 0) {
      const file = this.processingQueue.shift();
      this.logger.log(`📄 Processing remaining: ${file}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  addFile(filename: string) {
    if (!this.isProcessing) {
      throw new Error('Processor is shutting down');
    }
    this.processingQueue.push(filename);
    this.logger.log(`+ Added to queue: ${filename}`);
    return {
      success: true,
      length: this.processingQueue.length,
      filename,
    };
  }
}
