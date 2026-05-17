import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ALL_ROLES, DEFAULT_ROLE, ROLE_PERMISSIONS } from '../constants/permission.constants';
import { AuthToken, AuthUser, Role } from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

const CURRENT_ROLE_STORAGE_KEY = 'vss_current_role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentRoleSubject: BehaviorSubject<Role>;
  readonly currentRole$: Observable<Role>;

  constructor(private readonly tokenStorage: TokenStorageService) {
    this.currentRoleSubject = new BehaviorSubject<Role>(this.getInitialRole());
    this.currentRole$ = this.currentRoleSubject.asObservable();
    this.persistMockUser(this.currentRoleSubject.value);
  }

  getCurrentUser(): AuthUser {
    return this.tokenStorage.getUser() ?? this.createMockUser(this.currentRoleSubject.value);
  }

  getCurrentRole(): Role {
    return this.currentRoleSubject.value;
  }

  setCurrentRole(role: Role): void {
    this.currentRoleSubject.next(role);
    localStorage.setItem(CURRENT_ROLE_STORAGE_KEY, role);
    this.persistMockUser(role);
  }

  isLoggedIn(): boolean {
    return Boolean(this.getCurrentUser());
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  setSession(token: AuthToken): void {
    this.tokenStorage.saveToken(token);
    this.persistMockUser(this.currentRoleSubject.value);
  }

  clearSession(): void {
    this.tokenStorage.clearToken();
  }

  logout(): void {
    this.clearSession();
    this.tokenStorage.clearUser();
    this.setCurrentRole(DEFAULT_ROLE);
  }

  private getInitialRole(): Role {
    const savedCurrentRole = localStorage.getItem(CURRENT_ROLE_STORAGE_KEY);
    if (savedCurrentRole && this.isSupportedRole(savedCurrentRole)) {
      return savedCurrentRole;
    }

    const savedRole = this.tokenStorage.getUser()?.role;
    return savedRole && this.isSupportedRole(savedRole) ? savedRole : DEFAULT_ROLE;
  }

  private isSupportedRole(role: string): role is Role {
    return ALL_ROLES.includes(role as Role);
  }

  private persistMockUser(role: Role): void {
    this.tokenStorage.saveUser(this.createMockUser(role));
  }

  private createMockUser(role: Role): AuthUser {
    return {
      id: 'mock-user',
      displayName: 'Development User',
      email: 'dev@vss.local',
      role,
      permissions: [...ROLE_PERMISSIONS[role]]
    };
  }
}
