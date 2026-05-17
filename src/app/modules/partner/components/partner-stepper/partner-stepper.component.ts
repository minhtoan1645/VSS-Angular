import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  PartnerAddMainStep,
  PartnerAddSubStep,
  PartnerStep
} from '../../models/partner-add.model';

@Component({
  selector: 'app-partner-stepper',
  templateUrl: './partner-stepper.component.html',
  styleUrls: ['./partner-stepper.component.scss']
})
export class PartnerStepperComponent {
  @Input() steps: PartnerStep[] = [];
  @Input() currentMainStep: PartnerAddMainStep = 1;
  @Input() currentSubStep: PartnerAddSubStep = 'information-general';
  @Input() completedSubSteps: PartnerAddSubStep[] = [];

  @Output() stepSelect = new EventEmitter<number>();

  isStepActive(stepNumber: number): boolean {
    return this.currentMainStep >= stepNumber;
  }

  isCurrentStep(stepNumber: number): boolean {
    return this.currentMainStep === stepNumber;
  }

  isSubStepActive(substep: PartnerAddSubStep): boolean {
    return this.currentSubStep === substep;
  }

  isSubStepCompleted(substep: PartnerAddSubStep): boolean {
    return this.completedSubSteps.includes(substep);
  }
}
