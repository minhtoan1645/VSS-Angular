import { AbstractControl } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() control: AbstractControl | null = null;
  @Input() id = '';
  @Input() name = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() inputClass = 'input';
  @Input() wrapperClass = '';
  @Input() label = '';
  @Input() labelClass = 'visually-hidden';
  @Input() inputMode = '';
  @Input() showToggle = false;

  isPasswordVisible = false;

  get resolvedType(): string {
    if (this.showToggle && this.type === 'password' && this.isPasswordVisible) {
      return 'text';
    }

    return this.type;
  }

  get hasError(): boolean {
    return Boolean(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
