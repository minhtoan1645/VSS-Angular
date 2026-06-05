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
- **[2026-06-05]** Hiện tại hybrid pattern: root standalone + `*.module.ts` vẫn còn cho lazy-load chunk — PHASE 1 sẽ dọn sạch sang `*.routes.ts`
