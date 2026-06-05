import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { PERMISSIONS, ROLES } from '../constants/permission.constants';
import { Role } from '../models/auth.models';
import { AuthService } from './auth.service';
import { PermissionService } from './permission.service';

function makeAuthServiceSpy(role: Role): jasmine.SpyObj<AuthService> {
  const roleSubject = new BehaviorSubject<Role>(role);
  const spy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentRole'], {
    currentRole$: roleSubject.asObservable()
  });
  spy.getCurrentRole.and.callFake(() => roleSubject.value);
  return spy;
}

describe('PermissionService', () => {
  let service: PermissionService;
  let authSpy: jasmine.SpyObj<AuthService>;

  describe('as Admin', () => {
    beforeEach(() => {
      authSpy = makeAuthServiceSpy(ROLES.admin);
      TestBed.configureTestingModule({ providers: [PermissionService, { provide: AuthService, useValue: authSpy }] });
      service = TestBed.inject(PermissionService);
    });

    it('has all 8 permissions', () => {
      expect(service.getCurrentPermissions().length).toBe(8);
    });

    it('hasPermission returns true for user:delete', () => {
      expect(service.hasPermission(PERMISSIONS.userDelete)).toBeTrue();
    });
  });

  describe('as Agent', () => {
    beforeEach(() => {
      authSpy = makeAuthServiceSpy(ROLES.agent);
      TestBed.configureTestingModule({ providers: [PermissionService, { provide: AuthService, useValue: authSpy }] });
      service = TestBed.inject(PermissionService);
    });

    it('has only view permissions', () => {
      const perms = service.getCurrentPermissions();
      expect(perms).toContain(PERMISSIONS.userView);
      expect(perms).toContain(PERMISSIONS.partnerView);
      expect(perms.length).toBe(2);
    });

    it('hasPermission returns false for user:create', () => {
      expect(service.hasPermission(PERMISSIONS.userCreate)).toBeFalse();
    });

    it('hasAnyPermission returns true if at least one matches', () => {
      expect(service.hasAnyPermission([PERMISSIONS.userView, PERMISSIONS.userCreate])).toBeTrue();
    });

    it('hasAnyPermission returns false if none match', () => {
      expect(service.hasAnyPermission([PERMISSIONS.userCreate, PERMISSIONS.userDelete])).toBeFalse();
    });

    it('hasAllPermissions returns false when one is missing', () => {
      expect(service.hasAllPermissions([PERMISSIONS.userView, PERMISSIONS.userCreate])).toBeFalse();
    });
  });

  describe('as Manager', () => {
    beforeEach(() => {
      authSpy = makeAuthServiceSpy(ROLES.manager);
      TestBed.configureTestingModule({ providers: [PermissionService, { provide: AuthService, useValue: authSpy }] });
      service = TestBed.inject(PermissionService);
    });

    it('has partner CRUD but no user permissions', () => {
      expect(service.hasPermission(PERMISSIONS.partnerCreate)).toBeTrue();
      expect(service.hasPermission(PERMISSIONS.userView)).toBeFalse();
    });

    it('hasAllPermissions returns true when all present', () => {
      expect(service.hasAllPermissions([PERMISSIONS.partnerView, PERMISSIONS.partnerCreate])).toBeTrue();
    });
  });
});
