import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PERMISSIONS } from '../../core/constants/permission.constants';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserListComponent } from './pages/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserListComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: PERMISSIONS.userView
    }
  },
  {
    path: ':id',
    component: UserDetailComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: PERMISSIONS.userView
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
