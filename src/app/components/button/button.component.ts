import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() buttonClass = 'btn btn--primary';
  @Input() disabled = false;
  @Input() iconSrc = '';
  @Input() iconAlt = '';
}
