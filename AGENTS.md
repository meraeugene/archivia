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

- `app/` is the App Router surface.
- `app/(root)/` is the shared authenticated user experience.
- `app/(student)/` is for student-only flows.
- `app/(faculty)/` is for faculty-only flows.
- `app/(admin)/` is for admin-only flows.
- `app/auth/` is for login and forgot-password pages.
- `app/api/upload-thesis/route.ts` uploads thesis files to Cloudinary.
- `app/api/delete-thesis/route.ts` deletes Cloudinary raw files.
- `app/api/retrain-model/route.ts` runs the Python model export and returns a pickle file.
- `actions/` contains Server Actions grouped by domain.
- `components/` contains reusable and shared UI.
- `components/ui/` contains shadcn/Radix-style primitives.
- `hooks/` contains client workflow hooks.
- `utils/` contains service clients, validators, formatting helpers, email helpers, and upload helpers.
- `lib/` contains framework-agnostic helpers such as JWT and hashing.
- `types/` contains shared domain interfaces.
- `data/` contains static options, seed users, adviser names, and spreadsheets.
- `scripts/` contains seeders and model export assets.
- `store/` contains Zustand state.

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

