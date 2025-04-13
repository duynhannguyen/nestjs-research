export const REQUEST_USER_KEY = 'user';

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  ApiKey: 'ApiKey',
} as const;

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType];

export const conditionGuard = {
  And: 'and',
  Or: 'or',
} as const;

export type conditionGuardType =
  (typeof conditionGuard)[keyof typeof conditionGuard];
