import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ALL_ROLES, DEFAULT_ROLE, TEST_USERS } from '../constants/permission.constants';
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

  isLoggedIn(): boolean {
    return Boolean(this.tokenStorage.getToken() && this.tokenStorage.getUser());
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /** Lưu session sau khi backend xác thực thành công. */
  setSession(token: AuthToken, user: AuthUser): void {
    this.tokenStorage.saveToken(token);
    this.tokenStorage.saveUser(user);
    this.currentRoleSubject.next(user.role);
    localStorage.setItem(CURRENT_ROLE_STORAGE_KEY, user.role);
  }

  setCurrentRole(role: Role): void {
    this.currentRoleSubject.next(role);
    localStorage.setItem(CURRENT_ROLE_STORAGE_KEY, role);
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.tokenStorage.clearUser();
    localStorage.removeItem(CURRENT_ROLE_STORAGE_KEY);
    this.currentRoleSubject.next(DEFAULT_ROLE);
  }

  clearSession(): void {
    this.tokenStorage.clearToken();
  }

  /** Chỉ dùng trong môi trường dev/mock — đăng nhập bằng tài khoản test. */
  seedTestUser(role: Role): AuthUser {
    const user = TEST_USERS[role];
    this.tokenStorage.saveUser(user);
    this.tokenStorage.saveToken({ accessToken: `mock-${role.toLowerCase()}-token` });
    this.currentRoleSubject.next(role);
    localStorage.setItem(CURRENT_ROLE_STORAGE_KEY, role);
    return user;
  }

  /** Chỉ dùng trong môi trường dev/mock. */
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
}
