# Archivia

Archivia is a Next.js thesis archive and adviser matching platform for the USTP IT Department. It centralizes thesis discovery, student adviser requests, faculty thesis handling, admin management, file uploads, email notifications, and model-assisted adviser recommendations.

## Core Features

- Public authenticated thesis browsing with bookmarks, filters, profile pages, and adviser directory views.
- Student workflows for adviser discovery, recommendation analysis, advisory requests, request tracking, and thesis publishing.
- Faculty workflows for advisory requests, advisee management, handled theses, thesis approval, upload authorization, referrals, and profile settings.
- Admin workflows for dashboard analytics, user management, thesis management, adviser/advisee management, backup, settings, and model retraining download.
- Cloudinary-backed thesis file upload and deletion.
- Supabase-backed application data with server-side access through Next Server Actions.
- Custom JWT session cookie with middleware route protection.
- Nodemailer email notifications for OTPs, advisory requests, referrals, thesis approval, and status changes.
- External ML/search services for adviser recommendation and semantic thesis search.

## Tech Stack

- Framework: Next.js 15 App Router, React 19, TypeScript
- Styling: Tailwind CSS 4, shadcn-style UI primitives, Radix UI, lucide-react
- Data: Supabase via `@supabase/ssr` and `@supabase/supabase-js`
- Auth/session: Custom JWT cookie using `jose`, password hashing with `bcryptjs`
- Files: Cloudinary raw uploads for thesis files
- Email: Nodemailer with Gmail transport
- Charts/UI effects: Recharts, Framer Motion, Sonner
- Scripts/data: XLSX seed imports, TypeScript seed scripts, Python model export script

## System Architecture

```text
Browser
  |
  | React Server Components / Client Components / Server Actions
  v
Next.js App Router
  |
  |-- middleware.ts
  |     verifies the custom `session` JWT cookie and enforces route/workflow access
  |
  |-- app route groups
  |     (root)     shared authenticated browsing experience
  |     (student)  student adviser and thesis publishing flows
  |     (faculty)  faculty dashboard and approval workflows
  |     (admin)    admin dashboard and management workflows
  |     auth       login and password recovery
  |
  |-- actions/*
  |     server-side domain operations against Supabase and email services
  |
  |-- app/api/*
        upload/delete thesis files through Cloudinary
        retrain-model runs Python export and returns a `.pkl`

External services
  |
  |-- Supabase: users, profiles, theses, bookmarks, requests, adviser views, sessions
  |-- Cloudinary: raw thesis file storage
  |-- Gmail/Nodemailer: transactional notifications
  |-- FastAPI recommendation service: http://localhost:8000/recommend
  |-- FastAPI semantic search service: http://localhost:8001/search
```

## Directory Guide

- `app/` contains App Router pages, layouts, route groups, and API routes.
- `app/(root)/` contains shared authenticated pages such as home, advisers, bookmarks, and profile.
- `app/(student)/` contains student-only pages like `find-adviser`, `my-requests`, and `publish-thesis`.
- `app/(faculty)/` contains faculty-only dashboard, request, advisee, thesis approval, handled thesis, and settings pages.
- `app/(admin)/` contains admin-only dashboard and management pages.
- `actions/` contains Server Actions grouped by domain: `auth`, `common`, `student`, `faculty`, and `admin`.
- `components/` contains shared UI and domain components, including `components/ui` primitives.
- `hooks/` contains client-side state and workflow hooks.
- `utils/` contains service clients, validators, formatting helpers, Cloudinary utilities, and Nodemailer helpers.
- `lib/` contains framework-agnostic utilities such as JWT and password hashing helpers.
- `types/` contains shared TypeScript interfaces.
- `data/` contains static options, demo data, user seed data, and thesis spreadsheets.
- `scripts/` contains database seeders and the Python model export script.
- `public/` contains images, thumbnails, audio, and static assets.
- `store/` contains Zustand state.

## Route And Role Model

The app uses route groups to separate experiences, while `middleware.ts` performs request-level protection.

- Public unauthenticated routes: `/auth/login`, `/auth/forgot-password`
- Shared authenticated routes: `/`, `/advisers`, `/bookmarks`, `/profile/[userId]`
- Student routes: `/find-adviser`, `/my-requests`, `/publish-thesis`
- Faculty routes: `/faculty/dashboard`, `/faculty/advisory-requests`, `/faculty/advisees`, `/faculty/thesis-approval`, `/faculty/handled-thesis`, `/faculty/settings`
- Admin routes: `/admin/dashboard`, `/admin/manage-users`, `/admin/manage-theses`, `/admin/manage-advisees`, `/admin/backup`, `/admin/retrain-model`, `/admin/settings`

Access control is layered:

- `middleware.ts` redirects unauthenticated users away from protected pages.
- `middleware.ts` redirects authenticated users away from auth pages.
- Student-only pages are blocked for faculty and admin users.
- Student workflow gates check adviser assignment, published thesis state, and upload authorization.
- Faculty and admin layouts perform role checks with `getCurrentUser()` and redirect non-matching users.

## Authentication And Sessions

Archivia does not use Supabase Auth directly for sign-in. Login is handled by `actions/auth/login.ts`:

1. The submitted user ID and password are sanitized.
2. The matching user is fetched from the Supabase `users` table.
3. The password is compared with `bcryptjs`.
4. A session record is tracked through `actions/auth/sessions.ts`.
5. A JWT is signed with `JWT_SECRET`.
6. The token is stored in an HTTP-only `session` cookie.
7. Users are redirected based on role.

JWT helpers live in `lib/jwt.ts`; password helpers live in `lib/hash.ts`.

## Data Flow

Most business operations are implemented as Server Actions:

- `actions/auth/*` handles login, logout, session lookup, OTP, password reset, and password changes.
- `actions/common/*` handles theses, bookmarks, filters, and semantic search.
- `actions/student/*` handles student profile data, adviser recommendations, adviser requests, thesis submission, and upload authorization checks.
- `actions/faculty/*` handles advisory requests, referrals, accepted advisees, upload authorization, thesis approval/return, and faculty dashboard counts.
- `actions/admin/*` handles dashboard stats, user management, thesis management, adviser limits, advisee removals, and admin analytics.

Server-side Supabase access uses `utils/supabase/server.ts`. Browser-side Supabase access uses `utils/supabase/client.ts`. Seed scripts use `utils/supabase/seedClient.ts` with the service role key.

## External ML Services

Two application features depend on local HTTP services outside this Next.js repo:

- Adviser recommendations: `actions/student/getRecommendedAdvisers.ts` posts to `http://localhost:8000/recommend`.
- Semantic thesis search: `actions/common/semanticSearchTheses.ts` queries `http://localhost:8001/search`.

Those services must be running for the recommendation and semantic search flows to work locally. The code contains commented Railway URLs that indicate previous deployment targets, but the active implementation points to localhost.

## File Uploads

Thesis files are uploaded through `app/api/upload-thesis/route.ts`.

- Uploads use Cloudinary `resource_type: "raw"`.
- Files are stored under the `archivia/theses` folder.
- The route returns the Cloudinary `secure_url` and `public_id`.

File deletion is handled by `app/api/delete-thesis/route.ts`, which destroys the Cloudinary raw resource by `public_id`.

## Email Notifications

Email transport is configured in `utils/nodemailer/transporter.ts` with Gmail credentials. Domain-specific email helpers live in `utils/nodemailer/`, including OTP, adviser request, referral, upload authorization, returned/reserved student, accepted student, and thesis approval messages.

## Environment Variables

Create `.env.local` with the following keys. Do not commit real secret values.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

EMAIL_USER=
EMAIL_PASS=

NEXT_PUBLIC_ZUSTAND_SECRET_KEY=
```

Important: `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is currently used by seed scripts, but the `NEXT_PUBLIC_` prefix means the value can be exposed to client bundles if imported in client code. Treat this key as highly sensitive and keep its usage server/script-only.

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Recommended local services:

```text
http://localhost:8000/recommend  adviser recommendation service
http://localhost:8001/search     semantic thesis search service
```

Build for production:

```bash
npm run build
npm run start
```

Run linting:

```bash
npm run lint
```

Note: `package.json` currently uses `next lint`, which is deprecated/removed in newer Next.js versions. If linting fails because of the command rather than code issues, migrate the script to the ESLint CLI.

## Seeding Data

Seed users from `data/users.ts`:

```bash
npx tsx scripts/seed.ts
```

Seed theses from `data/theses.xlsx`:

```bash
npx tsx scripts/seedThesis.ts
```

There is also `scripts/seedNewThesis.ts` for the alternate spreadsheet `data/new_theses.xlsx`.

Seeding requires Supabase service-role access through `utils/supabase/seedClient.ts`.

## Model Retraining Export

The admin retrain page calls `app/api/retrain-model/route.ts`, which executes:

```text
scripts/retrain_export.py
```

The route expects Python to be available as `python3`, writes:

```text
scripts/adviser_prediction_model.pkl
```

and returns that pickle file as a download.

On Windows, confirm that `python3` is available in the environment used by Next.js. If only `python` is available, update the route command or add the proper Python launcher alias.

## Path Aliases

The project uses the `@/*` alias for root-relative imports, configured in `tsconfig.json`:

```ts
import { createClient } from "@/utils/supabase/server";
```

Prefer this alias for cross-folder imports.

## Development Conventions

- Keep domain mutations in `actions/<domain>/`.
- Keep route-specific UI close to the route under `app/...`.
- Keep reusable UI in `components/`.
- Keep service setup in `utils/<service>/`.
- Use typed domain objects from `types/` instead of repeating loose object shapes.
- Use Server Actions for Supabase reads/writes that require session checks.
- Use API routes for browser file uploads, raw HTTP integrations, and streaming/download responses.
- Do not expose service-role credentials or privileged operations in client components.
- Preserve the role and workflow gates in both middleware and layouts when adding routes.

## Production Notes

- Set `JWT_SECRET` to a strong unique value. The fallback in `lib/jwt.ts` is only suitable for local development.
- Configure Cloudinary credentials for raw file upload/delete support.
- Configure Gmail app password or production SMTP credentials for Nodemailer.
- Deploy the recommendation and semantic search services, then update their URLs in the relevant Server Actions.
- Review Supabase Row Level Security policies so browser-side Supabase access is appropriately constrained.
- Avoid exposing the service role key with a `NEXT_PUBLIC_` prefix in production code paths.

