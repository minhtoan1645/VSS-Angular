# VSS Chat Platform Angular 12

Angular 12 conversion of the VSS Chat Platform UI. The app now follows a feature-based structure: feature modules own their pages, models, services, and mock data; shared owns reusable UI; core owns app-wide constants and utilities; layouts remain app shells.

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Main Structure

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
        button/
        card/
        input/
        modal/
        pagination/
        table/
      directives/
      pipes/
      models/
      utils/
      shared.module.ts
    layouts/
      auth-layout/
      dashboard-layout/
        components/
          header/
          sidebar/
        constants/
        models/
    modules/
      auth/
        auth.module.ts
        auth-routing.module.ts
        pages/
          forgot-password/
          login/
          register/
          reset-password/
          verify-code/
      user/
        data/
        models/
        services/
        pages/
          user-list/
          user-detail/
        user.module.ts
        user-routing.module.ts
      partner/
        data/
        models/
        services/
        components/
        pages/
          partner-list/
          partner-detail/
          partner-add/
        partner.module.ts
        partner-routing.module.ts
  assets/
  styles/
    abstracts/
    base/
    components/
    layout/
    pages/
```

Generated folders and local-only files such as `dist/`, `node_modules/`, `.angular/`, `.cache/`, and `*.log` are ignored and should not be committed.

## Routes

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
- `''` redirects to `/login`

## Routing Layout

`AppRoutingModule` wraps auth routes with `AuthLayoutComponent` and lazy-loads `AuthModule`.
Dashboard feature areas are lazy-loaded under `DashboardLayoutComponent`:

- `/users` loads `UserModule`
- `/partners` loads `PartnerModule`

`UserRoutingModule` maps `''` to `UserListComponent` and `':id'` to `UserDetailComponent`.
`PartnerRoutingModule` maps `''`, `'add'`, and `':id'`; keep `'add'` before `':id'`.

## Shared UI

Reusable Angular controls live in `src/app/shared/components` and are exported by `SharedModule`:

- `ButtonComponent`
- `CardComponent`
- `InputComponent`
- `PaginationComponent`

`shared/components/table` and `shared/components/modal` are reserved for generic components. Current table and modal markup still contains feature-specific actions, so it remains in feature pages until a generic API is safe.

Global SCSS partials in `src/styles/components` are CSS utility patterns used by both Angular components and native template elements. Do not remove a global partial unless all class usages have been migrated.

## Data Ownership

The app currently uses mock data only:

- `UserService` reads from `modules/user/data/users.mock.ts`
- `PartnerService` reads from `modules/partner/data/partners.mock.ts`

Feature-specific models and mock data stay inside their feature module. Cross-feature UI types, such as avatar variants and pagination state, live under `shared`.

`core` contains API-ready auth and permission primitives (`AuthService`, `TokenStorageService`, `PermissionService`, guards, interceptor, auth/permission models). They are intentionally not attached to current routes yet so the learning UI keeps its existing behavior.
