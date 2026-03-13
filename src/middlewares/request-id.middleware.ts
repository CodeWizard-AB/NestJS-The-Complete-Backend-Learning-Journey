import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    req['requestId'] = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  }
}
