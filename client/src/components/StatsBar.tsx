interface Repo {
  stars: number;
  forks: number;
  language: string | null;
}

interface Props {
  publicRepos: number;
  repos: Repo[];
}

export default function StatsBar({ publicRepos, repos }: Props) {
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks, 0);

  const langCount: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
  }
  const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">{publicRepos}</span>
        <span className="stat-label">Public Repos</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{totalStars}</span>
        <span className="stat-label">Total Stars</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{totalForks}</span>
        <span className="stat-label">Total Forks</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{topLang}</span>
        <span className="stat-label">Top Language</span>
      </div>
    </div>
  );
}
