import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    UserDetailComponent,
    UserListComponent
]
})
export class UserModule {}
