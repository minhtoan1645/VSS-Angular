import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { USER_DATA_SOURCE } from './user-data-source.token';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly dataSource = inject(USER_DATA_SOURCE);

  getUsers(): Observable<User[]> {
    return this.dataSource.getUsers();
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.dataSource.getUserById(id);
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.dataSource.getDepartmentOptions();
  }
}
