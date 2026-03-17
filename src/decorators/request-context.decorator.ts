import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestContext {
  user: any;
  ip: string;
  userAgent: string;
  requestId: string;
  timestamp: Date;
  method: string;
  url: string;
}

export const ReqContext = createParamDecorator(
  (data: keyof RequestContext, ctx: ExecutionContext): RequestContext | any => {
    const request = ctx.switchToHttp().getRequest();

    const context: RequestContext = {
      user: request.user,
      ip: request.ip,
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      timestamp: new Date(),
      requestId: request.id,
    };
    
    return data ? context[data] : context;
  },
);
