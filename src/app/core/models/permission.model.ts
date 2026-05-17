export type Permission =
  | 'user:view'
  | 'user:create'
  | 'user:update'
  | 'user:delete'
  | 'partner:view'
  | 'partner:create'
  | 'partner:update'
  | 'partner:delete';

export type PermissionMode = 'any' | 'all';
