# AGENTS.md

Guidance for coding agents working in Archivia.

## Project Snapshot

Archivia is a Next.js 15 App Router application for a university thesis archive, adviser recommendation, student request, faculty approval, and admin management system. The app uses custom JWT cookie authentication, Supabase tables/views for data, Cloudinary for thesis files, Nodemailer for email, and local FastAPI services for adviser recommendation and semantic search.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npx tsx scripts/seed.ts
npx tsx scripts/seedThesis.ts
```

Notes:

- The dev server uses `next dev --turbopack`.
- `npm run lint` currently calls `next lint`; if this fails because of the Next.js command, use the ESLint CLI migration path.
- The recommendation service is expected at `http://localhost:8000/recommend`.
- The semantic search service is expected at `http://localhost:8001/search`.
- The retrain API route invokes `python3`; on Windows this may need adjustment if only `python` is available.

## Architecture Map

- `app/` is the Next.js App Router surface. It owns routes, route layouts, pages, route-level loading states, API route handlers, and page-specific components.
- `app/(root)/` is the shared authenticated user experience: home thesis browsing, bookmarks, adviser directory, and profile pages.
- `app/(student)/` is for student-only flows: find adviser, advisory requests, and thesis publishing.
- `app/(faculty)/` is for faculty-only flows: advisees, advisory requests, thesis approval, handled thesis, dashboard, and settings.
- `app/(admin)/` is for admin-only flows: dashboard, user/thesis/advisee management, backup, model retraining, and settings.
- `app/auth/` is for unauthenticated login and forgot-password pages.
- `app/api/upload-thesis/route.ts` uploads thesis files to Cloudinary.
- `app/api/delete-thesis/route.ts` deletes Cloudinary raw files.
- `app/api/retrain-model/route.ts` runs the Python model export and returns a pickle file.
- `actions/` contains Server Actions grouped by domain: `admin`, `auth`, `common`, `faculty`, and `student`.
- `components/` contains reusable and shared UI used across route groups.
- `components/admin/` contains admin-oriented shared UI.
- `components/ui/` contains shadcn/Radix-style primitives and should stay generic.
- `hooks/` contains client workflow hooks that coordinate component state, actions, and side effects.
- `utils/` contains service clients, validators, formatting helpers, email helpers, and upload helpers.
- `utils/supabase/` contains Supabase clients for browser, server, and seed contexts.
- `utils/nodemailer/` contains email transport and domain-specific email senders.
- `utils/cloudinary/` contains Cloudinary upload helpers.
- `lib/` contains framework-agnostic helpers such as JWT, hashing, and generic class-name utilities.
- `types/` contains shared domain interfaces and type definitions.
- `data/` contains static options, seed users, adviser names, demo data, and spreadsheets.
- `scripts/` contains seeders, Python model export code, and model artifacts.
- `store/` contains Zustand state.
- `sections/` contains larger landing/homepage sections.

## System Architecture Analysis

The application is organized by role and responsibility:

- Routing and page composition live in `app/`. Route groups separate access areas without changing URL segments: `(root)`, `(student)`, `(faculty)`, and `(admin)`.
- Route folders under each role use the real product language in the URL, such as `find-adviser`, `my-requests`, `publish-thesis`, `manage-users`, `manage-theses`, `manage-advisees`, `thesis-approval`, and `handled-thesis`.
- Server Actions in `actions/` are the main data mutation/query boundary for authenticated database work. Keep role-specific behavior in the matching domain folder.
- API routes in `app/api/` are reserved for operations needing raw request/response handling or external file/process work, such as Cloudinary uploads/deletes and model retraining.
- Shared UI is split between route-local components in `app/...` and reusable components in `components/`. Prefer route-local placement until a component is reused across routes.
- Service integrations are isolated in `utils/<service>/`. Supabase, Nodemailer, and Cloudinary should not be configured directly inside components.
- `middleware.ts`, role layouts, and Server Actions work together for access control. Middleware handles broad navigation gates, layouts enforce role access, and actions should still verify the session for sensitive operations.
- Local FastAPI services are external dependencies. Adviser recommendation and semantic search calls should be treated as network boundaries that may fail or be unavailable.

## Folder And Filename Conventions

Follow the current naming style when adding or moving files:

- Route folder names use kebab-case because they become URL segments: `find-adviser`, `my-requests`, `publish-thesis`, `manage-users`, `manage-theses`, `manage-advisees`, `retrain-model`, `forgot-password`.
- Next.js special files keep the exact framework names: `page.tsx`, `layout.tsx`, `loading.tsx`, and `route.ts`.
- Route-local React components use PascalCase filenames and should match the main component/export name: `AdviserCard.tsx`, `ManageUsersClient.tsx`, `ThesisTable.tsx`, `ConfirmModal.tsx`.
- Shared React components in `components/` also use PascalCase filenames that match the main component/export name: `Header.tsx`, `ThesisCard.tsx`, `Pagination.tsx`.
- UI primitive files in `components/ui/` use lowercase kebab-case names because they follow the shadcn/Radix convention: `button.tsx`, `toggle-group.tsx`, `textarea.tsx`.
- Hooks use `use` + PascalCase and the filename should match the hook export: `useFindAdviser.ts`, `useThesisUpload.ts`, `useManageUsers.ts`.
- Server Action files use camelCase verb or domain names that describe the exported action(s): `getCurrentUser.ts`, `submitThesis.ts`, `approveThesis.ts`, `manageUsers.ts`.
- Utility files use camelCase names that match their primary helper: `formatDate.ts`, `getInitials.ts`, `isValidEmail.ts`, `sortedRecommendAdvisers.ts`.
- Type files use camelCase domain names and should stay aligned with the domain they describe: `studentRequests.ts`, `manageThesis.ts`, `userSession.ts`.
- Zustand store files use camelCase with a `Store` suffix: `adviserStore.ts`.
- Static data files use camelCase domain names for TypeScript data and descriptive names for spreadsheets/assets: `researchInterests.ts`, `profileFormFields.ts`, `theses.xlsx`.
- Script files may use camelCase for TypeScript scripts and snake_case for Python scripts/artifacts: `seedThesis.ts`, `seedNewThesis.ts`, `retrain_export.py`.
- Image and media asset filenames in `public/` should be lowercase and descriptive. Existing adviser profile images use lowercase surname filenames.

When creating a new file, keep the filename the same as the primary component, hook, action, helper, store, or type it exports. If a file exports multiple related functions, name the file after the domain behavior they share, following examples like `manageUsers.ts` or `theses.ts`.

## Website Feature And Refactor Template

Use this template when creating a new website area, adding a page, or refactoring an existing flow. Follow the folder and filename conventions above.

### 1. Define The Website Area

Before coding, identify:

- Role area: shared `(root)`, student `(student)`, faculty `(faculty)`, admin `(admin)`, public auth `auth`, or API `api`.
- URL segment: use kebab-case, such as `new-feature`, `manage-records`, or `request-status`.
- Main user workflow: browsing, creating, editing, approving, uploading, searching, or managing.
- Data boundary: Server Action, API route, client-only state, external service, or static data.
- Access boundary: public, authenticated, student-only, faculty-only, admin-only, or shared authenticated.

### 2. Choose The Folder Structure

Use one of these patterns:

```text
app/(role)/route-name/
  page.tsx
  RouteNameClient.tsx
  RouteSpecificComponent.tsx
```

```text
actions/domain/
  getDomainData.ts
  createDomainRecord.ts
  updateDomainRecord.ts
```

```text
hooks/
  useRouteName.ts
```

```text
types/
  routeDomain.ts
```

```text
utils/service-or-domain/
  helperName.ts
```

For route-specific UI, colocate components beside the route page. Move components to `components/` only after they are reused by multiple routes.

### 3. Filename Rules For New Work

Keep filenames aligned with their primary export:

- Page entry: `page.tsx`
- Layout entry: `layout.tsx`
- API handler: `route.ts`
- Client route component: `FeatureNameClient.tsx`
- Modal: `FeatureNameModal.tsx` or action-specific names like `ConfirmModal.tsx`
- Table: `FeatureNameTable.tsx`
- Card: `FeatureNameCard.tsx`
- Form: `FeatureNameForm.tsx`
- Hook: `useFeatureName.ts`
- Server Action: `verbDomainThing.ts`, such as `getStudentRequests.ts` or `approveThesis.ts`
- Type file: `domainThing.ts`
- Utility: `verbOrFormatThing.ts`, such as `formatDate.ts` or `isValidEmail.ts`

Do not create vague files such as `helpers.ts`, `utils.ts`, `data.ts`, `component.tsx`, `modal.tsx`, or `newPage.tsx` when a domain-specific name is possible.

### 4. Page Implementation Template

Use this shape for normal App Router pages:

```tsx
import FeatureNameClient from "./FeatureNameClient";

export default async function Page() {
  return <FeatureNameClient />;
}
```

If the page needs server-side session checks or initial data, keep that logic in `page.tsx` and pass typed props into the client component:

```tsx
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import FeatureNameClient from "./FeatureNameClient";

export default async function Page() {
  const user = await getCurrentUser();

  return <FeatureNameClient user={user} />;
}
```

### 5. Server Action Template

Use this shape for authenticated database work:

```ts
"use server";

import { getSession } from "@/actions/auth/getSession";
import { createClient } from "@/utils/supabase/server";

export async function actionName() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const supabase = await createClient();

  // Query or mutate Supabase here.
}
```

Keep sensitive role checks inside the action even when middleware or layouts already protect the page.

### 6. Refactor Checklist

When refactoring, use this checklist:

- Keep routes and URL folder names stable unless the user explicitly requests route changes.
- Preserve access control in `middleware.ts`, role layouts, and Server Actions.
- Keep Server Actions in the correct `actions/<domain>/` folder.
- Keep API routes only for upload/delete/download/process work that needs request/response control.
- Rename files only when the new filename matches the primary export and improves consistency.
- Update imports immediately after moving or renaming files.
- Prefer route-local components until reuse is proven.
- Keep shared primitives in `components/ui/` generic and reusable.
- Keep service setup inside `utils/<service>/`.
- Keep type definitions in `types/` when used across routes or domains.
- Avoid moving secrets or service-role Supabase usage into browser/client code.
- Run `npm run build` after meaningful refactors when feasible.

### 7. Handoff Summary Template

When handing off website creation or refactor work, summarize:

```text
Changed:
- Added/updated <route or feature>.
- Moved/refactored <files or folders>.
- Kept naming aligned with AGENTS.md conventions.

Verified:
- Ran <command>.
- Not run: <reason>.

Notes:
- <Any access, environment, or service dependency notes.>
```

## Auth And Access Control

Authentication is custom, not Supabase Auth:

- `actions/auth/login.ts` validates a `users` table record, compares a bcrypt hash, creates/tracks a session, signs a JWT, and stores it in an HTTP-only `session` cookie.
- `lib/jwt.ts` signs/verifies JWTs with `JWT_SECRET`.
- `middleware.ts` reads and verifies the `session` cookie and applies route/workflow redirects.
- `actions/auth/getCurrentUser.ts` and `actions/auth/getSession.ts` are the normal server-side ways to inspect identity.

Keep these layers aligned when changing protected flows:

- Middleware handles broad route protection and student workflow gates.
- Faculty/admin layouts enforce role-specific access with redirects.
- Server Actions should still verify session/role for domain-sensitive operations.

## Role Areas

- Student: adviser recommendations, advisory requests, request status, thesis upload/publish.
- Faculty: pending advisory requests, referrals, advisees, thesis approval/return, upload authorization, handled theses, settings.
- Admin: dashboard stats, manage users, manage theses, manage advisees, backup, model retraining, settings.
- Shared authenticated users: thesis browsing, bookmarks, adviser directory, profile pages.

## Data And Services

Supabase clients:

- `utils/supabase/server.ts` for server runtime access with cookies.
- `utils/supabase/client.ts` for browser access with publishable/anon key only.
- `utils/supabase/seedClient.ts` for seed scripts using service-role access.

External services:

- Cloudinary credentials are used in API routes and upload utilities.
- Gmail/Nodemailer credentials are used in `utils/nodemailer/*`.
- FastAPI recommendation/search URLs are hard-coded to localhost in the active code.

Environment keys currently referenced:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
EMAIL_USER
EMAIL_PASS
NEXT_PUBLIC_ZUSTAND_SECRET_KEY
```

Be careful with `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: service-role keys should never be imported into client code.

## Coding Conventions

- Use TypeScript and keep `strict` compatibility.
- Prefer the `@/*` path alias for cross-folder imports.
- Add or change domain behavior in the relevant `actions/<domain>/` folder.
- Keep route-specific components close to their route directory.
- Put reusable components in `components/`.
- Put reusable hooks in `hooks/`.
- Put shared domain types in `types/`.
- Keep service configuration in `utils/<service>/`.
- Use Server Actions for authenticated database operations.
- Use API routes for file upload/delete, downloads, and operations that need raw request/response control.
- Keep UI consistent with the existing Tailwind/Radix/shadcn style.
- Use existing utilities such as validators and formatters before adding new helpers.

## Safety Notes

- Do not commit `.env.local` or real secret values.
- Do not move privileged Supabase service-role usage into browser code.
- Do not weaken middleware or layout role checks when adding navigation/routes.
- Do not assume recommendation or semantic search works unless the external services are running.
- Cloudinary thesis files use `resource_type: "raw"`; deletion must use the same resource type.
- The JWT fallback secret in `lib/jwt.ts` is not production safe.

## Testing And Verification

Before handing off meaningful code changes:

- Run `npm run build` for type and production build validation when feasible.
- Run `npm run lint` if the configured lint command works in the current Next.js version.
- Manually smoke-test affected role flows when route protection or workflow gates change.
- For upload changes, verify both upload and delete paths against Cloudinary.
- For recommendation/search changes, verify the relevant local FastAPI service is running.

## Documentation

Keep `README.md` updated when adding:

- new environment variables,
- new external services,
- new scripts,
- new route groups,
- new deployment assumptions,
- or significant changes to auth, data, upload, email, search, or recommendation architecture.
