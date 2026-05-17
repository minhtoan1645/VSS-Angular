import { Injectable } from '@angular/core';

import { AuthToken } from '../models/auth.models';

const AUTH_TOKEN_STORAGE_KEY = 'vss_auth_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  getToken(): AuthToken | null {
    const rawToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    return rawToken ? JSON.parse(rawToken) as AuthToken : null;
  }

  setToken(token: AuthToken): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(token));
  }

  clearToken(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}
