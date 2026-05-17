import { Permission, PermissionMode } from '../../../core/models/permission.model';

export interface DashboardSectionItem {
  label: string;
  icon: string;
  route?: string;
  key: string;
  disabled?: boolean;
  permission?: Permission | Permission[];
  permissionMode?: PermissionMode;
}
