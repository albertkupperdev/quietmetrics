import { Octokit } from 'octokit';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

function octokit(accessToken: string) {
  return new Octokit({ auth: accessToken });
}

export async function connectGitHub(userId: number, accessToken: string) {
  const kit = octokit(accessToken);
  const { data } = await kit.rest.users.getAuthenticated();

  await prisma.gitHubAccount.upsert({
    where: { userId },
    update: { accessToken, githubId: data.id, login: data.login },
    create: { accessToken, githubId: data.id, login: data.login, userId },
  });

  return { login: data.login, avatarUrl: data.avatar_url };
}

export async function getGitHubProfile(userId: number) {
  const account = await prisma.gitHubAccount.findUnique({ where: { userId } });
  if (!account) throw new Error('No GitHub account connected');

  const { data } = await octokit(account.accessToken).rest.users.getAuthenticated();

  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

export async function getGitHubRepos(userId: number) {
  const account = await prisma.gitHubAccount.findUnique({ where: { userId } });
  if (!account) throw new Error('No GitHub account connected');

  const { data } = await octokit(account.accessToken).rest.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 30,
  });

  return data.map((repo: (typeof data)[number]) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    description: repo.description,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    updatedAt: repo.updated_at,
    url: repo.html_url,
  }));
}
