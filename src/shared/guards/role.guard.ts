import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ROLE_KEY,
  RoleTypeDecoratorPayload,
} from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      RoleTypeDecoratorPayload | undefined
    >(ROLE_KEY, [context.getHandler(), context.getClass()]);
    console.log('requiredRoles', requiredRoles);
    return true;
  }
}
