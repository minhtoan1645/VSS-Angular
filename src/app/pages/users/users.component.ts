import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ALL_OPTION_LABEL, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants/app.constants';
import { PaginationState } from '../../models/pagination.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { buildOptions, buildYearOptions, paginateItems } from '../../utils/table.util';

interface UserFilters {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  joinedYear: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [...PAGE_SIZE_OPTIONS];
  readonly roleOptions = buildOptions(['Admin', 'Manager', 'Agent']);
  readonly statusOptions = buildOptions(['Đang sử dụng', 'Tạm khóa']);

  readonly filterForm = this.formBuilder.group({
    name: [''],
    email: [''],
    phone: [''],
    department: [ALL_OPTION_LABEL],
    role: [ALL_OPTION_LABEL],
    status: [ALL_OPTION_LABEL],
    joinedYear: [ALL_OPTION_LABEL]
  });

  readonly editUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  users: User[] = [];
  editingUser: User | null = null;
  deletingUser: User | null = null;
  departmentOptions: string[] = [ALL_OPTION_LABEL];
  joinedYearOptions: string[] = [ALL_OPTION_LABEL];
  totalUserCount = 0;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1
  };

  private readonly users$ = this.userService.getUsers();
  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  private readonly pageSizeSubject = new BehaviorSubject<number>(DEFAULT_PAGE_SIZE);
  private readonly subscriptions = new Subscription();
  private readonly deletedUserIds = new Set<number>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.getDepartmentOptions().subscribe((departments) => {
        this.departmentOptions = buildOptions(departments);
      })
    );

    this.subscriptions.add(
      this.users$.subscribe((users) => {
        this.totalUserCount = users.length;
        this.joinedYearOptions = buildYearOptions(users.map((user) => user.joinedDate));
      })
    );

    this.subscriptions.add(this.filterForm.valueChanges.subscribe(() => this.currentPageSubject.next(1)));

    const filters$ = this.filterForm.valueChanges.pipe(
      map(() => this.getFilters()),
      startWith(this.getFilters())
    );

    this.subscriptions.add(
      combineLatest([this.users$, filters$, this.currentPageSubject, this.pageSizeSubject])
        .pipe(
          map(([users, filters, currentPage, pageSize]) => {
            const filteredUsers = this.applyFilters(users, filters);
            return paginateItems(filteredUsers, currentPage, pageSize);
          })
        )
        .subscribe((result) => {
          this.users = result.items;
          this.pagination = result.pagination;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageChange(page: number): void {
    this.currentPageSubject.next(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
    this.currentPageSubject.next(1);
  }

  goToUserDetail(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  openEditUserModal(user: User): void {
    this.editingUser = user;
    this.editUserForm.setValue({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  }

  closeEditUserModal(): void {
    this.editingUser = null;
    this.editUserForm.reset({
      name: '',
      email: '',
      phone: ''
    });
  }

  saveUserEdit(): void {
    if (!this.editingUser) {
      return;
    }

    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const value = this.editUserForm.getRawValue();
    this.editingUser.name = value.name?.trim() ?? this.editingUser.name;
    this.editingUser.email = value.email?.trim() ?? this.editingUser.email;
    this.editingUser.phone = value.phone?.trim() ?? this.editingUser.phone;
    this.editingUser.avatarText = this.getAvatarText(this.editingUser.name);
    this.users = [...this.users];
    this.closeEditUserModal();
  }

  openDeleteUserModal(user: User): void {
    this.deletingUser = user;
  }

  closeDeleteUserModal(): void {
    this.deletingUser = null;
  }

  confirmDeleteUser(): void {
    if (!this.deletingUser) {
      return;
    }

    this.deletedUserIds.add(this.deletingUser.id);

    if (this.editingUser?.id === this.deletingUser.id) {
      this.closeEditUserModal();
    }

    this.totalUserCount = Math.max(this.totalUserCount - 1, 0);
    this.closeDeleteUserModal();
    this.currentPageSubject.next(this.currentPageSubject.value);
  }

  getVisibleDepartments(user: User): string[] {
    return user.departments.slice(0, 2);
  }

  getRemainingDepartments(user: User): number {
    return Math.max(user.departments.length - 2, 0);
  }

  getRoleBadgeClass(role: User['role']): string {
    if (role === 'Admin') {
      return 'badge badge--soft-danger';
    }

    if (role === 'Manager') {
      return 'badge badge--soft-info';
    }

    return 'badge badge--soft-success';
  }

  getStatusClass(status: User['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  trackByUserId(_: number, user: User): number {
    return user.id;
  }

  private getFilters(): UserFilters {
    const rawValue = this.filterForm.getRawValue();

    return {
      name: rawValue.name?.trim().toLowerCase() ?? '',
      email: rawValue.email?.trim().toLowerCase() ?? '',
      phone: rawValue.phone?.trim().toLowerCase() ?? '',
      department: rawValue.department ?? ALL_OPTION_LABEL,
      role: rawValue.role ?? ALL_OPTION_LABEL,
      status: rawValue.status ?? ALL_OPTION_LABEL,
      joinedYear: rawValue.joinedYear ?? ALL_OPTION_LABEL
    };
  }

  private applyFilters(users: User[], filters: UserFilters): User[] {
    return users.filter((user) => {
      if (this.deletedUserIds.has(user.id)) {
        return false;
      }

      const matchesName = !filters.name || user.name.toLowerCase().includes(filters.name);
      const matchesEmail = !filters.email || user.email.toLowerCase().includes(filters.email);
      const matchesPhone = !filters.phone || user.phone.toLowerCase().includes(filters.phone);
      const matchesDepartment = filters.department === ALL_OPTION_LABEL || user.departments.includes(filters.department);
      const matchesRole = filters.role === ALL_OPTION_LABEL || user.role === filters.role;
      const matchesStatus = filters.status === ALL_OPTION_LABEL || user.status === filters.status;
      const matchesYear = filters.joinedYear === ALL_OPTION_LABEL || user.joinedDate.endsWith(filters.joinedYear);

      return matchesName && matchesEmail && matchesPhone && matchesDepartment && matchesRole && matchesStatus && matchesYear;
    });
  }

  private getAvatarText(name: string): string {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0) ?? '';
    const last = words.length > 1 ? words[words.length - 1].charAt(0) : words[0]?.charAt(1) ?? '';
    return `${first}${last}`.toUpperCase();
  }
}
