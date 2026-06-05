import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const fakeRoute = {} as ActivatedRouteSnapshot;
  const fakeState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({ toString: () => '/login' } as never);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  function runGuard() {
    return TestBed.runInInjectionContext(() => authGuard(fakeRoute, fakeState));
  }

  it('returns true when logged in', () => {
    authSpy.isLoggedIn.and.returnValue(true);
    expect(runGuard()).toBeTrue();
  });

  it('redirects to /login when not logged in', () => {
    authSpy.isLoggedIn.and.returnValue(false);
    const result = runGuard();
    expect(result).toBeTruthy();
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
