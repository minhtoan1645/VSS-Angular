# Báo cáo convert sang Angular 12

## Angular là gì

Angular là framework frontend của Google để xây dựng ứng dụng web theo hướng component-based. Angular hỗ trợ routing, form, dependency injection, service, template binding và quản lý state theo cách có cấu trúc hơn HTML/JS thuần.

Trong project này, Angular được dùng để:

- tách từng màn hình thành component riêng
- điều hướng bằng router thay vì link HTML tĩnh
- quản lý form bằng reactive forms
- lấy mock data qua service thay vì hard-code trong template

## TypeScript được dùng trong project như thế nào

TypeScript được dùng để:

- định nghĩa model rõ ràng cho `User`, `Partner`, `PaginationState`
- viết logic filter/pagination có type
- giảm dùng `any`
- tách dữ liệu mock, service, component logic thành các file rõ ràng

Ví dụ:

- `user.model.ts`: mô tả cấu trúc người dùng
- `partner.model.ts`: mô tả cấu trúc đối tác
- `users.component.ts`: xử lý filter và phân trang với type cụ thể

## Component là gì và project đã chia component ra sao

Component là đơn vị UI + logic cơ bản trong Angular. Mỗi component có:

- file `.ts` cho logic
- file `.html` cho giao diện
- file `.scss` cho style riêng nếu cần

Project được chia như sau:

- Layout components:
  - `AuthLayoutComponent`
  - `DashboardLayoutComponent`
- Shared UI components:
  - `SidebarComponent`
  - `HeaderComponent`
  - `ButtonComponent`
  - `InputComponent`
  - `CardComponent`
  - `PaginationComponent`
- Page components:
  - `LoginComponent`
  - `RegisterComponent`
  - `ForgotPasswordComponent`
  - `VerifyCodeComponent`
  - `ResetPasswordComponent`
  - `UsersComponent`
  - `PartnersComponent`

## Binding là gì, ví dụ trong project

Binding là cách Angular nối dữ liệu TypeScript với giao diện HTML.

### 1. Interpolation

Ví dụ:

- `{{ totalUsers }}`
- `{{ partner.name }}`

Dùng để render text động trong template.

### 2. Property binding

Ví dụ:

- `[src]="iconSrc"`
- `[disabled]="forgotPasswordForm.invalid"`
- `[class]="getPackageBadgeClass(partner.packageName)"`

Dùng để gán giá trị động cho thuộc tính của phần tử HTML.

### 3. Event binding

Ví dụ:

- `(ngSubmit)="onSubmit()"`
- `(click)="onPageChange(page)"`
- `(click)="resendCode()"`

Dùng để bắt sự kiện từ giao diện và gọi hàm trong component.

### 4. Form binding

Project dùng reactive forms:

- `[formGroup]="loginForm"`
- `formControlName="status"`
- `[formControl]="emailControl"`

## Router là gì, các route của project

Router là cơ chế điều hướng giữa các màn hình trong Angular mà không cần reload toàn bộ trang.

Các route chính:

- `/login`
- `/register`
- `/forgot-password`
- `/verify-code`
- `/reset-password`
- `/users`
- `/partners`

Cách tổ chức:

- nhóm auth nằm dưới `AuthLayoutComponent`
- nhóm dashboard nằm dưới `DashboardLayoutComponent`
- `''` redirect về `/login`

## Service là gì, vì sao dùng service cho mock data

Service là nơi chứa logic dùng chung, đặc biệt phù hợp cho:

- gọi API
- xử lý dữ liệu
- chia sẻ dữ liệu cho nhiều component

Trong project này chưa có backend nên service được dùng để:

- giả lập nguồn dữ liệu
- tách dữ liệu khỏi template
- giúp sau này thay mock data bằng API thật dễ hơn

Service hiện có:

- `UserService`
- `PartnerService`

## RxJS là gì, Observable/of/subscribe dùng ở đâu

RxJS là thư viện xử lý dữ liệu bất đồng bộ theo stream trong Angular.

### `Observable`

Service trả dữ liệu dưới dạng `Observable<User[]>` hoặc `Observable<Partner[]>`.

### `of()`

Được dùng trong service để bọc mock data thành observable:

```ts
return of(MOCK_USERS);
```

### `subscribe()`

Được dùng trong page component để:

- nhận dữ liệu render
- lấy option filter
- theo dõi thay đổi form/filter

### `map()`

Được dùng để:

- tạo danh sách option từ dữ liệu mock
- filter dữ liệu theo form
- tính toán phân trang trước khi render

## Mock data 100 records/list được tạo như thế nào

Project có:

- `MOCK_USERS`: 100 bản ghi
- `MOCK_PARTNERS`: 100 bản ghi

Cách tạo:

- dùng `Array.from({ length: 100 })`
- kết hợp pool dữ liệu mẫu như:
  - tên
  - email
  - phone
  - ngành/lĩnh vực
  - vai trò/gói sử dụng
  - trạng thái
- sinh avatar text từ initials
- sinh ngày dạng `dd/mm/yyyy`

Như vậy list đủ lớn để test:

- filter
- pagination
- rendering table

## Pagination tính toán như thế nào

Pagination trong project hoạt động theo các bước:

1. Lấy toàn bộ data từ service
2. Filter theo điều kiện hiện tại
3. Tính:

```ts
totalPages = Math.ceil(totalItems / pageSize)
```

4. Tính vị trí bắt đầu:

```ts
startIndex = (currentPage - 1) * pageSize
```

5. Cắt mảng:

```ts
items = filteredItems.slice(startIndex, startIndex + pageSize)
```

Mặc định:

- `pageSize = 10`

Component `PaginationComponent` hỗ trợ:

- first
- previous
- next
- last
- click số trang
- đổi `pageSize`

## Những lỗi gặp khi convert và cách xử lý

### 1. Local repo ban đầu không chứa source static

Vấn đề:

- repo Angular local ban đầu chỉ là scaffold Angular CLI
- không có `assets/css/js/pages/scss` của project cũ

Cách xử lý:

- clone thêm repo static vào `old-static/`
- scan lại toàn bộ source cũ trước khi convert

### 2. `users.html` trong source cũ thực ra là page đối tác

Vấn đề:

- tên file là `users.html`
- nhưng title và nội dung là `Danh sách đối tác`

Cách xử lý:

- ghi chú rõ trong README
- tạo cả `UsersComponent` và `PartnersComponent`
- giữ `/partners` là page bám source cũ nhất
- thêm `/users` theo cùng design system để đáp ứng yêu cầu route

### 3. Build production bị chặn bởi sandbox

Vấn đề:

- môi trường sandbox chặn một số child-process khi optimize

Cách xử lý:

- build development để bắt lỗi TypeScript/template trước
- rerun build production ngoài sandbox để xác nhận compile thành công

### 4. Test ban đầu dùng scaffold mặc định Angular

Vấn đề:

- `app.component.spec.ts` vẫn kiểm tra title mặc định `vss-angular`

Cách xử lý:

- cập nhật spec theo project mới

## Những phần cần cải thiện sau này

- thay mock data bằng API thật
- tách thêm table/list container thành reusable shared component nếu dashboard mở rộng
- thêm route guard cho dashboard
- thêm toast/feedback khi submit form
- thêm unit test cho users/partners filtering và pagination
- thêm module hóa theo feature nếu project lớn hơn
- thêm xử lý sort thật cho table
- thêm chat page nếu source thiết kế gốc được bổ sung
