import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ReqContext,
  type RequestContext,
} from './decorators/request-context.decorator';
import { type FilterParams, Filters } from './decorators/filters.decorator';
import { DeviceInfo } from './decorators/device-info.decorator';
import { Locale } from './decorators/locale.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('request-context')
  getRequestContext(
    @ReqContext() context: RequestContext,
    @ReqContext('userAgent') userAgent: any,
  ): RequestContext {
    console.log(userAgent);
    return context;
  }

  @Get('filters')
  getFilters(@Filters(['id', 'name']) filters: FilterParams): FilterParams {
    return filters;
  }

  @Get('device-info')
  getDeviceInfo(@DeviceInfo() deviceInfo: DeviceInfo): DeviceInfo {
    return deviceInfo;
  }

  @Get('locale')
  getLocale(@Locale() locale: string): string {
    return locale;
  }
}
