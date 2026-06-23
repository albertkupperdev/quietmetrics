# QuietMetrics

A full-stack developer dashboard that connects to the GitHub API and displays repository metrics and profile stats. Built as a portfolio project to demonstrate end-to-end web development skills.

## Features

- GitHub OAuth login — connect your account in one click, no manual tokens
- JWT authentication with secure httpOnly cookies
- Live stats pushed over Socket.IO — no client-side polling
- Repository list with language, stars, and fork counts
- GitHub profile display (avatar, bio, follower stats)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | GitHub OAuth, JWT in httpOnly cookies |
| Real-time | Socket.IO |
| GitHub | GitHub REST API via Octokit |

## Project Structure

```
quietmetrics/
├── client/       # React + Vite frontend
└── server/       # Express + Prisma backend
```

## Running Locally

**Prerequisites:** Node.js 18+, PostgreSQL

**1. Clone the repo**
```bash
git clone https://github.com/albertkupperdev/quietmetrics.git
cd quietmetrics
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure the backend**

Create a GitHub OAuth App at https://github.com/settings/developers with callback URL `http://localhost:3000/auth/github/callback`, then create `server/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/devmetrics"
JWT_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-oauth-app-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-app-client-secret"
PORT=3000
```

**4. Run database migrations**
```bash
cd server && npx prisma migrate deploy
```

**5. Start both servers**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
