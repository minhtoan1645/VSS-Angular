import { Routes } from '@angular/router';

import { PERMISSIONS } from '../../core/constants/permission.constants';
import { permissionGuard } from '../../core/guards/permission.guard';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserListComponent } from './pages/user-list/user-list.component';

export const userRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserListComponent,
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.userView
    }
  },
  {
    path: ':id',
    component: UserDetailComponent,
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.userView
    }
  }
];
