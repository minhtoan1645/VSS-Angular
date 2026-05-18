import { AuthUser, Role } from '../models/auth.models';
import { Permission } from '../models/permission.model';

export const ROLES = {
  admin: 'Admin',
  agent: 'Agent',
  manager: 'Manager'
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
  [ROLES.agent]: [
    PERMISSIONS.userView,
    PERMISSIONS.partnerView
  ],
  [ROLES.manager]: [
    PERMISSIONS.partnerView,
    PERMISSIONS.partnerCreate,
    PERMISSIONS.partnerUpdate,
    PERMISSIONS.partnerDelete
  ]
};

export const ALL_ROLES: readonly Role[] = [
  ROLES.admin,
  ROLES.agent,
  ROLES.manager
];

export const TEST_USERS: Record<Role, AuthUser> = {
  [ROLES.admin]: {
    id: 'test-admin',
    displayName: 'Admin Tester',
    email: 'admin@gmail.com',
    password: '123456',
    role: ROLES.admin,
    permissions: [...ROLE_PERMISSIONS[ROLES.admin]]
  },
  [ROLES.agent]: {
    id: 'test-agent',
    displayName: 'Agent Tester',
    email: 'agent@gmail.com',
    password: '123456',
    role: ROLES.agent,
    permissions: [...ROLE_PERMISSIONS[ROLES.agent]]
  },
  [ROLES.manager]: {
    id: 'test-manager',
    displayName: 'Manager Tester',
    email: 'manager@gmail.com',
    password: '123456',
    role: ROLES.manager,
    permissions: [...ROLE_PERMISSIONS[ROLES.manager]]
  }
};
