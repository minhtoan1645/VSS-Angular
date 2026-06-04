# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code (claude.ai/code) khi làm việc với source code trong repository này.

## Lệnh thường dùng

```bash
npm start          # Khởi động dev server tại http://localhost:4200/
npm run build      # Build production → dist/vss-angular/
npm run watch      # Build ở chế độ watch (tự động rebuild khi có thay đổi)
npm test           # Chạy unit test (Karma + Jasmine)
```

## Tổng quan kiến trúc

Ứng dụng Angular 12 với kiến trúc module theo tính năng (feature-based), lazy loading, phân quyền theo vai trò (RBAC), và tầng mock data được thiết kế để dễ dàng thay thế bằng backend thực.

### Routing & Layout

Hai layout gốc phân tách trang xác thực và ứng dụng chính:

- **Auth layout** — các trang chưa đăng nhập (`/login`, `/register`, `/forgot-password`, `/verify-code`, `/reset-password`)
- **Dashboard layout** — được bảo vệ bởi `AuthGuard`; chứa các feature module lazy-loaded được kiểm soát bởi `PermissionGuard`

Routes được khai báo tại [src/app/app-routing.module.ts](src/app/app-routing.module.ts).

### Cấu trúc module

```
src/app/
├── core/           # Guards, interceptors, services, models, constants (PERMISSIONS, ROLES)
├── shared/         # Component dùng chung (Button, Card, Input, Pagination), directive HasPermission
├── layouts/        # auth-layout, dashboard-layout (header + sidebar)
└── modules/        # Feature modules (lazy-loaded)
    ├── auth/       # Trang đăng nhập, đăng ký, quên mật khẩu
    ├── user/       # Danh sách và chi tiết người dùng
    └── partner/    # Danh sách, chi tiết và thêm mới đối tác (stepper)
```

Mỗi feature module (`user/`, `partner/`) tuân theo cấu trúc nội bộ thống nhất:

```
feature/
├── api/        # *ApiService — lớp trừu tượng gọi backend
├── mock/       # *MockService + hằng số mock data
├── models/     # Interfaces / kiểu dữ liệu
├── pages/      # Smart component (trang)
├── services/   # *Service — điều phối business logic
├── feature.module.ts
└── feature-routing.module.ts
```

### Luồng dữ liệu

```
Page Component → *Service → *ApiService → *MockService (hiện tại) / HttpClient (tương lai)
```

Khi kết nối backend thực, chỉ cần thay đổi tầng `*ApiService` — đổi `return of(this.mockService.getX())` thành `return this.http.get('/api/x')`. Component và Service không cần sửa.

### Xác thực & Phân quyền

- `AuthService` lưu role hiện tại dưới dạng `BehaviorSubject`; `TokenStorageService` lưu token và user vào `localStorage` (`vss_auth_token`, `vss_auth_user`)
- `AuthInterceptor` tự động thêm `Authorization: Bearer <token>` vào mọi HTTP request
- **3 vai trò**: Admin (toàn quyền), Agent (chỉ xem: user + partner), Manager (CRUD partner, không có quyền user)
- **8 quyền**: `user:view/create/update/delete`, `partner:view/create/update/delete`
- `PermissionGuard` đọc quyền yêu cầu từ `data.permission` của route
- Directive `*appHasPermission="'user:create'"` ẩn/hiện phần tử dựa theo quyền

**Tài khoản test** (mock auth, mật khẩu `123456`):
- `admin@gmail.com` — Admin
- `agent@gmail.com` — Agent
- `manager@gmail.com` — Manager

### Styling

SCSS toàn cục theo mô hình 7-1 tại [src/styles/](src/styles/):
- `abstracts/` — biến, breakpoints, mixins
- `base/` — reset, typography, global
- `components/` — button, input, card, pagination, ...
- `layout/` — sidebar, header, auth/dashboard layout
- `pages/` — style riêng của từng trang

Style component được đóng gói theo cơ chế view encapsulation mặc định của Angular.

### Quản lý trạng thái

Không dùng NgRx hay thư viện state bên ngoài. Trạng thái được lưu trong service (`BehaviorSubject`) và `localStorage`. Dữ liệu bất đồng bộ truyền qua Observable; template dùng `async` pipe khi có thể.

### TypeScript

Chế độ strict được bật (`strict: true`, `strictInjectionParameters`, `strictTemplates`). Mọi code mới phải vượt qua kiểm tra strict.
