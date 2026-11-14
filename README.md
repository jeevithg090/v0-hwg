# TechCollab

**One workspace for freelance projects, tech events and developer communities.**

TechCollab is a role-aware web app for the tech ecosystem. Freelancers browse projects and send proposals,
clients and startups post work and host events, and everyone can chat in community groups and direct
messages. Pick a role at sign-up and the dashboard reshapes itself around it.

> **Status: front-end prototype.** All data is mock data and accounts live in the browser's `localStorage`.
> No backend, payments or real-time server exist yet. See [Roadmap](#roadmap).

## Features

- **Role-based accounts.** Sign up as a _Freelancer_, _Client_ or _Startup_. Navigation, dashboards and allowed
  actions change per role. For example, only clients and startups can post projects or create and manage events.
- **Freelancing marketplace.** Searchable project listings with category and budget filters, proposal submission,
  a freelancer profile with portfolio, and a project-management view for hosts.
- **Events hub.** Discover hackathons, meetups and workshops. Register with ticket types. Hosts get an event
  creation wizard and a management view with attendees, analytics, communications, check-in and settings.
- **Community chat.** Public and private groups, direct messages, emoji reactions, message editing and deletion,
  and group moderation screens.
- **Polished UI.** Light and dark themes, responsive layout down to 375 px, an accessible role picker
  (radio group with arrow-key navigation), labelled icon buttons, inline form validation, toasts, and
  loading, 404 and error states.

## Tech stack

| Area      | Choice                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Framework | [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript               |
| Styling   | Tailwind CSS 3, [shadcn/ui](https://ui.shadcn.com) on Radix UI primitives         |
| Icons     | lucide-react                                                                      |
| Theming   | next-themes                                                                       |
| Toasts    | sonner                                                                            |
| Testing   | Vitest, Testing Library, jsdom                                                    |
| Quality   | ESLint (`next/core-web-vitals` + `next/typescript`), Prettier (+ Tailwind plugin) |

## Architecture

```
Browser
 └─ app/layout.tsx  ── <Providers>: ThemeProvider → UserProvider → Toaster
     ├─ /                     public landing page
     ├─ /auth/*               sign in / sign up / reset (demo)
     ├─ /events/[id]/register public event registration
     └─ /dashboard/*          <RequireAuth> → ChatProvider → sidebar + header shell
          ├─ freelancing/*    marketplace (create-gig is <RequireHost>)
          ├─ events/*         events hub (create & manage are <RequireHost>)
          └─ community/*      chat and group management
```

- **Session state.** `lib/user-context.tsx` holds the signed-in user. It reads and writes `localStorage`
  defensively: corrupt data is discarded and storage errors are swallowed. Pure helpers in `lib/auth.ts` handle
  validation, user creation, storage parsing and safe redirect handling. Passwords are validated but never
  persisted.
- **Route guards.** `components/auth-guard.tsx` sends signed-out visitors to `/auth/signin?next=…` (only
  same-origin paths are honoured) and keeps freelancers out of host-only pages.
- **Chat state.** `lib/chat-context.tsx` is an in-memory store seeded from `lib/mock-chat-data.ts`. All state
  transitions (reactions, edits, membership, DM lookup) are pure functions in `lib/chat-utils.ts`, so a real
  socket or API layer can be dropped in later.
- **Marketplace filtering.** `lib/gigs.ts` implements search, category and budget filtering. Hourly rates are
  deliberately kept out of fixed-price ranges.

## Getting started

Prerequisites: **Node.js 20.9+** and **pnpm 10** (`corepack enable` will pick up the pinned version).

```bash
pnpm install
cp .env.example .env.local   # optional
pnpm dev                     # http://localhost:3000
```

Create an account at `/auth/signup`, or use **Continue with GitHub/Google (demo)** on the sign-in page to get
an instant freelancer session. Sign up as a client or startup to see the host features.

### Environment variables

| Variable               | Required | Description                                                                            |
| ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Public base URL, used for absolute metadata URLs. Defaults to `http://localhost:3000`. |

No secrets are needed to run the app.

## Scripts

| Command             | What it does                             |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the dev server                     |
| `pnpm build`        | Production build (lints and type-checks) |
| `pnpm start`        | Serve the production build               |
| `pnpm lint`         | ESLint                                   |
| `pnpm typecheck`    | `tsc --noEmit`                           |
| `pnpm test`         | Run the Vitest suite once                |
| `pnpm test:watch`   | Vitest in watch mode                     |
| `pnpm format`       | Format with Prettier                     |
| `pnpm format:check` | Check formatting                         |

### Tests

The suite covers the core logic and the critical UI flows:

- `lib/auth.test.ts`: sign-up/sign-in validation, user creation, storage parsing, account lookup, open-redirect protection
- `lib/gigs.test.ts`: search, category and budget filtering, and budget formatting
- `lib/chat-utils.test.ts`: reactions, message updates, membership, DM lookup, typing indicator text
- `lib/user-context.test.tsx`: session restore, corrupt storage, register, logout and sign-in
- `app/auth/auth-pages.test.tsx`: sign-up validation and success, keyboard role selection, sign-in redirects

## Deployment

The app is a standard Next.js project and deploys to [Vercel](https://vercel.com) with no extra
configuration:

1. Import the repository in Vercel. The framework preset is detected automatically and pnpm is picked up from the lockfile.
2. Optionally set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Deploy.

Any Node host works as well: `pnpm build && pnpm start` (set `PORT` to change the port). Basic security
headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in
`next.config.mjs`.

## Project structure

```
app/
  layout.tsx, providers.tsx   root layout, metadata, global providers
  page.tsx                    landing page
  auth/                       auth landing, sign in, sign up, forgot password
  dashboard/                  authenticated area (layout = guard + sidebar shell)
    freelancing/              marketplace, create project, apply, profile
    events/                   events hub, create event, manage event
    community/                chat, group management
  events/[id]/register/       public event registration
  terms/, privacy/            placeholder legal pages
  not-found.tsx, error.tsx    404 and error boundary
components/
  ui/                         shadcn/ui primitives
  app-sidebar.tsx, dashboard-header.tsx, header.tsx
  auth-guard.tsx, role-selector.tsx, password-input.tsx, ...
hooks/                        use-mobile, use-tab-param (?tab= deep links)
lib/
  auth.ts                     auth domain logic (pure)
  user-context.tsx            session provider
  chat-*.ts(x), mock-chat-data.ts
  gigs.ts                     marketplace filtering
```

## Roadmap

- Real authentication (e.g. Auth.js or a hosted provider) and a database-backed API in place of `localStorage` and mock data
- Real-time chat transport (WebSocket or a hosted service) behind the existing `ChatProvider` interface
- Pages for the sidebar's planned sections: Network, Analytics, Earnings, Reviews, Notifications, Settings
- Persisting created projects, events, proposals and registrations
