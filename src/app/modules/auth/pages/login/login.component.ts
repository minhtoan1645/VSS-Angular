import { Component } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [CardComponent, ReactiveFormsModule, InputComponent, RouterLink, ButtonComponent]
})
export class LoginComponent {
  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
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
