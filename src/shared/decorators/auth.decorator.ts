import { SetMetadata } from '@nestjs/common';
import { AuthTypeType, conditionGuardType } from '../constants/auth.constants';

export const AUTH_TYPE_KEY = 'authType';
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[];
  option: { condition: conditionGuardType };
};

export const Auth = (
  authTypes: AuthTypeType[],
  option: { condition: conditionGuardType },
) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, option });
};
