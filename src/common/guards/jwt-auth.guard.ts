import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

Injectable();
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('JwtAuthGuard');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    console.log('JwtAuthGuard handleRequest');
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
