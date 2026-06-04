# Agent Configuration

File này định nghĩa các sub-agent hỗ trợ chia nhỏ công việc trong dự án VSS Angular.
Mỗi agent hoạt động độc lập — nhận task riêng, trả kết quả riêng.

---

## Research Agent

**Mục đích**: Tìm kiếm và đánh giá thư viện, giải pháp kỹ thuật trước khi triển khai.

**Khi nào dùng**:
- Cần chọn thư viện cho một tính năng mới (ví dụ: chart, form validation, date picker)
- Muốn biết best practice cho một pattern Angular cụ thể
- Đánh giá trade-off giữa các hướng tiếp cận kỹ thuật

**Cách giao việc**:
```
@research [câu hỏi hoặc vấn đề cần tìm hiểu]

Ví dụ:
@research So sánh các thư viện chart cho Angular: Chart.js vs ngx-charts vs ApexCharts
@research Best practice để quản lý form phức tạp (multi-step) trong Angular 12
```

**Output mong đợi**: Bảng so sánh hoặc tóm tắt ưu/nhược điểm, kèm khuyến nghị cụ thể cho dự án này.

---

## Review Agent

**Mục đích**: Review code Angular — kiểm tra chất lượng, tuân thủ convention, và phát hiện vấn đề tiềm ẩn.

**Khi nào dùng**:
- Trước khi commit một tính năng mới
- Cần góc nhìn độc lập về một đoạn code phức tạp
- Kiểm tra component/service có tuân theo kiến trúc hiện tại không

**Cách giao việc**:
```
@review [file hoặc đoạn code cần review]

Ví dụ:
@review src/app/modules/partner/pages/partner-add/partner-add.component.ts
@review Kiểm tra UserService có đúng pattern api/mock/service không
```

**Checklist review** (agent sẽ kiểm tra các mục này):
- Tuân thủ cấu trúc module: `api/mock/models/pages/services`
- Không dùng `any` trong TypeScript (strict mode)
- Component smart/dumb phân tách đúng vai trò
- Observable được unsubscribe đúng cách (`OnDestroy` hoặc `async` pipe)
- Đặt tên file đúng convention: `*.api.service.ts`, `*.mock.service.ts`, `*.guard.ts`
- Permission guard được gắn đúng route nếu cần

**Output mong đợi**: Danh sách vấn đề theo mức độ (critical / warning / suggestion), kèm đề xuất sửa cụ thể.

---

## QA Agent

**Mục đích**: Kiểm thử UI và business logic — xác nhận tính năng hoạt động đúng trước khi ship.

**Khi nào dùng**:
- Sau khi hoàn thành một tính năng, cần verify luồng người dùng
- Kiểm tra phân quyền hoạt động đúng với từng role
- Phát hiện edge case và regression

**Cách giao việc**:
```
@qa [tính năng hoặc luồng cần kiểm thử]

Ví dụ:
@qa Kiểm tra luồng thêm mới partner với tài khoản Manager
@qa Verify PermissionGuard chặn Agent truy cập /users khi không có quyền user:view
```

**Checklist QA** (agent sẽ kiểm tra theo các tài khoản test):

| Tài khoản | Role | Quyền |
|---|---|---|
| admin@gmail.com | Admin | Tất cả |
| agent@gmail.com | Agent | user:view, partner:view |
| manager@gmail.com | Manager | partner:view/create/update/delete |

Mật khẩu test: `123456`

**Output mong đợi**: Danh sách test case đã pass/fail, mô tả bug (nếu có) với bước tái hiện cụ thể.

---

## Cách dùng nhiều agent cùng lúc

Khi một task lớn cần nhiều góc nhìn, có thể giao song song:

```
Tôi muốn thêm tính năng export PDF danh sách user:

@research Thư viện export PDF phù hợp cho Angular 12
@review Sau khi chọn thư viện, review cách tích hợp vào UserService
@qa Kiểm tra export chỉ hiển thị với tài khoản có quyền user:view
```

---

## Kỹ năng (Skills) theo từng loại công việc

Bạn có 9 skill cài sẵn tại `C:\Users\nguye\.agents\skills\`. Dưới đây là hướng dẫn dùng skill nào cho từng việc trong dự án.

### Thêm tính năng mới (feature)

| Việc cần làm | Skill nên dùng |
|---|---|
| Tạo component, service, route | `angular-developer` |
| Xây dựng UI chuẩn chỉnh, không có "AI aesthetic" | `frontend-ui-engineering` |
| Viết code sạch, đặt tên đúng, function nhỏ | `typescript-clean-code` |

> Khi bắt đầu feature mới, bảo Claude: **"Dùng skill angular-developer và typescript-clean-code (workflow: new-feature)"**

---

### Review & Refactor code

| Việc cần làm | Skill nên dùng |
|---|---|
| Review git changes (SOLID, security, logic) | `code-review-expert` |
| Review pull request theo quy trình chuyên nghiệp | `typescript-clean-code` (workflow: pr-review) |
| Refactor an toàn với test coverage | `typescript-clean-code` (workflow: refactoring) |

> Khi muốn review: **"Dùng skill code-review-expert để review các thay đổi hiện tại"**

---

### Viết Test

| Việc cần làm | Skill nên dùng |
|---|---|
| Unit test Angular (TestBed, Jasmine/Karma) | `angular-developer` (references/testing-fundamentals.md) |
| Test component với harness | `angular-developer` (references/component-harnesses.md) |
| Test routing và guards | `angular-developer` (references/router-testing.md) |
| Áp dụng TDD cho tính năng mới | `typescript-clean-code` (workflow: tdd) |

---

### Xây dựng Form (partner-add stepper, login, register)

| Việc cần làm | Skill nên dùng |
|---|---|
| Reactive forms phức tạp (stepper multi-step) | `angular-developer` (references/reactive-forms.md) |
| Validation và error state hiển thị đúng | `accessibility` (form labels + error handling pattern) |

---

### Kết nối Backend (khi có API thực)

| Việc cần làm | Skill nên dùng |
|---|---|
| Thay mock bằng HttpClient trong `*ApiService` | `angular-developer` (references/creating-services.md) |
| Kiểm tra security (token, CSP, HTTPS) | `best-practices` |
| Kiểm tra không có lỗ hổng bảo mật | `code-review-expert` (security checklist) |

---

### Accessibility & UI Quality

| Việc cần làm | Skill nên dùng |
|---|---|
| Kiểm tra keyboard navigation, ARIA, contrast | `accessibility` |
| Đảm bảo UI không trông như AI-generated | `frontend-ui-engineering` |
| Audit toàn diện (performance + a11y + SEO) | `web-quality-audit` |

---

### Performance

| Việc cần làm | Skill nên dùng |
|---|---|
| Lazy loading, code splitting, Core Web Vitals | `performance` |
| Lazy loading routes trong Angular | `angular-developer` (references/loading-strategies.md) |

---

### Tìm skill mới

Nếu cần một loại hỗ trợ chưa có skill: **"Dùng skill find-skills để tìm skill cho [nhu cầu]"**

---

### Bảng tóm tắt nhanh

| Tình huống | Skill chính | Skill bổ trợ |
|---|---|---|
| Tạo feature Angular | `angular-developer` | `typescript-clean-code` |
| Xây dựng UI | `frontend-ui-engineering` | `accessibility` |
| Review code/PR | `code-review-expert` | `typescript-clean-code` |
| Viết test / TDD | `angular-developer` | `typescript-clean-code` |
| Làm form | `angular-developer` | `accessibility` |
| Kết nối backend | `angular-developer` | `best-practices` |
| Audit tổng thể | `web-quality-audit` | `accessibility`, `performance` |
| Tối ưu hiệu năng | `performance` | `angular-developer` |
