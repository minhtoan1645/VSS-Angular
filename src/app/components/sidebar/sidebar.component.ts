import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardSectionItem } from '../../models/dashboard-section-item.model';

interface MainNavItem {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sectionTitle = 'Quản lý';
  @Input() sectionItems: DashboardSectionItem[] = [];

  readonly mainNavItems: MainNavItem[] = [
    { icon: 'assets/images/icons/messages-2.png', label: 'Hội thoại' },
    { icon: 'assets/images/icons/tag-user.png', label: 'Quản lý', route: '/users' },
    { icon: 'assets/images/icons/presention-chart.png', label: 'Phân tích' }
  ];

  constructor(private readonly router: Router) {}

  isMainItemActive(item: MainNavItem): boolean {
    return Boolean(item.route) && this.router.url.startsWith(item.route as string);
  }

  isSectionItemActive(item: DashboardSectionItem): boolean {
    return Boolean(item.route) && this.router.url.startsWith(item.route as string);
  }
}
