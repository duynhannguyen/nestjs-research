import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AUTH_TYPE_KEY,
  AuthTypeDecoratorPayload,
} from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token-guard';
import { ApiKeyGuard } from './api-key-guard';
import { AuthType, conditionGuard } from '../constants/auth.constants';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  // video: 20:41
  //   constructor(
  //     private readonly reflector: Reflector,
  //     private readonly accessTokenGuard: AccessTokenGuard,
  //     private readonly apiKeyGuard: ApiKeyGuard,
  //   ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<
      AuthTypeDecoratorPayload | undefined
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? {
      authTypes: [AuthType.None],
      option: { condition: conditionGuard.And },
    };
    console.log('authTypeValue', authTypeValue);
    const guards = authTypeValue.authTypes.map(
      (authType) => this.authTypeGuardMap[authType],
    );
    if (authTypeValue.option.condition === conditionGuard.Or) {
      for (const instance of guards) {
        const canActivate = await instance.canActivate(context);
        if (canActivate) {
          return true;
        }
      }
      throw new UnauthorizedException();
    } else {
      for (const instance of guards) {
        const canActivate = await instance.canActivate(context);
        if (!canActivate) {
          throw new UnauthorizedException();
        }
      }
      return true;
    }
  }
}
