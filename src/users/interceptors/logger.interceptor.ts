import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = request.user?.id || 'anonymous';
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    this.logger.log(
      `📥 ${method} ${url} - ${className}.${handlerName} - User: ${userId} - IP: ${ip}`,
    );

    if (Object.keys(body || {}).length > 0) {
      this.logger.log(`📥 Body: ${JSON.stringify(body)}`);
    }

    if (Object.keys(query || {}).length > 0) {
      this.logger.log(`📥 Query: ${JSON.stringify(query)}`);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log(`📤 ${method} ${url} ${statusCode} - ${duration}ms`);
        },
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        this.logger.error(
          `❌ ${method} ${url} - Error: ${error.message} - ${duration}ms`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }
}
