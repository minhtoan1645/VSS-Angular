import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { permissionGuard } from './permission.guard';
import { PERMISSIONS } from '../constants/permission.constants';
import { PermissionService } from '../services/permission.service';

function makeRoute(data: Record<string, unknown>): ActivatedRouteSnapshot {
  return { data } as unknown as ActivatedRouteSnapshot;
}

describe('permissionGuard', () => {
  let permSpy: jasmine.SpyObj<PermissionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const fakeState = {} as RouterStateSnapshot;

  beforeEach(() => {
    permSpy = jasmine.createSpyObj<PermissionService>('PermissionService', ['hasAnyPermission', 'hasAllPermissions']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({ toString: () => '/forbidden' } as never);

    TestBed.configureTestingModule({
      providers: [
        { provide: PermissionService, useValue: permSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  function runGuard(route: ActivatedRouteSnapshot) {
    return TestBed.runInInjectionContext(() => permissionGuard(route, fakeState));
  }

  it('returns true when no permission required', () => {
    const route = makeRoute({});
    expect(runGuard(route)).toBeTrue();
  });

  it('returns true when hasAnyPermission passes (default mode)', () => {
    permSpy.hasAnyPermission.and.returnValue(true);
    const route = makeRoute({ permission: PERMISSIONS.userView });
    expect(runGuard(route)).toBeTrue();
  });

  it('redirects to /forbidden when permission denied', () => {
    permSpy.hasAnyPermission.and.returnValue(false);
    const route = makeRoute({ permission: PERMISSIONS.userView });
    const result = runGuard(route);
    expect(result).toBeTruthy();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });

  it('uses hasAllPermissions when mode is "all"', () => {
    permSpy.hasAllPermissions.and.returnValue(true);
    const route = makeRoute({
      permission: [PERMISSIONS.userView, PERMISSIONS.userCreate],
      permissionMode: 'all'
    });
    const result = runGuard(route);
    expect(permSpy.hasAllPermissions).toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('handles array of permissions with default mode "any"', () => {
    permSpy.hasAnyPermission.and.returnValue(false);
    const route = makeRoute({ permission: [PERMISSIONS.userCreate, PERMISSIONS.userDelete] });
    runGuard(route);
    expect(permSpy.hasAnyPermission).toHaveBeenCalledWith([PERMISSIONS.userCreate, PERMISSIONS.userDelete]);
  });
});
