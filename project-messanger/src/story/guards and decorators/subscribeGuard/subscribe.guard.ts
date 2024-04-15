import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SUBSCRIBES_KEY } from './subscribe.decorator';
import { Subscribe } from '../../helpers/subscribe.enum';

@Injectable()
export class SubscribeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredSubscribe = this.reflector.getAllAndOverride<Subscribe[]>(
      SUBSCRIBES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredSubscribe) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(requiredSubscribe);
    if (Array.isArray(requiredSubscribe)) {
      return requiredSubscribe.some(
        (subscribe) => user.subscribes?.includes(subscribe),
      );
    } else {
      return false;
    }
  }
}
