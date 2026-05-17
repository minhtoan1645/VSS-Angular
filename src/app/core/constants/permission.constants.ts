import { Role } from '../models/auth.models';
import { Permission } from '../models/permission.model';

export const ROLES = {
  admin: 'Admin',
  role1: 'Role1',
  role2: 'Role2'
} as const;

export const DEFAULT_ROLE: Role = ROLES.admin;

export const PERMISSIONS = {
  userView: 'user:view',
  userCreate: 'user:create',
  userUpdate: 'user:update',
  userDelete: 'user:delete',
  partnerView: 'partner:view',
  partnerCreate: 'partner:create',
  partnerUpdate: 'partner:update',
  partnerDelete: 'partner:delete'
} as const;

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.admin]: [
    PERMISSIONS.userView,
    PERMISSIONS.userCreate,
    PERMISSIONS.userUpdate,
    PERMISSIONS.userDelete,
    PERMISSIONS.partnerView,
    PERMISSIONS.partnerCreate,
    PERMISSIONS.partnerUpdate,
    PERMISSIONS.partnerDelete
  ],
  [ROLES.role1]: [
    PERMISSIONS.partnerView
  ],
  [ROLES.role2]: [
    PERMISSIONS.partnerView,
    PERMISSIONS.partnerCreate,
    PERMISSIONS.partnerUpdate,
    PERMISSIONS.partnerDelete
  ]
};

export const ALL_ROLES: readonly Role[] = [
  ROLES.admin,
  ROLES.role1,
  ROLES.role2
];
