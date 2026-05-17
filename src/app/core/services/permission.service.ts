import { Injectable } from '@angular/core';

import { PermissionKey } from '../constants/permission.constants';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  hasPermission(permission: PermissionKey, permissions: string[] = []): boolean {
    return permissions.includes(permission);
  }
}
