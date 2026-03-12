import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${context || 'App'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${context || 'App'}] ERROR: ${message}`);
    if (trace) console.error(trace);
  }
}
