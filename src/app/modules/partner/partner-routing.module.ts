import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PartnerAddComponent } from './pages/partner-add/partner-add.component';
import { PartnerDetailComponent } from './pages/partner-detail/partner-detail.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PartnerListComponent
  },
  {
    path: 'add',
    component: PartnerAddComponent,
    data: {
      contentClass: 'dashboard-content--add-partner'
    }
  },
  {
    path: ':id',
    component: PartnerDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule {}
