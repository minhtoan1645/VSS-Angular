# Memory

File này lưu thông tin cá nhân, thông tin dự án và các quyết định kỹ thuật quan trọng.
Claude sẽ đọc file này để hiểu ngữ cảnh mà không cần hỏi lại mỗi lần.

---

## Thông tin cá nhân

| Trường | Giá trị |
|---|---|
| Tên | Minh Toan (Nguyễn Minh Toản) |
| Vai trò | Frontend Developer (Angular) |
| Ngôn ngữ giao tiếp | Tiếng Việt |
| Múi giờ | GMT+7 (Việt Nam) |

**Cách làm việc ưa thích với Claude**:
- Giao tiếp bằng tiếng Việt
- Hỏi các câu hỏi cần thiết trước khi bắt tay vào làm
- Trả lời ngắn gọn, đúng trọng tâm

---

## Thông tin dự án

| Trường | Giá trị |
|---|---|
| Tên dự án | VSS Angular |
| Framework | Angular 21.2.16 |
| Ngôn ngữ | TypeScript (strict mode) |
| Style | SCSS (7-1 pattern) |
| Backend | Chưa có — đang dùng mock service |
| Trạng thái | Đang phát triển frontend, chờ backend |

**Tài khoản test** (mock auth):

| Email | Role | Quyền |
|---|---|---|
| admin@gmail.com | Admin | Tất cả 8 quyền |
| agent@gmail.com | Agent | user:view, partner:view |
| manager@gmail.com | Manager | partner:view/create/update/delete |

Mật khẩu: `123456`

---

## Quyết định kỹ thuật quan trọng

### Quy ước đặt tên file & folder

Đây là convention bắt buộc — không được thay đổi khi thêm tính năng mới:

| Loại file | Tên mẫu | Ví dụ |
|---|---|---|
| Component | `*.component.ts/html/scss` | `user-list.component.ts` |
| Service điều phối | `*.service.ts` | `user.service.ts` |
| Service gọi API | `*.api.service.ts` | `user-api.service.ts` |
| Service mock data | `*.mock.service.ts` | `user-mock.service.ts` |
| Hằng số mock | `*.mock.ts` | `user.mock.ts` |
| Interface/Type | `*.model.ts` | `user.model.ts` |
| Route guard | `*.guard.ts` | `auth.guard.ts` |
| HTTP interceptor | `*.interceptor.ts` | `auth.interceptor.ts` |
| Directive | `*.directive.ts` | `has-permission.directive.ts` |
| Hằng số | `*.const.ts` | `permissions.const.ts` |

**Cấu trúc thư mục mỗi feature module**:
```
feature/
├── api/            ← *ApiService (sẽ gọi HttpClient khi có backend)
├── mock/           ← *MockService + mock data
├── models/         ← Interfaces
├── pages/          ← Smart component (trang) — standalone
├── services/       ← *Service (business logic)
└── feature.routes.ts       ← Route array; lazy-loaded bằng loadChildren
```

---

## Ghi chú kỹ thuật

- **[2026-06-04]** Khởi tạo dự án VSS Angular với mock data, chưa có backend
- **[2026-06-04]** Tạo cấu trúc `.claude/` với CLAUDE.md, agent.md, memory.md
- **[2026-06-05]** Xác nhận Angular 21.2.16 (không phải 12): standalone components, `bootstrapApplication`, functional guards/interceptors, routes tại `app.routes.ts`
- **[2026-06-05] PHASE 1** — Xóa 6 `*.module.ts` / `*-routing.module.ts`; tạo `auth.routes.ts`, `user.routes.ts`, `partner.routes.ts`; chuyển sang full standalone
- **[2026-06-05] PHASE 2** — InjectionToken pattern: `USER_DATA_SOURCE`, `PARTNER_DATA_SOURCE`; `*ApiService` không còn phụ thuộc trực tiếp vào mock; mock đăng ký tại `main.ts`
- **[2026-06-05] PHASE 3** — Mock services giữ internal mutable state (`items[]`), trả về snapshot (`[...this.items]`), hỗ trợ CRUD thực sự
- **[2026-06-05] PHASE 4** — `UserService`, `PartnerService` dùng Angular Signals (`signal()`, `.asReadonly()`); `toObservable()` khai báo ở field initializer (không trong method) để đảm bảo injection context; dọn `AuthService` (xóa `createMockUser`/`persistMockUser`)
- **[2026-06-05] PHASE 5** — Trang 404 (`NotFoundComponent`) và 403 (`ForbiddenComponent`) tại `shared/pages/`; `permissionGuard` redirect `/forbidden`; `authInterceptor` bắt 401 → logout + `/login`; `isLoading`/`loadError` signals trên service, hiển thị trong template
- **[2026-06-05] PHASE 6** — 43 unit tests (43 PASS): `table.util`, `PermissionService`, `authGuard`, `permissionGuard`, `HasPermissionDirective`, `UserListComponent`

---

## Tech Debt còn lại

- Chưa có unit test cho `partner-list`, `user-detail`, `partner-detail`, `AuthService`, `UserMockService`
- `AuthService.currentRole$` vẫn là `BehaviorSubject` — PHASE 4+ có thể chuyển sang Signal
- `user-list` / `partner-list` dùng `UntypedFormBuilder` — nên chuyển sang typed `FormBuilder`
- Chưa có backend thực — khi có, chỉ cần sửa `*ApiService` (đổi `of(mock)` → `http.get(...)`)
- Loading state hiện tại chỉ check error / initial load — không có per-request loading indicator
