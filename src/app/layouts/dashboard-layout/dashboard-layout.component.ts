import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DashboardSectionItem } from '../../models/dashboard-section-item.model';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  tabTitle = 'Người dùng';
  tabIcon = 'assets/images/icons/tag-user.png';
  sectionTitle = 'Người dùng';
  sectionItems: DashboardSectionItem[] = [];

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.syncRouteData();
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.syncRouteData())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private syncRouteData(): void {
    let currentRoute = this.activatedRoute;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const data: Data = currentRoute.snapshot.data;
    const sectionKey = typeof data.sectionKey === 'string' ? data.sectionKey : 'users';

    this.tabTitle = typeof data.tabTitle === 'string' ? data.tabTitle : 'Người dùng';
    this.tabIcon = typeof data.tabIcon === 'string' ? data.tabIcon : 'assets/images/icons/tag-user.png';
    this.sectionTitle = typeof data.sectionTitle === 'string' ? data.sectionTitle : 'Người dùng';
    this.sectionItems = this.buildSectionItems(sectionKey);
  }

  private buildSectionItems(sectionKey: string): DashboardSectionItem[] {
    if (sectionKey === 'partners') {
      return [
        {
          key: 'partners',
          label: 'Danh sách đối tác',
          icon: 'assets/images/icons/tag-user.png',
          route: '/partners'
        },
        {
          key: 'users',
          label: 'Danh sách người dùng',
          icon: 'assets/images/icons/edit-2.png',
          route: '/users'
        },
        {
          key: 'analytics',
          label: 'Phân tích',
          icon: 'assets/images/icons/presention-chart.png'
        }
      ];
    }

    return [
      {
        key: 'users',
        label: 'Danh sách người dùng',
        icon: 'assets/images/icons/tag-user.png',
        route: '/users'
      },
      {
        key: 'partners',
        label: 'Danh sách đối tác',
        icon: 'assets/images/icons/edit-2.png',
        route: '/partners'
      },
      {
        key: 'analytics',
        label: 'Phân tích',
        icon: 'assets/images/icons/presention-chart.png'
      }
    ];
  }
}
