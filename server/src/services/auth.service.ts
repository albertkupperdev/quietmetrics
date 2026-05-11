import jwt from 'jsonwebtoken';
import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(data.error ?? 'Failed to exchange code for token');
  return data.access_token;
}

export async function upsertUser(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.rest.users.getAuthenticated();

  const user = await prisma.user.upsert({
    where: { githubId: data.id },
    update: { accessToken, login: data.login, name: data.name ?? null, avatarUrl: data.avatar_url },
    create: { githubId: data.id, login: data.login, name: data.name ?? null, avatarUrl: data.avatar_url, accessToken },
  });

  return user;
}

export function createJwt(userId: number): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });
}
