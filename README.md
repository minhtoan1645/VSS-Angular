# VSS Chat Platform Angular 12

Project này là bản convert từ source static HTML/SCSS/JS sang Angular 12, giữ lại giao diện cũ tối đa và tổ chức lại theo `layout -> pages -> components -> services -> models -> mock-data`.

## Cách chạy project

```bash
npm install
ng serve
```

Mở `http://localhost:4200/`.

## Trạng thái đã kiểm tra

- `ng build --configuration development`: thành công
- `ng build`: thành công
- `ng test --watch=false --browsers=ChromeHeadless`: thành công

## Cấu trúc thư mục chính

```text
src/
  app/
    components/
      button/
      card/
      header/
      input/
      pagination/
      sidebar/
    layouts/
      auth-layout/
      dashboard-layout/
    mock-data/
      partners.mock.ts
      users.mock.ts
    models/
      partner.model.ts
      pagination.model.ts
      user.model.ts
    pages/
      forgot-password/
      login/
      partners/
      register/
      reset-password/
      users/
      verify-code/
    services/
      partner.service.ts
      user.service.ts
  assets/
  styles/
    abstracts/
    base/
    components/
    layout/
    pages/
old-static/
docs/
```

## Các route chính

- `/login`
- `/register`
- `/forgot-password`
- `/verify-code`
- `/reset-password`
- `/users`
- `/partners`
- `''` redirect về `/login`

## Layouts và components đã tạo

### Layouts

- `AuthLayoutComponent`: dùng cho login/register/forgot/reset/verify
- `DashboardLayoutComponent`: dùng cho users/partners

### Shared components

- `SidebarComponent`
- `HeaderComponent`
- `ButtonComponent`
- `InputComponent`
- `CardComponent`
- `PaginationComponent`

## Pages đã convert

- `LoginComponent`
- `RegisterComponent`
- `ForgotPasswordComponent`
- `VerifyCodeComponent`
- `ResetPasswordComponent`
- `UsersComponent`
- `PartnersComponent`

## Service và mock data

- `UserService`
  - trả dữ liệu từ `MOCK_USERS`
  - dữ liệu gồm 100 records
- `PartnerService`
  - trả dữ liệu từ `MOCK_PARTNERS`
  - dữ liệu gồm 100 records

Mock data được tạo bằng TypeScript, không gọi backend và không có API thật.

## Binding đã dùng ở đâu

- Interpolation `{{ }}`:
  - tiêu đề số lượng ở `users.component.html`, `partners.component.html`
  - text route/tab trong header/sidebar
- Property binding:
  - `[src]` cho logo, icon, ảnh minh họa
  - `[class]` cho avatar/status/package badge
  - `[disabled]` cho button submit và nút pagination
- Event binding:
  - `(ngSubmit)` cho toàn bộ auth forms
  - `(click)` cho resend code, pagination, action buttons
  - `(change)` trong `PaginationComponent` để đổi page size
- Reactive forms:
  - dùng cho login/register/forgot/reset/verify
  - dùng cho filter table ở users/partners

## Router hoạt động thế nào

- `AppRoutingModule` chia 2 layout lớn:
  - nhóm auth dùng `AuthLayoutComponent`
  - nhóm dashboard dùng `DashboardLayoutComponent`
- Route con render qua `router-outlet`
- Dashboard layout đọc `route.data` để đổi tab title, section title và menu sidebar

## RxJS dùng ở đâu

- `of()` trong `UserService` và `PartnerService`
- `map()`:
  - tạo option filter từ dữ liệu mock
  - filter dữ liệu theo form
  - tính `totalItems`, `totalPages`, `slice` dữ liệu theo trang
- `subscribe()`:
  - đồng bộ dữ liệu list ra UI
  - reset page khi filter thay đổi
  - lấy option phòng ban/lĩnh vực
- `BehaviorSubject`:
  - lưu `currentPage`
  - lưu `pageSize`

## Pagination hoạt động thế nào

- mặc định `10 records / trang`
- `PaginationComponent` có:
  - first / previous / next / last
  - số trang
  - đổi page size `10 / 25 / 50`
- `UsersComponent` và `PartnersComponent`:
  - nhận toàn bộ data từ service
  - filter
  - tính `totalPages = ceil(totalItems / pageSize)`
  - cắt mảng theo `slice(startIndex, startIndex + pageSize)`

## Ghi chú chuyển đổi

- Source static gốc được giữ trong thư mục `old-static/` để đối chiếu.
- Source static chỉ có 6 page HTML và chỉ có 1 page dashboard tên `users.html`, nhưng nội dung thực tế là danh sách đối tác.
- Vì route yêu cầu có cả `/users` và `/partners`, project Angular hiện tại tạo cả 2 page:
  - `/partners` bám sát page dashboard gốc nhất
  - `/users` dùng cùng visual/table system để mở rộng hợp lý
- Static source gốc không có page chat riêng, nên chưa tạo `ChatService` hoặc `ChatItem`.

## Tài liệu mentor

- [docs/report-angular.md](docs/report-angular.md)
