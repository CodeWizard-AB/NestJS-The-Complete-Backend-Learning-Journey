import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, type ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(appConfig.KEY)
    private readonly appConfigService: ConfigType<typeof appConfig>,
  ) {
    const dbConfig = this.configService.get('database.database');
    console.log(dbConfig);
    console.log(this.appConfigService.environment);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
