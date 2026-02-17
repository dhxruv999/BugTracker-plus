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

## Local Dev Notes
- `npm run dev` loads `server/.env.development` automatically.
- If you don't have MySQL installed locally, you can run it via Docker:
```
docker run -d --name bugtracker-mysql \
  -e MYSQL_ROOT_PASSWORD=strongrootpassword \
  -e MYSQL_DATABASE=bugtracker_plus \
  -e MYSQL_USER=bugtracker_user \
  -e MYSQL_PASSWORD=bugtracker_user_pass \
  -p 3306:3306 \
  mysql:8
```
Then load the schema:
```
docker exec -i bugtracker-mysql \
  mysql -u bugtracker_user -pbugtracker_user_pass bugtracker_plus \
  < server/database/schema.sql
```

## CI/CD Notes
- Images are tagged as `latest` and `${GIT_SHA}`.
- Deployment defaults to `latest` unless `BACKEND_IMAGE_TAG` and `FRONTEND_IMAGE_TAG` are set in the EC2 `.env`.
