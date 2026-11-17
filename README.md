# Campaign Studio

A SaaS application for planning, launching, and tracking campaigns.

This repo is a monorepo with two independent projects:

- `frontend/` — React (Vite, JavaScript) app
- `backend/` — Node.js (Express) API
- `docs/` — project documentation

Each project has its own `package.json`, `node_modules`, and lockfile — there is nothing shared at the repo root.

## Prerequisites

- Node.js 18+ and npm

## Setup

Install dependencies for each project separately:

```bash
cd frontend && npm install
cd backend && npm install
```

## Running the app

Run the frontend and backend in separate terminals:

```bash
cd frontend && npm run dev   # Vite dev server
```

```bash
cd backend && npm run dev    # Express server with nodemon
```

- Frontend: <http://localhost:5173>
- Backend health check: <http://localhost:5000/api/health>

## Linting

Each project uses ESLint independently:

```bash
cd frontend && npm run lint
cd backend && npm run lint
```

## Project structure

```text
campaign-studio/
├── frontend/   # React + Vite app
├── backend/    # Express API
└── docs/       # Documentation
```

## Notes

This is the initial scaffold: a welcome page on the frontend and a single health-check endpoint on the backend. Authentication, database, AI, and payment features are intentionally not included yet.
