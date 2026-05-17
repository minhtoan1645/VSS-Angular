import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { PaginationComponent } from './components/pagination/pagination.component';

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
export class SharedModule {}
