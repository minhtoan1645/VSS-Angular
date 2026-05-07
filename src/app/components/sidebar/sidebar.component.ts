import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MAIN_NAV_ITEMS, MainNavItem } from '../../constants/dashboard.constants';
import { DashboardSectionItem } from '../../models/dashboard-section-item.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sectionTitle = 'Quản lý';
  @Input() sectionItems: DashboardSectionItem[] = [];

  readonly mainNavItems: MainNavItem[] = MAIN_NAV_ITEMS;

  constructor(private readonly router: Router) {}

  isMainItemActive(item: MainNavItem): boolean {
    return Boolean(item.route) && this.router.url.startsWith(item.route as string);
  }

  isSectionItemActive(item: DashboardSectionItem): boolean {
    return Boolean(item.route) && this.router.url.startsWith(item.route as string);
  }
}
