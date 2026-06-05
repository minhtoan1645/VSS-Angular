import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Permission, PermissionMode } from '../models/permission.model';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermission = route.data['permission'] as Permission | Permission[] | undefined;
  const permissionMode = (route.data['permissionMode'] as PermissionMode | undefined) ?? 'any';

  if (!requiredPermission) return true;

  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
  const hasPermission = permissionMode === 'all'
    ? permissionService.hasAllPermissions(permissions)
    : permissionService.hasAnyPermission(permissions);

  if (hasPermission) return true;

  return router.createUrlTree(['/forbidden']);
};
