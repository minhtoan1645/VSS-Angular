import { Permission } from './permission.model';

export type Role = 'Admin' | 'Role1' | 'Role2';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}
