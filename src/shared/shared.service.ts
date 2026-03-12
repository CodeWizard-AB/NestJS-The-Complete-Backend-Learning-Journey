import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string, context?: string): void {
    console.log(`[${context || 'App'}] ${message}`);
  }
  error(message: string, trace?: string, context?: string): void {
    console.error(`[${context || 'App'}] ${message}`);
    if (trace) console.error(trace);
  }
  warn(message: string, context?: string): void {
    console.warn(`[${context || 'App'}] ${message}`);
  }
}

@Injectable()
export class DateService {
  now(): Date {
    return new Date();
  }
  format(date: Date, format: string = 'YYYY-MM-DD'): string {
    return date.toISOString().split('T')[0];
  }
}
