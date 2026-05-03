import { AvatarVariant } from './avatar-variant.type';

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  industries: string[];
  packageName: 'Trải nghiệm' | 'Cơ bản' | 'Nâng cao';
  status: 'Đang sử dụng' | 'Tạm khóa';
  expiryDate: string;
  avatarText: string;
  avatarVariant: AvatarVariant;
}
