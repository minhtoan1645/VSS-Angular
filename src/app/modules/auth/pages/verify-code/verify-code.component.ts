import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent {
  readonly verifyCodeForm = this.formBuilder.group({
    verifyCode: ['', [Validators.required, Validators.minLength(4)]]
  });

  resendCount = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
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
