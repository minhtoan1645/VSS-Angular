import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  users: User[] = [];
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

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
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
}
