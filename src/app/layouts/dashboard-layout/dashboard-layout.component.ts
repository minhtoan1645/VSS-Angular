import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  DASHBOARD_SECTION_ITEMS,
  DEFAULT_DASHBOARD_SECTION_KEY,
  DEFAULT_DASHBOARD_SECTION_TITLE,
  DEFAULT_DASHBOARD_TAB_ICON,
  DEFAULT_DASHBOARD_TAB_TITLE,
  DashboardSectionKey
} from './constants/dashboard.constants';
import { DashboardSectionItem } from './models/dashboard-section-item.model';
import { getDeepestRouteData } from '../../core/utils/route-data.util';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  host: {
    class: 'users-page'
  }
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  tabTitle = DEFAULT_DASHBOARD_TAB_TITLE;
  tabIcon = DEFAULT_DASHBOARD_TAB_ICON;
  sectionTitle = DEFAULT_DASHBOARD_SECTION_TITLE;
  contentClass = '';
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
    const data = getDeepestRouteData(this.activatedRoute);
    const sectionKey: DashboardSectionKey = data.sectionKey === 'partners' ? 'partners' : DEFAULT_DASHBOARD_SECTION_KEY;

    this.tabTitle = typeof data.tabTitle === 'string' ? data.tabTitle : DEFAULT_DASHBOARD_TAB_TITLE;
    this.tabIcon = typeof data.tabIcon === 'string' ? data.tabIcon : DEFAULT_DASHBOARD_TAB_ICON;
    this.sectionTitle = typeof data.sectionTitle === 'string' ? data.sectionTitle : DEFAULT_DASHBOARD_SECTION_TITLE;
    this.contentClass = typeof data.contentClass === 'string' ? data.contentClass : '';
    this.sectionItems = DASHBOARD_SECTION_ITEMS[sectionKey];
  }
}
