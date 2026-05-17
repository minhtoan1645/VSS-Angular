import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ROLE_PERMISSIONS } from '../constants/permission.constants';
import { Permission } from '../models/permission.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  readonly permissionsChanged$: Observable<unknown>;

  constructor(private readonly authService: AuthService) {
    this.permissionsChanged$ = this.authService.currentRole$;
  }

  hasPermission(permission: Permission): boolean {
    return this.getCurrentPermissions().includes(permission);
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  getCurrentPermissions(): Permission[] {
    return [...ROLE_PERMISSIONS[this.authService.getCurrentRole()]];
  }
}
