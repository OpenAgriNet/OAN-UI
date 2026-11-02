---
# React + TanStack Router Starter

Opinionated React starter using **Vite**, **TanStack Router (File Routes)**, **TanStack Query**, **shadcn/ui**, **Tailwind CSS v4**, **Zustand**, and **Bun**.

This project is designed for **large, scalable admin dashboards** with strict structure, routing discipline, and reusable screen patterns.
---

## Prerequisites

### Node.js (Docker and CI)

Docker builds and GitHub Actions use **Node.js 26**. Use the same major version
for local npm builds; the Bun workflow below remains available.

### Bun (required)

This project uses **Bun** as both the package manager and runtime.

#### Install Bun

**macOS / Linux**

```bash
curl -fsSL https://bun.sh/install | bash
```

Restart your terminal and verify:

```bash
bun --version
```

**Windows**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

Restart PowerShell and verify:

```powershell
bun --version
```

---

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create `.env.local`:

```env
VITE_API_BASE_URL=https://<your-supabase>.supabase.co
VITE_API_KEY=<your-supabase-anon-key>
MODE=development
```

### 3. Run development server

```bash
bun dev
```

### 4. Build the project

```bash
bun run build
```

---

## AgriStack frontend callback routes

Use this route for browser redirects from AgriStack:

- Callback route: `/callback?from=agristack`

The callback page reads incoming query params and checks backend callback status using:
- `GET /api/callback/status?from=agristack&callbackSessionId=<id>`

Then it redirects the user to `/chat`.

---

## Production CSP

The UI container and the deployment proxy
([chat-vistaar-da.gov.in.conf](../chat-vistaar-da.gov.in.conf)) must be deployed
together. Both policies block inline JavaScript, eval-like execution, and
unauthorized inline CSS. API policies are independent and unchanged.

- Use the supplied [Nginx configuration](./nginx.conf) to serve production builds.
  Nginx must have OpenSSL and `http_sub_module` enabled (`nginx -V`).
  It replaces `__CSP_NONCE__` in the HTML with its per-response, random 128-bit
  `$request_id`. The CSP header and HTML must contain the same nonce.
- The proxy uses the **upstream response** `X-CSP-Nonce` to construct its style
  policy, then hides that header. Never use a client-supplied header or a static
  nonce. Keep the UI upstream private/trusted.
- HTML is `Cache-Control: no-store`; conditional HTML requests return a fresh
  `200`, not `304`. Do not cache HTML at a CDN, service worker, or another proxy.
  Purge previously cached HTML during deployment. Static asset caching is unchanged.
- Radix's runtime styles use the nonce. Sonner 2.0.7's fixed stylesheet is allowed
  by its SHA-256 hash; `test:csp` detects when an upgrade requires updating that
  hash in both Nginx configurations.
- Sonner's initially empty style element can emit a CSP warning.
  Sonner's populated stylesheet must be active via its hash. Do not weaken the
  policy to suppress this warning; investigate other script/style violations.
- Static animation and announcement-ticker CSS lives in the external stylesheet.
  Lottie uses its light
  (no-expression) player; the dot loader's shared rotation was baked into matching
  keyframes. Do not introduce animation expressions that need `eval`.
- React's direct DOM style-property updates still work; injected HTML `style`
  attributes and unapproved `<style>` elements are blocked.
- Browsers and WebViews use the same partner `frame-ancestors` allowlist.
  `X-Frame-Options: SAMEORIGIN` protects older clients without CSP support; those
  older clients cannot embed the UI cross-origin. Top-level WebViews still work.
- Development uses `bun dev` without nonce enforcement. `vite preview` alone
  cannot serve a production build because it does not substitute the nonce.
  Browser-native `crypto.randomUUID()` requires HTTPS (or localhost).

### Checks and rollout

From this directory, with the deployment proxy configuration present one level up:

```bash
bun run test:csp
bun run test:coverage -- src/config/csp.test.ts --coverage.include=src/config/csp.ts
bun run build
```

In staging, validate and deploy this as a paired release: **UI first, then proxy**.
Verify that the UI emits a matching HTML nonce and `X-CSP-Nonce` before updating
the proxy. Updating the proxy first would block styles in the old UI. Run
`nginx -t` in the UI container and on the proxy **with the real includes and
certificates** before reloading either server. Test a new HTML GET (not only HEAD):

```bash
curl -sS -D - -o /dev/null https://chat-vistaar.da.gov.in/chat
curl -sS -A 'BharatVistaar-Mobile' -D - -o /dev/null https://chat-vistaar.da.gov.in/chat
```

Verify a different nonce on each HTML response, matching its HTML meta element,
one CSP header, `no-store`, and `SAMEORIGIN` for both user agents. A conditional
HTML request must still return `200` with a fresh matching nonce; static assets
may return `304`. Check error responses and API headers too: security headers
must survive Nginx `add_header` inheritance and error redirects in the supplied
deployment snippets.

In a browser, check chat, recording, image upload, dialogs, language selection,
scrollbars, notifications, and approved partner embedding for CSP violations.
Unapproved iframe parents, injected inline scripts/styles, and eval-like code
must remain blocked. If rollback is necessary, roll back the proxy before the UI
and track the reopened hardening findings; never silently weaken CSP.

## Project Structure

```text
src/
├─ main.tsx                 # App bootstrap (router + providers)
├─ routes.ts                # Virtual route config
├─ routeTree.gen.ts         # Generated – DO NOT EDIT
├─ pages/                   # File-based routes
│  ├─ auth/                 # Login / forgot password
│  ├─ middlewares/          # Route guards
│  ├─ app/(_authenticated)/ # Protected area
│  ├─ error/                # Error pages
│  └─ public/               # Public pages
├─ components/
│  ├─ ui/                   # shadcn primitives
│  └─ screens-component/    # Screen-level UI (web/mobile)
├─ hooks/
│  ├─ apis/                 # TanStack Query APIs
│  └─ store/                # Zustand stores
├─ layouts/                 # App shell layouts
├─ config/                  # env + request wrapper
├─ lib/utils/               # Utilities
└─ styles/                  # Tailwind + theme tokens
```

---

## Routing System

- Uses **TanStack Router + virtual routes**
- Routes defined in `src/routes.ts`
- Generated tree in `routeTree.gen.ts` (do not edit)

### Middlewares

| Middleware            | Purpose                                 |
| --------------------- | --------------------------------------- |
| restrict-login-signup | Prevent logged-in users from auth pages |
| authenticate          | Protects authenticated routes           |
| require-admin         | Admin-only routes                       |

### Protected Layout

```text
src/pages/app/(_authenticated)/layout.tsx
```

Wraps sidebar + header + `<Outlet />`.

---

## API Layer

- All API calls go through `request()` from:

  ```ts
  src / config / request.ts;
  ```

- Automatically injects:
  - `apikey`
  - `Authorization`
  - handles expiry + logout

- Use **TanStack Query** for all data fetching.

---

## Screen Scaffolding (Highly Recommended)

To keep routing, screens, and APIs consistent, this project includes a **screen scaffolding script**.

### Script Location

```text
/scripts/scaffold-screen.ts
```

### Register Script

Add to `package.json`:

```json
{
	"scripts": {
		"new:screen": "bun scripts/scaffold-screen.ts"
	}
}
```

---

## What the Script Generates

### Screen UI

```text
src/components/screens-component/<screen-name>/
├─ components/
│  └─ index.ts
├─ web-layout/
│  └─ index.tsx
├─ mob-layout/
│  └─ index.tsx
└─ index.ts
```

### Page Route (unless --no-pages)

```text
src/pages/<parent>/<screen-name>/
├─ index.tsx
└─ routes.ts
```

### API Layer (with --api)

```text
src/hooks/apis/<screen-name>/
├─ queries.ts
├─ mutations.ts
├─ type.ts
└─ index.ts
```

Also auto-updates:

```ts
src / hooks / apis / index.ts;
```

```ts
export * from "./<screen-name>";
```

---

## Screen Script Usage

### Basic screen

```bash
bun run new:screen netskill-lp-modules
```

### Screen with API hooks

```bash
bun run new:screen assessment-performance-report --api
```

### Create under authenticated area

```bash
bun run new:screen my-screen --parent=app/(_authenticated)
```

### Create under reports

IMPORTANT: zsh requires escaping parentheses.

```bash
bun run new:screen learning-path-report --api --parent=app/\(_authenticated\)/reports
```

### Create under settings

```bash
bun run new:screen platform-customization --parent=app/\(_authenticated\)/settings
```

### Skip page creation (UI only)

```bash
bun run new:screen my-shared-screen --no-pages
```

### Force overwrite existing files

```bash
bun run new:screen my-screen --force
```

### Combine flags

```bash
bun run new:screen completion-ratio \
  --api \
  --force \
  --parent=app/\(_authenticated\)/reports
```

---

## zsh Users: IMPORTANT

zsh treats parentheses as glob patterns.

Always escape or quote paths containing:

```text
(_authenticated)
```

Correct examples:

```bash
--parent=app/\(_authenticated\)/reports
```

or

```bash
--parent="app/(_authenticated)/reports"
```

---

## Generated Page Pattern

```tsx
import { ScreenWebLayout } from "@/components/screens-component/screen/web-layout";
import { ScreenMobileLayout } from "@/components/screens-component/screen/mob-layout";
import { useIsMobile } from "@/hooks/use-mobile";

function Screen() {
	const isMobile = useIsMobile();
	return isMobile ? <ScreenMobileLayout /> : <ScreenWebLayout />;
}

export default Screen;
```

---

## Scripts Reference

| Command            | Description              |
| ------------------ | ------------------------ |
| bun dev            | Start dev server         |
| bun run build      | Typecheck + build        |
| bun preview        | Preview production build |
| bun lint           | Run ESLint               |
| bun run lint:fix   | Auto-fix lint            |
| bun run typecheck  | TypeScript check         |
| bun run new:screen | Scaffold new screen      |

---

## Rules & Best Practices

- Do not edit `routeTree.gen.ts`
- Always use the screen scaffold script
- Screens live in `screens-component`
- Pages are thin route wrappers only
- APIs must live under `hooks/apis`
- Prefer query + mutation hooks
- Do not place logic inside layouts

---
