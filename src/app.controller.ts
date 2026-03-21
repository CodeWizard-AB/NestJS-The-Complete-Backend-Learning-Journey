import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('2')
  @Get()
  getHelloVer2() {
    return this.appService.getHelloVersion2();
  }

  @Version('1')
  @Get()
  getHelloVer1(): string {
    return this.appService.getHelloVersion1();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
