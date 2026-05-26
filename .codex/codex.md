# codex.md

## Ngôn ngữ và cách giao tiếp

- Luôn trả lời bằng tiếng Việt.
- Người dùng đang học Angular và kiến trúc frontend, vì vậy cần giải thích rõ luồng suy nghĩ như đang hướng dẫn thực tập sinh.
- Khi giải thích, đi từ tổng quan đến chi tiết, tránh nhảy thẳng vào code nếu người dùng chưa hiểu ngữ cảnh.
- Nếu có sửa code, nói rõ file nào liên quan, vì sao sửa ở đó và tác động tới luồng chạy.

## Bối cảnh project

Project này là ứng dụng Angular 12 dùng kiến trúc feature-based, NgModule, Reactive Forms, RxJS 6 và SCSS.

- `src/app/core`: nền tảng dùng toàn app như auth, permission, guard, interceptor, constants, models, utils.
- `src/app/shared`: component/directive/util dùng lại như `ButtonComponent`, `InputComponent`, `PaginationComponent`, `HasPermissionDirective`.
- `src/app/layouts`: layout cho auth flow và dashboard.
- `src/app/modules/auth`: đăng nhập, đăng ký, quên mật khẩu, xác thực mã, đặt lại mật khẩu.
- `src/app/modules/user`: danh sách user, chi tiết user, API abstraction, mock data, service orchestration.
- `src/app/modules/partner`: danh sách partner, chi tiết partner, thêm partner, pricing card, stepper, API abstraction, mock data.
- `src/styles`: SCSS global theo nhóm `abstracts`, `base`, `components`, `layout`, `pages`.

## Ràng buộc Angular

- Đây là Angular 12, không dùng standalone component, signal, signal forms, `inject()`, control flow mới `@if/@for`, hoặc API chỉ có ở Angular mới.
- Giữ mô hình `NgModule`, `RouterModule.forRoot`, `RouterModule.forChild`, lazy loading qua `loadChildren`.
- Form hiện tại dùng Reactive Forms, tiếp tục dùng `FormBuilder`, `Validators`, `AbstractControl`.
- Với RxJS, dùng pattern hiện có: `Observable`, `BehaviorSubject`, `combineLatest`, `Subscription`, `map`, `startWith`, `switchMap`, `filter`.
- Component có subscription thủ công phải cleanup trong `ngOnDestroy`.

## Luồng routing và permission

- Route gốc redirect về `/login`.
- Auth pages nằm dưới `AuthLayoutComponent`.
- Dashboard pages nằm dưới `DashboardLayoutComponent`, được bảo vệ bởi `AuthGuard`.
- Route user/partner dùng `PermissionGuard` và `data.permission`.
- UI ẩn/hiện action theo quyền bằng `*appHasPermission`.
- Khi thêm route dashboard mới, cần cập nhật đồng bộ:
  - `app-routing.module.ts` hoặc routing module của feature.
  - Permission trong `core/constants/permission.constants.ts` nếu cần quyền mới.
  - Sidebar/tab data trong `layouts/dashboard-layout/constants/dashboard.constants.ts` nếu route xuất hiện trên menu.
  - Class hoặc layout data nếu route cần styling riêng.

## Luồng dữ liệu cần giải thích

Khi giải thích một tính năng, ưu tiên đi theo luồng:

`component.html` -> `component.ts` -> `service.ts` -> `api.service.ts` -> `mock.service.ts` hoặc backend -> data -> UI update.

Ở giai đoạn hiện tại, `api.service.ts` vẫn gọi mock service. Khi gắn backend thật, ưu tiên thay implementation trong API layer để hạn chế ảnh hưởng tới component và routing.

## Quy ước khi sửa code

- Đọc file liên quan trước khi sửa.
- Giải thích ngắn luồng hiện tại, vấn đề, kế hoạch sửa, rồi mới sửa khi người dùng yêu cầu.
- Ưu tiên thay đổi nhỏ, đúng phạm vi, không refactor diện rộng khi chưa cần.
- Bám kiến trúc hiện có: component xử lý UI state, service điều phối nghiệp vụ, api service là lớp gọi nguồn dữ liệu, mock service chỉ phục vụ dữ liệu giả lập.
- Không đưa logic phức tạp vào template; đưa vào method/getter rõ nghĩa trong component.
- Không nhân đôi logic filter/pagination nếu có thể dùng `shared/utils/table.util.ts`.
- Tách trách nhiệm TS, HTML, SCSS rõ ràng.
- Không đổi style tổng thể, màu, spacing, class naming nếu request không yêu cầu.

## Clean Code áp dụng trong repo

- Đặt tên thể hiện ý định: biến, hàm, class phải nói được đang làm gì và vì sao tồn tại.
- Method nên là động từ hoặc cụm động từ: `getFilters`, `applyFilters`, `openEditUserModal`, `confirmDeletePartner`.
- Class/component/service giữ một trách nhiệm chính; nếu một file bắt đầu ôm nhiều lý do thay đổi, cân nhắc tách nhỏ.
- Function nên nhỏ, làm một việc, tránh nhiều tầng lồng nhau.
- Tránh boolean flag để điều khiển nhiều nhánh hành vi; tách hàm rõ nghĩa khi cần.
- Hạn chế comment giải thích điều hiển nhiên; chỉ comment khi cần giải thích lý do, rủi ro hoặc quyết định không hiển nhiên.
- Giữ code liên quan gần nhau, public method trước private method gọi bởi nó, format nhất quán với repo.

## UI, HTML và SCSS

- Tiếp tục dùng class SCSS hiện có theo hướng BEM-like: `block__element--modifier`.
- Dùng component shared (`app-button`, `app-input`, `app-pagination`) khi phù hợp thay vì tạo markup lặp lại.
- Giữ accessibility cơ bản: `aria-label`, `aria-modal`, `role="dialog"`, label cho input/select, button có `type`.
- Với table/list, giữ `trackBy` khi render bằng `*ngFor`.
- Với action trong row clickable, nhớ `$event.stopPropagation()` để không vô tình điều hướng sang detail.
- Assets icon/image đang nằm trong `src/assets/images`, ưu tiên tái sử dụng asset sẵn có.

## Auth và quyền

- Auth hiện dùng test users trong `permission.constants.ts` và lưu session qua `TokenStorageService`.
- `AuthInterceptor` thêm `Authorization` header khi có token.
- `PermissionService` đọc quyền từ role hiện tại.
- Khi sửa login/logout/permission, kiểm tra cả:
  - localStorage key.
  - `currentRole$`.
  - guard redirect.
  - directive `appHasPermission`.
  - menu dashboard.

## Test và kiểm tra

- Với sửa TypeScript/Angular có ảnh hưởng build, chạy `npm run build`.
- Với sửa logic form, list, permission hoặc routing, nên kiểm tra thủ công trên browser các route liên quan.
- Với bug fix, giải thích root cause trước, sau đó nói vì sao fix hoạt động.
- Sau khi sửa, luôn tóm tắt:
  - File đã đổi.
  - Nội dung đã đổi.
  - Lý do đổi.
  - Cách test thủ công hoặc lệnh đã chạy.

## Khi trả lời review hoặc debug

- Nếu review code, đưa bug/rủi ro lên trước, kèm file và dòng nếu có.
- Nếu debug, không đoán vội; đọc luồng gọi và state trước.
- Khi có nhiều khả năng, phân biệt rõ đâu là điều quan sát được từ code và đâu là suy luận.
- Không khẳng định đã xong nếu chưa build/test hoặc chưa nói rõ phần chưa kiểm chứng.

## Ưu tiên cuối cùng

Mục tiêu không chỉ là làm code chạy. Mục tiêu là giúp người dùng hiểu cách Angular project này vận hành, biết vì sao sửa ở đúng tầng, và có thể tự tiếp tục bảo trì sau đó.
