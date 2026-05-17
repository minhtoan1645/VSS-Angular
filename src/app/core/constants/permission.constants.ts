export const PERMISSIONS = {
  usersRead: 'users:read',
  usersWrite: 'users:write',
  partnersRead: 'partners:read',
  partnersWrite: 'partners:write'
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
