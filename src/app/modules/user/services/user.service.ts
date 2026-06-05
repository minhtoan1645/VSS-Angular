import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserApiService } from '../api/user-api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly userApiService: UserApiService) {}

  getUsers(): Observable<User[]> {
    return this.userApiService.getUsers();
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.userApiService.getUserById(id);
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.userApiService.getDepartmentOptions();
  }
}
