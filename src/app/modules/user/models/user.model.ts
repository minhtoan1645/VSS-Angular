import { AvatarVariant } from '../../../shared/models/avatar-variant.type';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  departments: string[];
  role: 'Admin' | 'Manager' | 'Agent';
  status: 'Đang sử dụng' | 'Tạm khóa';
  joinedDate: string;
  avatarText: string;
  avatarVariant: AvatarVariant;
}
