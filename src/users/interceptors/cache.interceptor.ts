import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, tap } from 'rxjs';
import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
} from '../decorators/cache.decorator';
import { type Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const cachekeyMetadata = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cachekeyMetadata) return next.handle();

    const ttl =
      this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler()) ||
      1000 * 60 * 60;

    const req = context.switchToHttp().getRequest();
    const cacheKey = this.buildCacheKey(cachekeyMetadata, req);

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`📥 Cache hit for ${cacheKey}`);
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + ttl,
        });
      }),
    );
  }

  private buildCacheKey(
    template: string,
    request: Request & { user: any; params: any },
  ): string {
    let key = template;
    key.replace(':userId', request?.user?.id || 'anonymous');
    key.replace(':id', request?.params?.id || '');

    if (Object.keys(request.query || {}).length > 0) {
      key += `:${JSON.stringify(request.query)}`;
    }

    return key;
  }
}
