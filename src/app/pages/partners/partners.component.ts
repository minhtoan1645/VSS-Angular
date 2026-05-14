import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ALL_OPTION_LABEL, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../constants/app.constants';
import { PaginationState } from '../../models/pagination.model';
import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';
import { buildOptions, buildYearOptions, paginateItems } from '../../utils/table.util';

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
  readonly pageSizeOptions = [...PAGE_SIZE_OPTIONS];
  readonly packageOptions = buildOptions(['Trải nghiệm', 'Cơ bản', 'Nâng cao']);
  readonly statusOptions = buildOptions(['Đang sử dụng', 'Tạm khóa']);

  readonly filterForm = this.formBuilder.group({
    name: [''],
    email: [''],
    phone: [''],
    industry: [ALL_OPTION_LABEL],
    packageName: [ALL_OPTION_LABEL],
    status: [ALL_OPTION_LABEL],
    expiryYear: [ALL_OPTION_LABEL]
  });

  partners: Partner[] = [];
  industryOptions: string[] = [ALL_OPTION_LABEL];
  expiryYearOptions: string[] = [ALL_OPTION_LABEL];
  totalPartnerCount = 0;
  pagination: PaginationState = {
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1
  };

  private readonly partners$ = this.partnerService.getPartners();
  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  private readonly pageSizeSubject = new BehaviorSubject<number>(DEFAULT_PAGE_SIZE);
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly partnerService: PartnerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.partnerService.getIndustryOptions().subscribe((industries) => {
        this.industryOptions = buildOptions(industries);
      })
    );

    this.subscriptions.add(
      this.partners$.subscribe((partners) => {
        this.totalPartnerCount = partners.length;
        this.expiryYearOptions = buildYearOptions(partners.map((partner) => partner.expiryDate));
      })
    );

    this.subscriptions.add(this.filterForm.valueChanges.subscribe(() => this.currentPageSubject.next(1)));

    const filters$ = this.filterForm.valueChanges.pipe(
      map(() => this.getFilters()),
      startWith(this.getFilters())
    );

    this.subscriptions.add(
      combineLatest([this.partners$, filters$, this.currentPageSubject, this.pageSizeSubject])
        .pipe(
          map(([partners, filters, currentPage, pageSize]) => {
            const filteredPartners = this.applyFilters(partners, filters);
            return paginateItems(filteredPartners, currentPage, pageSize);
          })
        )
        .subscribe((result) => {
          this.partners = result.items;
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

  goToAddPartner(): void {
    this.router.navigate(['/partners/add']);
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
      industry: rawValue.industry ?? ALL_OPTION_LABEL,
      packageName: rawValue.packageName ?? ALL_OPTION_LABEL,
      status: rawValue.status ?? ALL_OPTION_LABEL,
      expiryYear: rawValue.expiryYear ?? ALL_OPTION_LABEL
    };
  }

  private applyFilters(partners: Partner[], filters: PartnerFilters): Partner[] {
    return partners.filter((partner) => {
      const matchesName = !filters.name || partner.name.toLowerCase().includes(filters.name);
      const matchesEmail = !filters.email || partner.email.toLowerCase().includes(filters.email);
      const matchesPhone = !filters.phone || partner.phone.toLowerCase().includes(filters.phone);
      const matchesIndustry = filters.industry === ALL_OPTION_LABEL || partner.industries.includes(filters.industry);
      const matchesPackage = filters.packageName === ALL_OPTION_LABEL || partner.packageName === filters.packageName;
      const matchesStatus = filters.status === ALL_OPTION_LABEL || partner.status === filters.status;
      const matchesYear = filters.expiryYear === ALL_OPTION_LABEL || partner.expiryDate.endsWith(filters.expiryYear);

      return matchesName && matchesEmail && matchesPhone && matchesIndustry && matchesPackage && matchesStatus && matchesYear;
    });
  }
}
