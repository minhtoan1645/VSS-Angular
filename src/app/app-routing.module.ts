import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
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
          import('./modules/auth/auth.module').then((m) => m.AuthModule)
      }
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule),
        data: {
          tabTitle: 'Người dùng',
          tabIcon: 'assets/images/icons/tag-user.png',
          sectionTitle: 'Người dùng',
          sectionKey: 'users'
        }
      },
      {
        path: 'partners',
        loadChildren: () =>
          import('./modules/partner/partner.module').then((m) => m.PartnerModule),
        data: {
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
