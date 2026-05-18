import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ALL_ROLES, DEFAULT_ROLE, ROLE_PERMISSIONS, TEST_USERS } from '../constants/permission.constants';
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
  }

  getCurrentUser(): AuthUser | null {
    return this.tokenStorage.getUser();
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
    return Boolean(this.tokenStorage.getToken() && this.tokenStorage.getUser());
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
    localStorage.removeItem(CURRENT_ROLE_STORAGE_KEY);
    this.currentRoleSubject.next(DEFAULT_ROLE);
  }

  seedTestUser(role: Role): AuthUser {
    const user = TEST_USERS[role];
    this.currentRoleSubject.next(role);
    localStorage.setItem(CURRENT_ROLE_STORAGE_KEY, role);
    this.tokenStorage.saveUser(user);
    this.tokenStorage.saveToken({ accessToken: `mock-${role.toLowerCase()}-token` });
    return user;
  }

  getTestUsers(): readonly AuthUser[] {
    return Object.values(TEST_USERS);
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
    const user = this.createMockUser(role);
    this.tokenStorage.saveUser(user);
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
