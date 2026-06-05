import { Observable } from 'rxjs';

import { User } from './user.model';

export interface UserDataSource {
  getUsers(): Observable<User[]>;
  getUserById(id: number): Observable<User | undefined>;
  getDepartmentOptions(): Observable<string[]>;
}
