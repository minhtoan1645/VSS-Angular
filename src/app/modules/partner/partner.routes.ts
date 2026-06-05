import { Routes } from '@angular/router';

import { PERMISSIONS } from '../../core/constants/permission.constants';
import { permissionGuard } from '../../core/guards/permission.guard';
import { PartnerAddComponent } from './pages/partner-add/partner-add.component';
import { PartnerDetailComponent } from './pages/partner-detail/partner-detail.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';

export const partnerRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PartnerListComponent,
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.partnerView
    }
  },
  {
    path: 'add',
    component: PartnerAddComponent,
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.partnerCreate,
      contentClass: 'dashboard-content--add-partner'
    }
  },
  {
    path: ':id',
    component: PartnerDetailComponent,
    canActivate: [permissionGuard],
    data: {
      permission: PERMISSIONS.partnerView
    }
  }
];
