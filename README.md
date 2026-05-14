# qa-ai-challenge

Scaffold for the Storyful Senior QA Automation (AI-First) hiring challenge.

This repo contains a small, intentionally-imperfect "Content Verification Workbench" — an Nx monorepo with an Express API and a React + Vite web app. **You will not modify the application.** Your task is to build a Playwright e2e project and an evaluator library around it.

## Prerequisites

- Node 20 or later
- npm 10+ (ships with Node 20)
- Ports `3333` (API) and `4200` (web) free

## Setup

```bash
npm install
```

That's it.

## Run

Both apps in one command:

```bash
npm run dev
```

Or one at a time, in separate terminals:

```bash
npm run dev:api    # http://localhost:3333
npm run dev:web    # http://localhost:4200
```

Smoke-check the API (in another terminal while it's running):

```bash
npm run smoke
```

## Project structure

```
qa-ai-challenge/
├── apps/
│   ├── verification-api/         Express API (port 3333)
│   │   └── src/{main,state,lib/{classifier,serializers},routes/*}.ts
│   └── verification-web/         React + Vite UI (port 4200)
│       └── src/{App,api,main}.tsx + styles.css
├── libs/
│   ├── shared/                   Shared TS types
│   └── test-data/                Golden dataset loader + JSON
├── scripts/smoke.mjs             Tiny health-check script
├── nx.json
├── tsconfig.base.json
└── package.json
```

## Nx commands

```bash
npx nx serve verification-api
npx nx serve verification-web
npx nx build verification-api
npx nx build verification-web
npx nx run-many --target=serve --parallel=2
```

## API surface (port 3333)

| Method | Path                | Auth      | Notes                                     |
| ------ | ------------------- | --------- | ----------------------------------------- |
| GET    | `/health`           | Public    | Liveness                                  |
| POST   | `/api/analyze`      | Required  | Body: `{ input: string }` → analysis      |
| GET    | `/api/history`      | Required  | `?limit=N` (default 10)                   |
| GET    | `/api/result/:id`   | Required  | Single analysis or 404                    |
| POST   | `/api/reset`        | Required  | Clears state                              |

Protected endpoints expect a bearer token:

```
Authorization: Bearer <token>
```

A 401 response is returned when the header is missing or the token is invalid.

## Authentication

The web app gates access behind a sign-in screen. There are two hardcoded users:

| Username   | Password      |
| ---------- | ------------- |
| `qa-tester`| `password123` |
| `admin`    | `admin123`    |

There is **no** `POST /api/auth/login` endpoint. Login is handled client-side — the UI maps each user to a long-lived bearer token and persists it in the browser after sign-in. Use the **Log out** button in the header to clear the session.

### Getting a token for API tests

Your API tests do **not** call any login endpoint. Sign in once via the UI, then extract the token from the browser and pass it to your test suite (e.g. as an env var):

```bash
export AUTH_TOKEN=<token-you-pulled-from-the-browser>
```

Then attach it to every request your tests make:

```
Authorization: Bearer ${AUTH_TOKEN}
```

How you locate the token is part of the exercise.

## Resetting local state

State is in-memory. Either `POST /api/reset` or restart `dev:api`.
