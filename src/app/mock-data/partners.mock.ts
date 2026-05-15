import { Partner } from '../models/partner.model';
import { AvatarVariant } from '../models/avatar-variant.type';

const partnerPrefixes = [
  'NCC', 'CT', 'Viet', 'Nova', 'Global', 'Sun', 'Blue', 'Green', 'Mega', 'Asia'
];

const partnerSuffixes = [
  'Plus', 'Group', 'Retail', 'Commerce', 'Solutions', 'Media', 'Travel', 'Foods', 'Tech', 'Service'
];

const industriesPool = [
  'Sản phẩm điện tử',
  'Gia dụng',
  'Kinh doanh online',
  'Bán lẻ',
  'Dịch vụ',
  'Bất động sản',
  'Tài chính',
  'Du lịch'
];

const packages: Array<Partner['packageName']> = ['Trải nghiệm', 'Cơ bản', 'Nâng cao'];
const statuses: Array<Partner['status']> = ['Đang sử dụng', 'Tạm khóa'];
const avatarVariants: AvatarVariant[] = ['purple', 'brown', 'pink', 'green', 'red'];
const addressPool = [
  'Số 24 Phố Nguyễn Trãi',
  'Số 18 Đường Láng',
  'Số 126 Phố Chùa Bộc',
  'Số 32 Phố Hoàng Cầu',
  'Số 75 Phố Thái Hà',
  'Số 41 Phố Trần Duy Hưng',
  'Số 09 Phố Duy Tân',
  'Số 58 Phố Nguyễn Chí Thanh',
  'Số 14 Phố Lê Văn Lương',
  'Số 62 Phố Hoàng Đạo Thúy'
];

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function formatDate(index: number): string {
  const day = 1 + (index % 28);
  const month = 1 + ((index + 1) % 12);
  const year = 2024 + (index % 3);

  return `${pad(day)}/${pad(month)}/${year}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export const MOCK_PARTNERS: Partner[] = Array.from({ length: 100 }, (_, index) => {
  const name = `${partnerPrefixes[index % partnerPrefixes.length]}${partnerSuffixes[index % partnerSuffixes.length]} ${index + 1}`;
  const industries = [
    industriesPool[index % industriesPool.length],
    industriesPool[(index + 3) % industriesPool.length],
    industriesPool[(index + 5) % industriesPool.length]
  ].filter((industry, industryIndex, values) => values.indexOf(industry) === industryIndex);

  return {
    id: index + 1,
    name,
    email: `partner${index + 1}@gmail.com`,
    phone: `09${pad((index * 5) % 100)} ${pad((index * 17) % 1000).padStart(3, '0')} ${pad((index * 23) % 10000).padStart(4, '0')}`,
    address: addressPool[index % addressPool.length],
    industries,
    packageName: packages[index % packages.length],
    status: statuses[index % statuses.length],
    expiryDate: formatDate(index),
    avatarText: getInitials(name),
    avatarVariant: avatarVariants[index % avatarVariants.length]
  };
});
