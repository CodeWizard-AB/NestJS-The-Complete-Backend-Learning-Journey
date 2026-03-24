import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}
export type PolicyHandlerCb = (ability: AppAbility) => boolean;
export type PolicyHandler = PolicyHandlerCb | IPolicyHandler;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const policies =
      this.reflector.get(CHECK_POLICIES_KEY, context.getHandler()) || [];

    if (!policies.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ability = this.caslAbilityFactory.createForUser(user);

    const allowed = policies.every((handler: PolicyHandler) =>
      typeof handler === 'function'
        ? handler(ability)
        : handler.handle(ability),
    );

    if (!allowed) {
      throw new ForbiddenException(
        'You do not have access to perform this action',
      );
    }

    return true;
  }
}
