import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { PERMISSIONS } from '../../core/constants/permission.constants';
import { PermissionService } from '../../core/services/permission.service';
import { HasPermissionDirective } from './has-permission.directive';

@Component({
  template: `
    <span *appHasPermission="permission" id="target">Visible</span>
  `,
  imports: [HasPermissionDirective]
})
class TestHostComponent {
  permission: string | string[] | null = null;
}

function makePermSpy(hasAny: boolean, hasAll = true): jasmine.SpyObj<PermissionService> {
  const roleSubject = new BehaviorSubject<unknown>(null);
  const spy = jasmine.createSpyObj<PermissionService>('PermissionService', ['hasAnyPermission', 'hasAllPermissions'], {
    permissionsChanged$: roleSubject.asObservable()
  });
  spy.hasAnyPermission.and.returnValue(hasAny);
  spy.hasAllPermissions.and.returnValue(hasAll);
  return spy;
}

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let permSpy: jasmine.SpyObj<PermissionService>;

  function compile(hasAny: boolean) {
    permSpy = makePermSpy(hasAny);
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PermissionService, useValue: permSpy }]
    });
    fixture = TestBed.createComponent(TestHostComponent);
  }

  it('renders element when permission is granted', () => {
    compile(true);
    fixture.componentInstance.permission = PERMISSIONS.userView;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#target')).toBeTruthy();
  });

  it('hides element when permission is denied', () => {
    compile(false);
    fixture.componentInstance.permission = PERMISSIONS.userCreate;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#target')).toBeNull();
  });

  it('renders element when no permission is set (null)', () => {
    compile(false);
    fixture.componentInstance.permission = null;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#target')).toBeTruthy();
  });

  it('re-evaluates when permission input changes', () => {
    compile(false);
    fixture.componentInstance.permission = PERMISSIONS.userCreate;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#target')).toBeNull();

    permSpy.hasAnyPermission.and.returnValue(true);
    fixture.componentInstance.permission = PERMISSIONS.userView;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#target')).toBeTruthy();
  });
});
