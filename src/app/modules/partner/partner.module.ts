import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../../components/components.module';
import { PartnerAddComponent } from './pages/partner-add/partner-add.component';
import { PartnerDetailComponent } from './pages/partner-detail/partner-detail.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';
import { PartnerRoutingModule } from './partner-routing.module';

@NgModule({
  declarations: [
    PartnerAddComponent,
    PartnerDetailComponent,
    PartnerListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    PartnerRoutingModule
  ]
})
export class PartnerModule {}
