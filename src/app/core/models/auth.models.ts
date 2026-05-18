import { Permission } from './permission.model';

export type Role = 'Admin' | 'Agent' | 'Manager';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  password?: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}
