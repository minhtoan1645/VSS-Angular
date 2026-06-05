import { Routes } from '@angular/router';

import { PERMISSIONS } from './core/constants/permission.constants';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth.routes').then((m) => m.authRoutes)
      }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user/user.routes').then((m) => m.userRoutes),
        canActivate: [permissionGuard],
        data: {
          permission: PERMISSIONS.userView,
          tabTitle: 'Người dùng',
          tabIcon: 'assets/images/icons/tag-user.png',
          sectionTitle: 'Người dùng',
          sectionKey: 'users'
        }
      },
      {
        path: 'partners',
        loadChildren: () =>
          import('./modules/partner/partner.routes').then((m) => m.partnerRoutes),
        canActivate: [permissionGuard],
        data: {
          permission: PERMISSIONS.partnerView,
          tabTitle: 'Đối tác',
          tabIcon: 'assets/images/icons/tag-user.png',
          sectionTitle: 'Đối tác',
          sectionKey: 'partners'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
