# VSS Chat Platform Angular 12

Angular 12 conversion of the VSS Chat Platform UI. The current structure is organized by app shell, lazy feature modules, shared UI components, services, models, mock data, and global styles.

## Run

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Main Structure

```text
src/
  app/
    layouts/
      auth-layout/
      dashboard-layout/
        components/
          header/
          sidebar/
    modules/
      user/
        user.module.ts
        user-routing.module.ts
        pages/
          user-list/
          user-detail/
      partner/
        partner.module.ts
        partner-routing.module.ts
        pages/
          partner-list/
          partner-detail/
          partner-add/
    pages/
      forgot-password/
      login/
      register/
      reset-password/
      verify-code/
    components/
      button/
      card/
      input/
      pagination/
      components.module.ts
    constants/
    mock-data/
    models/
    services/
    utils/
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

`AppRoutingModule` keeps auth pages eager under `AuthLayoutComponent`.
Dashboard feature areas are lazy-loaded under `DashboardLayoutComponent`:

- `/users` loads `UserModule`
- `/partners` loads `PartnerModule`

`UserRoutingModule` and `PartnerRoutingModule` use `RouterModule.forChild(routes)`.

## Shared UI

Reusable UI controls live in `src/app/components` and are exported by `ComponentsModule`:

- `ButtonComponent`
- `CardComponent`
- `InputComponent`
- `PaginationComponent`

Global SCSS partials live separately in `src/styles/components`. That folder is for shared styles such as buttons, cards, inputs, modals, and tables; it is not a duplicate of the Angular component folder.

Dashboard-only layout pieces live under `src/app/layouts/dashboard-layout/components`:

- `HeaderComponent`
- `SidebarComponent`

## Data

The app currently uses mock data only:

- `UserService` reads from `MOCK_USERS`
- `PartnerService` reads from `MOCK_PARTNERS`

No backend API is wired yet.
