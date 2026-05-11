import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import StatsBar from '../components/StatsBar';
import LanguageChart from '../components/LanguageChart';
import TopReposChart from '../components/TopReposChart';
import { ProfileSkeleton, StatsSkeleton, RepoSkeleton } from '../components/Skeleton';

interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  following: number;
}

interface Repo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string | null;
  url: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'updated' | 'stars' | 'forks'>('updated');

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, reposRes] = await Promise.all([
          api.get('/github/profile'),
          api.get('/github/repos'),
        ]);
        setProfile(profileRes.data);
        setRepos(reposRes.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  async function handleLogout() {
    await api.post('/auth/logout').catch(() => {});
    navigate('/');
  }

  const filteredRepos = repos
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'stars') return b.stars - a.stars;
      if (sort === 'forks') return b.forks - a.forks;
      return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
    });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DevMetrics</h1>
        <button onClick={handleLogout} className="logout-btn">Log out</button>
      </header>

      {loading ? (
        <>
          <ProfileSkeleton />
          <StatsSkeleton />
          <div className="repo-list">
            {[1, 2, 3].map((i) => <RepoSkeleton key={i} />)}
          </div>
        </>
      ) : profile && (
        <>
          <div className="profile-card">
            <img src={profile.avatarUrl} alt={profile.login} className="avatar" />
            <div className="profile-info">
              <h2>{profile.name ?? profile.login}</h2>
              <p className="login">@{profile.login}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
              <div className="profile-stats">
                <span><strong>{profile.publicRepos}</strong> repos</span>
                <span><strong>{profile.followers}</strong> followers</span>
                <span><strong>{profile.following}</strong> following</span>
              </div>
            </div>
          </div>

          <StatsBar publicRepos={profile.publicRepos} repos={repos} />

          <div className="charts-grid">
            <LanguageChart repos={repos} />
            <TopReposChart repos={repos} />
          </div>

          <div className="repos-section">
            <div className="repos-toolbar">
              <h2>Repositories <span className="repo-count">{filteredRepos.length}</span></h2>
              <div className="repos-controls">
                <input
                  type="text"
                  placeholder="Search repos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="sort-select">
                  <option value="updated">Recently updated</option>
                  <option value="stars">Most stars</option>
                  <option value="forks">Most forks</option>
                </select>
              </div>
            </div>

            {filteredRepos.length === 0 ? (
              <p className="empty">No repositories match your search.</p>
            ) : (
              <ul className="repo-list">
                {filteredRepos.map((repo) => (
                  <li key={repo.id} className="repo-card">
                    <div className="repo-header">
                      <a href={repo.url} target="_blank" rel="noreferrer" className="repo-name">
                        {repo.name}
                      </a>
                      <span className={`badge ${repo.private ? 'private' : 'public'}`}>
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                    {repo.description && <p className="repo-desc">{repo.description}</p>}
                    <div className="repo-meta">
                      {repo.language && <span className="language">{repo.language}</span>}
                      <span>★ {repo.stars}</span>
                      <span>⑂ {repo.forks}</span>
                      {repo.updatedAt && (
                        <span className="updated">
                          Updated {new Date(repo.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
