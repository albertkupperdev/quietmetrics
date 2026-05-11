import { Octokit } from '@octokit/rest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOctokit(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  return { kit: new Octokit({ auth: user.accessToken }), login: user.login };
}

export async function getGitHubProfile(userId: number) {
  const { kit } = await getOctokit(userId);
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
  const { kit } = await getOctokit(userId);
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

export async function getActivityMetrics(userId: number) {
  const { kit, login } = await getOctokit(userId);

  const reposRes = await kit.rest.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 10 });
  const since = new Date();
  since.setDate(since.getDate() - 84);

  const weekStart = (weeksAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - weeksAgo * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const weeklyTotals: number[] = new Array(12).fill(0);

  await Promise.all(
    reposRes.data.map(async (repo) => {
      try {
        const { data: commits } = await kit.rest.repos.listCommits({
          owner: repo.owner.login,
          repo: repo.name,
          author: login,
          since: since.toISOString(),
          per_page: 100,
        });
        for (const commit of commits) {
          const commitDate = new Date(commit.commit.author?.date ?? '');
          for (let w = 0; w < 12; w++) {
            const start = weekStart(11 - w);
            const end = weekStart(10 - w);
            if (commitDate >= start && commitDate < end) {
              weeklyTotals[w]++;
              break;
            }
          }
        }
      } catch {}
    })
  );

  const commitCadence = weeklyTotals.map((total, i) => ({
    week: weekStart(11 - i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    commits: total,
  }));

  const prsRes = await kit.rest.search.issuesAndPullRequests({
    q: `author:${login} type:pr is:merged`,
    sort: 'updated',
    per_page: 20,
  });

  const cycleTimes: number[] = [];
  const reviewLatencies: number[] = [];

  await Promise.all(
    prsRes.data.items.map(async (pr) => {
      if (!pr.pull_request?.merged_at || !pr.created_at) return;

      const created = new Date(pr.created_at).getTime();
      const merged = new Date(pr.pull_request.merged_at).getTime();
      cycleTimes.push((merged - created) / (1000 * 60 * 60));

      const match = pr.repository_url.match(/repos\/(.+?)\/(.+)$/);
      if (!match) return;
      const [, owner, repo] = match;

      try {
        const { data: reviews } = await kit.rest.pulls.listReviews({
          owner,
          repo,
          pull_number: pr.number,
        });
        if (reviews.length > 0 && reviews[0].submitted_at) {
          const firstReview = new Date(reviews[0].submitted_at).getTime();
          reviewLatencies.push((firstReview - created) / (1000 * 60 * 60));
        }
      } catch {}
    })
  );

  const avg = (arr: number[]) =>
    arr.length === 0 ? null : Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  return {
    commitCadence,
    avgCycleTimeHours: avg(cycleTimes),
    avgReviewLatencyHours: avg(reviewLatencies),
  };
}
