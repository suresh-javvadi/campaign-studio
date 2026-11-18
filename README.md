# Campaign Studio

A platform for personalizing political posters: browse a gallery of poster templates,
log in, replace the designated photo and text fields with your own, and download a
print-ready PNG. English and Telugu text are both supported.

This repo is a monorepo with two independent projects:

- `frontend/` — React (Vite, JavaScript) app
- `backend/` — Node.js (Express/Prisma/PostgreSQL) API
- `docs/` — project documentation

Each project has its own `package.json`, `node_modules`, and lockfile — there is nothing shared at the repo root.

## Prerequisites

- Node.js 18+ and npm
- A running PostgreSQL instance

## Setup

Install dependencies for each project separately:

```bash
cd frontend && npm install
cd backend && npm install
```

Copy each project's `.env.example` to `.env` and fill in the values (see
[backend/.env.example](backend/.env.example) for `DATABASE_URL`, `JWT_SECRET`, and
`FRONTEND_URL`). Then set up the database and seed the poster templates:

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
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

Authentication (email/password, JWT in an httpOnly cookie) and the poster template
system are implemented. Downloads always carry a watermark for now — paid
watermark-free downloads are not implemented yet, nor is an admin UI for authoring
new templates (new templates are added via `backend/prisma/seed.js`).
