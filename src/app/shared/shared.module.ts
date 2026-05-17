import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HasPermissionDirective } from './directives/has-permission.directive';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    PaginationComponent,
    HasPermissionDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    PaginationComponent,
    HasPermissionDirective
  ]
})
export class SharedModule {}
