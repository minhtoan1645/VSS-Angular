import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-verify-code',
    templateUrl: './verify-code.component.html',
    styleUrls: ['./verify-code.component.scss'],
    imports: [CardComponent, RouterLink, ReactiveFormsModule, InputComponent, ButtonComponent]
})
export class VerifyCodeComponent {
  readonly verifyCodeForm = this.formBuilder.group({
    verifyCode: ['', [Validators.required, Validators.minLength(4)]]
  });

  resendCount = 0;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router
  ) {}

  get verifyCodeControl(): AbstractControl | null {
    return this.verifyCodeForm.get('verifyCode');
  }

  resendCode(): void {
    this.resendCount += 1;
  }

  onSubmit(): void {
    if (this.verifyCodeForm.invalid) {
      this.verifyCodeForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/reset-password']);
  }
}
