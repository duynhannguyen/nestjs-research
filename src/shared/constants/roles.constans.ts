export const roles = {
  Admin: 'admin',
  User: 'user',
  Guest: 'guest',
} as const;

export type RoleType = (typeof roles)[keyof typeof roles];
