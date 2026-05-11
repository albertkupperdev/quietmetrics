import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOctokit(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  return new Octokit({ auth: user.accessToken });
}

export async function getGitHubProfile(userId: number) {
  const kit = await getOctokit(userId);
  const { data } = await kit.rest.users.getAuthenticated();

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
  const kit = await getOctokit(userId);
  const { data } = await kit.rest.repos.listForAuthenticatedUser({
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
