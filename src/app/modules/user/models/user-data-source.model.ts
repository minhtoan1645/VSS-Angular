import { Observable } from 'rxjs';

import { User } from './user.model';

export type UserPatch = Partial<Pick<User, 'name' | 'email' | 'phone'>>;

export interface UserDataSource {
  getUsers(): Observable<User[]>;
  getUserById(id: number): Observable<User | undefined>;
  getDepartmentOptions(): Observable<string[]>;
  updateUser(id: number, patch: UserPatch): Observable<User>;
  deleteUser(id: number): Observable<void>;
}
