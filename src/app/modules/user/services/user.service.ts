import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UserApiService } from '../api/user-api.service';
import { UserPatch } from '../models/user-data-source.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(true);
  private readonly _loadError = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly loadError = this._loadError.asReadonly();

  private readonly users$ = toObservable(this._users);

  constructor(private readonly api: UserApiService) {
    this.api.getUsers().subscribe({
      next: (users) => { this._users.set(users); this._loading.set(false); },
      error: () => { this._loadError.set('Không thể tải danh sách người dùng.'); this._loading.set(false); }
    });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.users$.pipe(map((list) => list.find((u) => u.id === id)));
  }

  getDepartmentOptions(): Observable<string[]> {
    return this.api.getDepartmentOptions();
  }

  updateUser(id: number, patch: UserPatch): Observable<User> {
    return this.api.updateUser(id, patch).pipe(
      tap((updated) => this._users.update((list) => list.map((u) => (u.id === id ? updated : u))))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.api.deleteUser(id).pipe(
      tap(() => this._users.update((list) => list.filter((u) => u.id !== id)))
    );
  }
}
