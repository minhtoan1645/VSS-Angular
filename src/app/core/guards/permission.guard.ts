import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { PERMISSIONS } from '../constants/permission.constants';
import { Permission, PermissionMode } from '../models/permission.model';
import { PermissionService } from '../services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    return this.checkPermission(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.checkPermission(route);
  }

  private checkPermission(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredPermission = route.data.permission as Permission | Permission[] | undefined;
    const permissionMode = route.data.permissionMode as PermissionMode | undefined;

    if (!requiredPermission || this.hasRequiredPermission(requiredPermission, permissionMode)) {
      return true;
    }

    return this.getDeniedRedirect();
  }

  private hasRequiredPermission(
    requiredPermission: Permission | Permission[],
    permissionMode: PermissionMode = 'any'
  ): boolean {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    return permissionMode === 'all'
      ? this.permissionService.hasAllPermissions(permissions)
      : this.permissionService.hasAnyPermission(permissions);
  }

  private getDeniedRedirect(): UrlTree {
    if (this.permissionService.hasPermission(PERMISSIONS.partnerView)) {
      return this.router.createUrlTree(['/partners']);
    }

    return this.router.createUrlTree(['/login']);
  }
}
