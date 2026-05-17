import { Injectable } from '@angular/core';

import { AuthToken, AuthUser } from '../models/auth.models';

const AUTH_TOKEN_STORAGE_KEY = 'vss_auth_token';
const AUTH_USER_STORAGE_KEY = 'vss_auth_user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  getToken(): AuthToken | null {
    return this.readStorageItem<AuthToken>(AUTH_TOKEN_STORAGE_KEY);
  }

  saveToken(token: AuthToken): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(token));
  }

  setToken(token: AuthToken): void {
    this.saveToken(token);
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  getUser(): AuthUser | null {
    return this.readStorageItem<AuthUser>(AUTH_USER_STORAGE_KEY);
  }

  saveUser(user: AuthUser): void {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }

  clearUser(): void {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }

  private readStorageItem<T>(key: string): T | null {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }
}
