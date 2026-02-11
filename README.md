# BugTracker+ (Monorepo)

BugTracker+ is a Jira-like bug tracking app with role-based access, bug lifecycle management, reporting, and dashboard insights.

## Structure
- `client/` React + Vite frontend
- `server/` Express + MySQL backend

## Quick Start (after installing deps)

### Backend
```
cd server
npm install
npm run dev
```

### Frontend
```
cd client
npm install
npm run dev
```

## Environment
Copy `server/.env.example` to `server/.env` and fill in your values.

## Database
See `server/database/schema.sql` for the MySQL schema.
