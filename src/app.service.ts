import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'NestJS API';
  }

  getHelloVersion1(): string {
    return 'Hello World! Version 1';
  }

  getHelloVersion2(): string {
    return 'Hello World! Version 2';
  }
}
