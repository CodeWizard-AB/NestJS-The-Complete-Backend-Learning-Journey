import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddlware } from './middlewares/logger.middleware';
import { cors } from './middlewares/cors.middleware';
import { rateLimit } from './middlewares/rate-limit.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(rateLimit(5, 1000 * 60), LoggerMiddlware, cors)
      .exclude('auth/login')
      .forRoutes('*');
  }
}
