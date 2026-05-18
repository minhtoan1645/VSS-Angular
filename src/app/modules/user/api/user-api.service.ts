import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '../models/user.model';
import { UserMockService } from '../mock/user-mock.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(private readonly userMockService: UserMockService) {}

  getUsers(): Observable<User[]> {
    return of(this.userMockService.getUsersSnapshot());
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.userMockService.getUsersSnapshot().find((user) => user.id === id));
  }
}
