# VSS Chat Platform Angular 12

Đây là project Angular 12 theo hướng feature-based architecture, đã được chuẩn hóa để dễ mở rộng và sẵn sàng nối backend thật sau này.

## Mục tiêu kiến trúc

- Tách rõ `core`, `shared`, `layouts`, `modules`
- Tách riêng `api layer` và `mock layer`
- Giữ service UI không phụ thuộc trực tiếp vào mock data
- Chuẩn bị sẵn cho backend thật bằng `HttpClient`, interceptor, guard, permission và model tách lớp

## Cách chạy

```bash
npm install
npm start
```

Mở `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Cấu trúc thư mục

```text
src/
  app/
    core/
      constants/
      guards/
      interceptors/
      models/
      services/
      utils/
    shared/
      components/
      directives/
      models/
      utils/
      shared.module.ts
    layouts/
      auth-layout/
      dashboard-layout/
        components/
        constants/
        models/
    modules/
      auth/
        pages/
      user/
        api/
        mock/
        models/
        pages/
        services/
      partner/
        api/
        mock/
        models/
        pages/
        services/
  assets/
  styles/
    abstracts/
    base/
    components/
    layout/
    pages/
```

## Quy ước naming

- `*.component.ts/html/scss` cho UI component
- `*.service.ts` cho service điều phối logic
- `*.api.service.ts` cho lớp gọi backend/API
- `*.mock.service.ts` cho lớp trả mock data trong giai đoạn dev
- `*.mock.ts` cho dữ liệu giả lập
- `*.model.ts` cho interface/type của feature

## Luồng dữ liệu đề xuất

`component.html` → `component.ts` → `service.ts` → `api.service.ts` → backend thật

Trong giai đoạn hiện tại:

`component.html` → `component.ts` → `service.ts` → `api.service.ts` → `mock.service.ts` → mock data

Khi có backend thật, chỉ cần thay phần trong `api.service.ts` từ `mock service` sang `HttpClient`.

## Tài khoản test

Dùng các tài khoản sau để test đăng nhập:

- `admin@gmail.com` / `123456`
- `agent@gmail.com` / `123456`
- `manager@gmail.com` / `123456`

Vai trò:

- `Admin`: toàn quyền user + partner
- `Agent`: chỉ xem user và partner
- `Manager`: toàn quyền partner, không xem user

## Các route chính

- `/login`
- `/register`
- `/forgot-password`
- `/verify-code`
- `/reset-password`
- `/users`
- `/users/:id`
- `/partners`
- `/partners/add`
- `/partners/:id`
- `''` chuyển hướng về `/login`

## Shared UI

Các component dùng chung nằm trong `src/app/shared/components`:

- `ButtonComponent`
- `CardComponent`
- `InputComponent`
- `PaginationComponent`

Các directive dùng chung cũng đặt ở `shared`.

## Core

`core` chứa các phần nền tảng dùng toàn app:

- `AuthService`
- `TokenStorageService`
- `PermissionService`
- `AuthGuard`
- `PermissionGuard`
- `AuthInterceptor`
- constants và models dùng chung cho auth/permission

## Data ownership

- Mock data của `user` và `partner` nằm trong `modules/*/mock`
- API abstraction nằm trong `modules/*/api`
- Model của từng feature nằm trong `modules/*/models`
- Service orchestration nằm trong `modules/*/services`

## Ghi chú phát triển

Khi gắn backend thật, ưu tiên chỉ thay implementation trong `api` layer để hạn chế ảnh hưởng tới UI và routing.
