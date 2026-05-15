import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { InputComponent } from './input/input.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    PaginationComponent
  ]
})
export class ComponentsModule {}
