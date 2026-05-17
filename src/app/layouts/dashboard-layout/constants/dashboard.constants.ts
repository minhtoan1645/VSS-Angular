import { DashboardSectionItem } from '../models/dashboard-section-item.model';

export interface MainNavItem {
  icon: string;
  label: string;
  route?: string;
  activeRoutes?: string[];
}

export type DashboardSectionKey = 'users' | 'partners';

export const DEFAULT_DASHBOARD_TAB_TITLE = 'Người dùng';
export const DEFAULT_DASHBOARD_SECTION_TITLE = 'Người dùng';
export const DEFAULT_DASHBOARD_TAB_ICON = 'assets/images/icons/tag-user.png';
export const DEFAULT_DASHBOARD_SECTION_KEY: DashboardSectionKey = 'users';

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  { icon: 'assets/images/icons/messages-2.png', label: 'Hội thoại' },
  { icon: 'assets/images/icons/tag-user.png', label: 'Quản lý', route: '/users', activeRoutes: ['/users', '/partners'] },
  { icon: 'assets/images/icons/presention-chart.png', label: 'Phân tích' }
];

export const DASHBOARD_SECTION_ITEMS: Record<DashboardSectionKey, DashboardSectionItem[]> = {
  users: [
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
  ],
  partners: [
    {
      key: 'partners',
      label: 'Danh sách đối tác',
      icon: 'assets/images/icons/tag-user.png',
      route: '/partners'
    },
    {
      key: 'users',
      label: 'Danh sách yêu cầu',
      icon: 'assets/images/icons/edit-2.png'
    },
    {
      key: 'analytics',
      label: 'Phân tích',
      icon: 'assets/images/icons/presention-chart.png'
    }
  ]
};
