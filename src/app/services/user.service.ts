import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCK_USERS } from '../mock-data/users.mock';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

        return Array.from(new Set(departments));
      })
    );
  }
}
