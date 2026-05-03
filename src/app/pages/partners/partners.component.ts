import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PaginationState } from '../../models/pagination.model';
import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';

interface PartnerFilters {
  name: string;
  email: string;
  phone: string;
  industry: string;
  packageName: string;
  status: string;
  expiryYear: string;
}

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit, OnDestroy {
  readonly pageSizeOptions = [10, 25, 50];
  readonly packageOptions = ['Tất cả', 'Trải nghiệm', 'Cơ bản', 'Nâng cao'];
  readonly statusOptions = ['Tất cả', 'Đang sử dụng', 'Tạm khóa'];

  readonly filterForm = this.formBuilder.group({
    name: [''],
    email: [''],
    phone: [''],
    industry: ['Tất cả'],
    packageName: ['Tất cả'],
    status: ['Tất cả'],
    expiryYear: ['Tất cả']
  });

  partners: Partner[] = [];
  industryOptions: string[] = ['Tất cả'];
  expiryYearOptions: string[] = ['Tất cả'];
  totalPartners = 0;
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
    private readonly partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.partnerService.getIndustryOptions().subscribe((industries) => {
        this.industryOptions = ['Tất cả', ...industries];
      })
    );

    this.subscriptions.add(
      this.partnerService.getPartners().subscribe((partners) => {
        this.totalPartners = partners.length;
        this.expiryYearOptions = ['Tất cả', ...Array.from(new Set(partners.map((partner) => partner.expiryDate.split('/')[2])))];
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
        this.partnerService.getPartners(),
        filters$,
        this.currentPageSubject,
        this.pageSizeSubject
      ])
        .pipe(
          map(([partners, filters, currentPage, pageSize]) => {
            const filteredPartners = this.applyFilters(partners, filters);
            const totalItems = filteredPartners.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const safePage = Math.min(currentPage, totalPages);
            const startIndex = (safePage - 1) * pageSize;

            return {
              items: filteredPartners.slice(startIndex, startIndex + pageSize),
              totalItems,
              totalPages,
              currentPage: safePage,
              pageSize
            };
          })
        )
        .subscribe((result) => {
          this.partners = result.items;
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

  getVisibleIndustries(partner: Partner): string[] {
    return partner.industries.slice(0, 2);
  }

  getRemainingIndustries(partner: Partner): number {
    return Math.max(partner.industries.length - 2, 0);
  }

  getPackageBadgeClass(packageName: Partner['packageName']): string {
    if (packageName === 'Trải nghiệm') {
      return 'badge badge--soft-success';
    }

    if (packageName === 'Cơ bản') {
      return 'badge badge--soft-info';
    }

    return 'badge badge--soft-danger';
  }

  getStatusClass(status: Partner['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  trackByPartnerId(_: number, partner: Partner): number {
    return partner.id;
  }

  private getFilters(): PartnerFilters {
    const rawValue = this.filterForm.getRawValue();

    return {
      name: rawValue.name?.trim().toLowerCase() ?? '',
      email: rawValue.email?.trim().toLowerCase() ?? '',
      phone: rawValue.phone?.trim().toLowerCase() ?? '',
      industry: rawValue.industry ?? 'Tất cả',
      packageName: rawValue.packageName ?? 'Tất cả',
      status: rawValue.status ?? 'Tất cả',
      expiryYear: rawValue.expiryYear ?? 'Tất cả'
    };
  }

  private applyFilters(partners: Partner[], filters: PartnerFilters): Partner[] {
    return partners.filter((partner) => {
      const matchesName = !filters.name || partner.name.toLowerCase().includes(filters.name);
      const matchesEmail = !filters.email || partner.email.toLowerCase().includes(filters.email);
      const matchesPhone = !filters.phone || partner.phone.toLowerCase().includes(filters.phone);
      const matchesIndustry = filters.industry === 'Tất cả' || partner.industries.includes(filters.industry);
      const matchesPackage = filters.packageName === 'Tất cả' || partner.packageName === filters.packageName;
      const matchesStatus = filters.status === 'Tất cả' || partner.status === filters.status;
      const matchesYear = filters.expiryYear === 'Tất cả' || partner.expiryDate.endsWith(filters.expiryYear);

      return matchesName && matchesEmail && matchesPhone && matchesIndustry && matchesPackage && matchesStatus && matchesYear;
    });
  }
}
