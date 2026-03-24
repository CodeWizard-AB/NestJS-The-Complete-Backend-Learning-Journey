import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CLAIM_KEY } from '../decorators/claim.decorator';
import { type Request } from 'express';

@Injectable()
export class ClaimGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredClaims =
      this.reflector.get<{ key: string; value: string }[]>(
        CLAIM_KEY,
        context.getHandler(),
      ) || [];

    if (!requiredClaims.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    if (!request?.user) {
      throw new UnauthorizedException();
    }

    return requiredClaims.every(({ key, value }) => {
      return request?.user?.[key] === value;
    });
  }
}
