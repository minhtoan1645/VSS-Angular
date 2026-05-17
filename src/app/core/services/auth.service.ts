import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthToken, AuthUser } from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly tokenStorage: TokenStorageService) {}

  getCurrentUser(): Observable<AuthUser | null> {
    return of(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.tokenStorage.getToken()?.accessToken);
  }

  setSession(token: AuthToken): void {
    this.tokenStorage.setToken(token);
  }

  clearSession(): void {
    this.tokenStorage.clearToken();
  }
}
