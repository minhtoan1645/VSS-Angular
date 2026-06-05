import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../../core/services/permission.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserListComponent } from './user-list.component';

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', phone: '0900000001', departments: ['IT'], role: 'Admin', status: 'Đang sử dụng', joinedDate: '01/01/2023', avatarText: 'A', avatarVariant: 'purple' },
  { id: 2, name: 'Bob',   email: 'bob@test.com',   phone: '0900000002', departments: ['HR'], role: 'Agent', status: 'Tạm khóa',     joinedDate: '15/06/2022', avatarText: 'B', avatarVariant: 'green' }
];

function makeUserServiceSpy() {
  const loadingSignal = signal(false);
  const errorSignal = signal<string | null>(null);

  const spy = jasmine.createSpyObj<UserService>('UserService', [
    'getUsers', 'getDepartmentOptions', 'updateUser', 'deleteUser'
  ], {
    isLoading: loadingSignal.asReadonly(),
    loadError: errorSignal.asReadonly()
  });

  spy.getUsers.and.returnValue(of([...MOCK_USERS]));
  spy.getDepartmentOptions.and.returnValue(of(['IT', 'HR']));
  spy.updateUser.and.callFake((_id, patch) => of({ ...MOCK_USERS[0], ...patch }));
  spy.deleteUser.and.returnValue(of(undefined));

  return { spy, loadingSignal, errorSignal };
}

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const { spy } = makeUserServiceSpy();
    userServiceSpy = spy;
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    const permSpy = jasmine.createSpyObj<PermissionService>('PermissionService', ['hasAnyPermission', 'hasAllPermissions'], {
      permissionsChanged$: of(null)
    });
    permSpy.hasAnyPermission.and.returnValue(true);
    permSpy.hasAllPermissions.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PermissionService, useValue: permSpy }
      ]
    })
    .overrideDirective(HasPermissionDirective, {
      set: { providers: [{ provide: PermissionService, useValue: permSpy }] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders a row for each user', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(MOCK_USERS.length);
  });

  it('displays user names in the table', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Alice');
    expect(text).toContain('Bob');
  });

  it('opens edit modal when openEditUserModal is called', () => {
    component.openEditUserModal(MOCK_USERS[0]);
    fixture.detectChanges();
    expect(component.editingUser).toBe(MOCK_USERS[0]);
    const modal = fixture.nativeElement.querySelector('[aria-labelledby="users-edit-user-title"]');
    expect(modal).toBeTruthy();
  });

  it('closes edit modal on closeEditUserModal', () => {
    component.openEditUserModal(MOCK_USERS[0]);
    fixture.detectChanges();
    component.closeEditUserModal();
    fixture.detectChanges();
    expect(component.editingUser).toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-labelledby="users-edit-user-title"]')).toBeNull();
  });

  it('calls userService.updateUser on saveUserEdit', fakeAsync(() => {
    component.openEditUserModal(MOCK_USERS[0]);
    component.editUserForm.setValue({ name: 'Alice Updated', email: 'alice@test.com', phone: '0900000001' });
    component.saveUserEdit();
    tick();
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(1, jasmine.objectContaining({ name: 'Alice Updated' }));
    expect(component.editingUser).toBeNull();
  }));

  it('opens delete modal when openDeleteUserModal is called', () => {
    component.openDeleteUserModal(MOCK_USERS[1]);
    fixture.detectChanges();
    expect(component.deletingUser).toBe(MOCK_USERS[1]);
  });

  it('calls userService.deleteUser on confirmDeleteUser', fakeAsync(() => {
    component.openDeleteUserModal(MOCK_USERS[1]);
    component.confirmDeleteUser();
    tick();
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(2);
    expect(component.deletingUser).toBeNull();
  }));

  it('navigates to detail on goToDetail', () => {
    component.goToDetail(MOCK_USERS[0]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users', 1]);
  });

  it('does not show error banner when loadError is null (initial state)', () => {
    expect(component.loadError()).toBeNull();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.data-error')).toBeNull();
  });

  it('resets pagination to page 1 when filter changes', fakeAsync(() => {
    component['currentPageSubject'].next(3);
    component.filterForm.patchValue({ name: 'Alice' });
    tick();
    expect(component['currentPageSubject'].value).toBe(1);
  }));
});
