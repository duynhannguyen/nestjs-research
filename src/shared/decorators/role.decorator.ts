import { RoleType } from '../constants/roles.constans';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'roleKey';
export type RoleTypeDecoratorPayload = {
  roleKey: RoleType[];
};
export const Roles = (roleTypes: RoleType[]) => {
  return SetMetadata('roleKey', { roleTypes });
};
