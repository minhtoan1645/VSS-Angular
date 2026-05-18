import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { MOCK_USERS } from './user.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable({
  providedIn: 'root'
})
export class UserMockService {
  getUsersSnapshot(): User[] {
    return MOCK_USERS;
  }

  getUsers(): Observable<User[]> {
    return of(MOCK_USERS);
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.getUsers().pipe(
      map((users) => {
        const departments = users.reduce<string[]>(
          (allDepartments, user) => [...allDepartments, ...user.departments],
          []
        );

        return buildOptions(departments).slice(1);
      })
    );
  }
}
