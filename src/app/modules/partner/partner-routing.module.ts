import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PERMISSIONS } from '../../core/constants/permission.constants';
import { PermissionGuard } from '../../core/guards/permission.guard';
import { PartnerAddComponent } from './pages/partner-add/partner-add.component';
import { PartnerDetailComponent } from './pages/partner-detail/partner-detail.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PartnerListComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: PERMISSIONS.partnerView
    }
  },
  {
    path: 'add',
    component: PartnerAddComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: PERMISSIONS.partnerCreate,
      contentClass: 'dashboard-content--add-partner'
    }
  },
  {
    path: ':id',
    component: PartnerDetailComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: PERMISSIONS.partnerView
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule {}
