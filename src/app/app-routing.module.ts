import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';

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
        path: 'login',
        component: LoginComponent,
        data: {
          pageClasses: ['login-page']
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          pageClasses: ['register-page']
        }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          pageClasses: ['login-page', 'forgot-password-page']
        }
      },
      {
        path: 'verify-code',
        component: VerifyCodeComponent,
        data: {
          pageClasses: ['login-page', 'verify-code-page']
        }
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
          pageClasses: ['login-page', 'reset-password-page']
        }
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
