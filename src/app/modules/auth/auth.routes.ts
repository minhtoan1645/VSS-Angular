import { Routes } from '@angular/router';

import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';

export const authRoutes: Routes = [
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
];
