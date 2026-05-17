import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { PartnerStepperComponent } from './components/partner-stepper/partner-stepper.component';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';
import { PartnerAddComponent } from './pages/partner-add/partner-add.component';
import { PartnerDetailComponent } from './pages/partner-detail/partner-detail.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';
import { PartnerRoutingModule } from './partner-routing.module';

@NgModule({
  declarations: [
    PartnerAddComponent,
    PartnerDetailComponent,
    PartnerListComponent,
    PartnerStepperComponent,
    PricingCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PartnerRoutingModule
  ]
})
export class PartnerModule {}
