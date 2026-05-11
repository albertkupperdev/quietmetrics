# DevMetrics Dashboard — Claude Context

## Project Goal
A full-stack portfolio app that connects to the GitHub API, shows repository and user metrics, and includes JWT-based authentication. Built step by step with a senior developer mentor approach — every decision should be explainable in a job interview.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT stored in httpOnly cookies |
| GitHub | GitHub REST API via Octokit |
| HTTP | Axios or fetch |
| Config | dotenv |

## Folder Structure
```
devmetrics/
├── client/          # React + Vite frontend
│   └── src/
│       └── App.tsx  # Entry point (default scaffold only so far)
├── server/          # Node + Express backend
│   ├── src/
│   │   └── index.ts # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env         # DATABASE_URL and secrets (gitignored)
└── CLAUDE.md
```

## What's Been Done
- [x] Defined scope and architecture
- [x] Scaffolded client (React + Vite + TypeScript)
- [x] Scaffolded server (Express + TypeScript + tsx)
- [x] Installed server dependencies: express, cors, cookie-parser, dotenv, jsonwebtoken, octokit, prisma
- [x] Set up Prisma with PostgreSQL
- [x] Defined database schema (User, GitHubAccount, Repository models)
- [x] Ran initial migration (`20260505194309_init`)
- [x] Basic Express server running on port 3000 with /health endpoint
- [x] CORS configured for localhost:5173 (Vite default)
- [x] Initial git commit pushed

## What's Next
- [x] Auth routes: POST /auth/register and POST /auth/login
- [x] Auth middleware (verify JWT from cookie)
- [x] GitHub routes: POST /github/connect, GET /github/profile, GET /github/repos
- [x] Frontend: login/register pages
- [x] Frontend: protected dashboard page
- [x] Frontend: repo list and stats display

## Database Schema (current)
- **User**: id, email, passwordHash, createdAt
- **GitHubAccount**: id, githubId, login, accessToken, userId (one-to-one with User)
- **Repository**: id, githubId, name, fullName, private, githubAccountId

## Architecture Decisions (interview-ready)
- JWT in httpOnly cookie — protects against XSS; localStorage is a common junior mistake
- GitHub API called from backend — hides logic from client, easier to handle rate limits
- Service layer pattern — keeps routes thin and logic testable
- Prisma over raw SQL — type-safe, readable, industry standard for Node.js

## Working Style
- Build step by step, stop and confirm after each step
- Explain every decision — this is a learning project
- No overengineering, no magic shortcuts
- Clean commits with clear messages
- Prisma client import path is `'../generated/prisma/client'` (no index.ts in generated dir)
