import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule.forRoot({
      host: 'localhost',
      port: 5432,
      username: 'adobe',
      password: 'adobe123',
      database: 'chat',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.production',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@Inject('DATABASE_OPTIONS') private database: any) {
    console.log(this.database);
  }
}
