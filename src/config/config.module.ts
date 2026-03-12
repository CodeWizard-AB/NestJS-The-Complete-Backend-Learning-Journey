import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

interface ConfigModuleOptions {
  folder?: string;
  envFilePath?: string;
  isGlobal?: boolean;
}

@Module({})
export class ConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    const {
      folder = './config',
      envFilePath = '.env',
      isGlobal = false,
    } = options;

    return {
      module: ConfigModule,
      global: isGlobal,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: { folder, envFilePath },
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
