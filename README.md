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

| Method | Path                | Notes                                     |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/health`           | Liveness                                  |
| POST   | `/api/analyze`      | Body: `{ input: string }` → analysis      |
| GET    | `/api/history`      | `?limit=N` (default 10)                   |
| GET    | `/api/result/:id`   | Single analysis or 404                    |
| POST   | `/api/reset`        | Clears state                              |

## Resetting local state

State is in-memory. Either `POST /api/reset` or restart `dev:api`.
