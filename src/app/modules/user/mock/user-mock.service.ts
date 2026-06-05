import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserDataSource } from '../models/user-data-source.model';
import { User } from '../models/user.model';
import { MOCK_USERS } from './user.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable()
export class UserMockService implements UserDataSource {
  getUsers(): Observable<User[]> {
    return of([...MOCK_USERS]);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(MOCK_USERS.find((u) => u.id === id));
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.getUsers().pipe(
      map((users) => {
        const departments = users.reduce<string[]>(
          (all, user) => [...all, ...user.departments],
          []
        );
        return buildOptions(departments).slice(1);
      })
    );
  }
}
