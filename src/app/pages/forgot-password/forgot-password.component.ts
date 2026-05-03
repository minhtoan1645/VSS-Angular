import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  readonly forgotPasswordForm = this.formBuilder.group({
    accountEmail: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
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
