import { Injectable } from '@nestjs/common';

export interface Logger {
  log(message: string): void;
}

@Injectable()
export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(`[Console] ${message}`);
  }
}

@Injectable()
export class FileLogger implements Logger {
  log(message: string) {
    // Write to file
    console.log(`[File] ${message}`);
  }
}
