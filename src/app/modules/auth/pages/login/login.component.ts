import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  get emailControl(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const enteredEmail = String(this.loginForm.value.email || '').trim().toLowerCase();
    const enteredPassword = String(this.loginForm.value.password || '');
    const testUser = this.authService.getTestUsers().find(
      (user) => user.email.toLowerCase() === enteredEmail && user.password === enteredPassword
    );

    if (!testUser) {
      this.loginForm.get('password')?.setErrors({ invalidCredentials: true });
      return;
    }

    this.authService.seedTestUser(testUser.role);
    this.router.navigate(['/partners']);
  }
}
