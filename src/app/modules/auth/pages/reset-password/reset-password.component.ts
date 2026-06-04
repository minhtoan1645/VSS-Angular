import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

function passwordMatchValidator(): ValidatorFn {
  return (control): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [CardComponent, RouterLink, ReactiveFormsModule, InputComponent, ButtonComponent]
})
export class ResetPasswordComponent {
  readonly resetPasswordForm = this.formBuilder.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
    { validators: passwordMatchValidator() }
  );

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router
  ) {}

  get newPasswordControl(): AbstractControl | null {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/login']);
  }
}
