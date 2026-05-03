import { User } from '../models/user.model';
import { AvatarVariant } from '../models/avatar-variant.type';

const firstNames = [
  'An', 'Bình', 'Chi', 'Dương', 'Giang', 'Hà', 'Hải', 'Hương', 'Khánh', 'Lan',
  'Linh', 'Long', 'Mai', 'Minh', 'Nam', 'Ngọc', 'Phúc', 'Quân', 'Trang', 'Vy'
];

const lastNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Phan', 'Đặng', 'Bùi', 'Đỗ'
];

const departmentsPool = [
  'CSKH', 'Kinh doanh', 'Marketing', 'Vận hành', 'Phát triển sản phẩm', 'Phân tích dữ liệu'
];

const roles: Array<User['role']> = ['Admin', 'Manager', 'Agent'];
const statuses: Array<User['status']> = ['Đang sử dụng', 'Tạm khóa'];
const avatarVariants: AvatarVariant[] = ['purple', 'brown', 'pink', 'green', 'red'];

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function formatDate(index: number): string {
  const day = 1 + (index % 28);
  const month = 1 + (index % 12);
  const year = 2023 + (index % 3);

  return `${pad(day)}/${pad(month)}/${year}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export const MOCK_USERS: User[] = Array.from({ length: 100 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const suffix = index >= firstNames.length ? ` ${index + 1}` : '';
  const name = `${lastName} ${firstName}${suffix}`;
  const departments = [
    departmentsPool[index % departmentsPool.length],
    departmentsPool[(index + 2) % departmentsPool.length]
  ].filter((department, departmentIndex, values) => values.indexOf(department) === departmentIndex);

  return {
    id: index + 1,
    name,
    email: `user${index + 1}@vsschat.vn`,
    phone: `09${pad((index * 7) % 100)} ${pad((index * 13) % 1000).padStart(3, '0')} ${pad((index * 29) % 10000).padStart(4, '0')}`,
    departments,
    role: roles[index % roles.length],
    status: statuses[index % statuses.length],
    joinedDate: formatDate(index),
    avatarText: getInitials(name),
    avatarVariant: avatarVariants[index % avatarVariants.length]
  };
});
