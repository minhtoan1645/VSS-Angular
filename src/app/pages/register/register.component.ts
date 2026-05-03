import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  readonly countries = ['Việt Nam', 'Singapore', 'Thái Lan'];
  readonly industries = ['Bán lẻ', 'Giáo dục', 'Dịch vụ'];

  readonly registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    workEmail: ['', [Validators.required, Validators.email]],
    companyName: ['', Validators.required],
    country: ['', Validators.required],
    industry: ['', Validators.required],
    jobTitle: ['', Validators.required],
    purpose: ['', Validators.required]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  get workEmailControl(): AbstractControl | null {
    return this.registerForm.get('workEmail');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/login']);
  }
}
