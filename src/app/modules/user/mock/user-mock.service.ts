import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserDataSource, UserPatch } from '../models/user-data-source.model';
import { User } from '../models/user.model';
import { MOCK_USERS } from './user.mock';
import { buildOptions } from '../../../shared/utils/table.util';

@Injectable()
export class UserMockService implements UserDataSource {
  private readonly items: User[] = MOCK_USERS.map((u) => ({ ...u }));

  getUsers(): Observable<User[]> {
    return of([...this.items]);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.items.find((u) => u.id === id));
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

  updateUser(id: number, patch: UserPatch): Observable<User> {
    const index = this.items.findIndex((u) => u.id === id);
    if (index === -1) {
      return of(this.items[0]);
    }
    const current = this.items[index];
    const updated: User = {
      ...current,
      ...patch,
      avatarText: patch.name ? this.toAvatarText(patch.name) : current.avatarText
    };
    this.items[index] = updated;
    return of(updated);
  }

  deleteUser(id: number): Observable<void> {
    const index = this.items.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return of(undefined);
  }

  private toAvatarText(name: string): string {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0) ?? '';
    const last = words.length > 1 ? words[words.length - 1].charAt(0) : words[0]?.charAt(1) ?? '';
    return `${first}${last}`.toUpperCase();
  }
}
