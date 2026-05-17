import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PricingPlan } from '../../models/partner-add.model';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.scss']
})
export class PricingCardComponent {
  @Input() plan: PricingPlan | null = null;
  @Input() selected = false;

  @Output() planSelect = new EventEmitter<string>();
}
