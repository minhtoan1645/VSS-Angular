import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [CardComponent, RouterLink, ReactiveFormsModule, InputComponent, ButtonComponent]
})
export class ForgotPasswordComponent {
  readonly forgotPasswordForm = this.formBuilder.group({
    accountEmail: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router
  ) {}

  get accountEmailControl(): AbstractControl | null {
    return this.forgotPasswordForm.get('accountEmail');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/verify-code']);
  }
}
