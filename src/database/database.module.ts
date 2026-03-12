import { DynamicModule, Module } from '@nestjs/common';

interface DatabaseOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
      ],
      exports: ['DATABASE_OPTIONS'],
    };
  }
}
