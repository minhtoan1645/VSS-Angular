import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MOCK_USERS } from '../mock-data/users.mock';
import { User } from '../models/user.model';
import { buildOptions } from '../utils/table.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly users$ = of(MOCK_USERS);
  private readonly departmentOptions$ = this.users$.pipe(
    map((users) => {
      const departments = users.reduce<string[]>(
        (allDepartments, user) => [...allDepartments, ...user.departments],
        []
      );

      return buildOptions(departments).slice(1);
    })
  );

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.getUsers().pipe(
      map((users) => users.find((user) => user.id === id))
    );
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.departmentOptions$;
  }
}
