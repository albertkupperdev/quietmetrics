# QuietMetrics

A full-stack developer dashboard that connects to the GitHub API and displays repository metrics and profile stats. Built as a portfolio project to demonstrate end-to-end web development skills.

## Features

- JWT authentication with secure httpOnly cookies
- GitHub account integration via personal access token
- Repository list with language, stars, and fork counts
- GitHub profile display (avatar, bio, follower stats)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT in httpOnly cookies |
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

Create `server/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/devmetrics"
JWT_SECRET="your-secret-key"
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
