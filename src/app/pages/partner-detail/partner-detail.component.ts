import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Partner } from '../../models/partner.model';
import { User } from '../../models/user.model';
import { PartnerService } from '../../services/partner.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss']
})
export class PartnerDetailComponent implements OnInit, OnDestroy {
  partner: Partner | undefined;
  relatedUsers: User[] = [];
  readonly pageSize = 10;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const id = Number(params.get('id'));
            return this.partnerService.getPartnerById(id);
          })
        )
        .subscribe((partner) => {
          this.partner = partner;
        })
    );

    this.subscriptions.add(
      this.userService.getUsers().subscribe((users) => {
        this.relatedUsers = users.slice(0, 3);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/partners']);
  }

  getStatusClass(status: Partner['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  getUserStatusClass(status: User['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  getPackageToneClass(packageName: Partner['packageName']): string {
    if (packageName === 'Trải nghiệm') {
      return 'partner-package-name partner-package-name--trial';
    }

    if (packageName === 'Cơ bản') {
      return 'partner-package-name partner-package-name--basic';
    }

    return 'partner-package-name partner-package-name--advanced';
  }

  trackByUserId(_: number, user: User): number {
    return user.id;
  }
}
