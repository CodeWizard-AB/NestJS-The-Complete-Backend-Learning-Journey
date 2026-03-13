import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddlware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'] || '';
    console.log(`[${method}] ${originalUrl} ${ip} ${userAgent}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      console.log(
        `[${method}] ${originalUrl} ${ip} ${userAgent} ${statusCode} ${duration}ms`,
      );
    });

    next();
  }
}
