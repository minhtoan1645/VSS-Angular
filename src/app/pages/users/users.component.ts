import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PaginationState } from '../../models/pagination.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

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
  readonly pageSizeOptions = [10, 25, 50];
  readonly roleOptions = ['Tất cả', 'Admin', 'Manager', 'Agent'];
  readonly statusOptions = ['Tất cả', 'Đang sử dụng', 'Tạm khóa'];

  readonly filterForm = this.formBuilder.group({
    name: [''],
    email: [''],
    phone: [''],
    department: ['Tất cả'],
    role: ['Tất cả'],
    status: ['Tất cả'],
    joinedYear: ['Tất cả']
  });

  users: User[] = [];
  departmentOptions: string[] = ['Tất cả'];
  joinedYearOptions: string[] = ['Tất cả'];
  totalUsers = 0;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1
  };

  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  private readonly pageSizeSubject = new BehaviorSubject<number>(10);
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.getDepartmentOptions().subscribe((departments) => {
        this.departmentOptions = ['Tất cả', ...departments];
      })
    );

    this.subscriptions.add(
      this.userService.getUsers().subscribe((users) => {
        this.totalUsers = users.length;
        this.joinedYearOptions = ['Tất cả', ...Array.from(new Set(users.map((user) => user.joinedDate.split('/')[2])))];
      })
    );

    this.subscriptions.add(
      this.filterForm.valueChanges.subscribe(() => this.currentPageSubject.next(1))
    );

    const filters$ = this.filterForm.valueChanges.pipe(
      map(() => this.getFilters()),
      startWith(this.getFilters())
    );

    this.subscriptions.add(
      combineLatest([
        this.userService.getUsers(),
        filters$,
        this.currentPageSubject,
        this.pageSizeSubject
      ])
        .pipe(
          map(([users, filters, currentPage, pageSize]) => {
            const filteredUsers = this.applyFilters(users, filters);
            const totalItems = filteredUsers.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const safePage = Math.min(currentPage, totalPages);
            const startIndex = (safePage - 1) * pageSize;

            return {
              items: filteredUsers.slice(startIndex, startIndex + pageSize),
              totalItems,
              totalPages,
              currentPage: safePage,
              pageSize
            };
          })
        )
        .subscribe((result) => {
          this.users = result.items;
          this.pagination = {
            currentPage: result.currentPage,
            pageSize: result.pageSize,
            totalItems: result.totalItems,
            totalPages: result.totalPages
          };
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
      department: rawValue.department ?? 'Tất cả',
      role: rawValue.role ?? 'Tất cả',
      status: rawValue.status ?? 'Tất cả',
      joinedYear: rawValue.joinedYear ?? 'Tất cả'
    };
  }

  private applyFilters(users: User[], filters: UserFilters): User[] {
    return users.filter((user) => {
      const matchesName = !filters.name || user.name.toLowerCase().includes(filters.name);
      const matchesEmail = !filters.email || user.email.toLowerCase().includes(filters.email);
      const matchesPhone = !filters.phone || user.phone.toLowerCase().includes(filters.phone);
      const matchesDepartment = filters.department === 'Tất cả' || user.departments.includes(filters.department);
      const matchesRole = filters.role === 'Tất cả' || user.role === filters.role;
      const matchesStatus = filters.status === 'Tất cả' || user.status === filters.status;
      const matchesYear = filters.joinedYear === 'Tất cả' || user.joinedDate.endsWith(filters.joinedYear);

      return matchesName && matchesEmail && matchesPhone && matchesDepartment && matchesRole && matchesStatus && matchesYear;
    });
  }
}
