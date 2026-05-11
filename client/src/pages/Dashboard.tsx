import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
  const [token, setToken] = useState('');
  const [connectError, setConnectError] = useState('');
  const [loading, setLoading] = useState(true);

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
        // GitHub not connected yet — show connect form
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleConnect(e: FormEvent) {
    e.preventDefault();
    setConnectError('');
    try {
      await api.post('/github/connect', { accessToken: token });
      const [profileRes, reposRes] = await Promise.all([
        api.get('/github/profile'),
        api.get('/github/repos'),
      ]);
      setProfile(profileRes.data);
      setRepos(reposRes.data);
      setToken('');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response: { data: { error: string } } }).response;
        setConnectError(res.data.error ?? 'Failed to connect');
      } else {
        setConnectError('Failed to connect');
      }
    }
  }

  async function handleLogout() {
    await api.post('/auth/logout').catch(() => {});
    navigate('/login');
  }

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DevMetrics</h1>
        <button onClick={handleLogout} className="logout-btn">Log out</button>
      </header>

      {!profile ? (
        <div className="connect-section">
          <h2>Connect your GitHub account</h2>
          <p>Generate a <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">personal access token</a> with <code>repo</code> and <code>read:user</code> scopes.</p>
          <form onSubmit={handleConnect} className="connect-form">
            {connectError && <p className="error">{connectError}</p>}
            <input
              type="password"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <button type="submit">Connect</button>
          </form>
        </div>
      ) : (
        <>
          <div className="profile-card">
            <img src={profile.avatarUrl} alt={profile.login} className="avatar" />
            <div>
              <h2>{profile.name ?? profile.login}</h2>
              <p className="login">@{profile.login}</p>
              {profile.bio && <p className="bio">{profile.bio}</p>}
              <div className="stats">
                <span><strong>{profile.publicRepos}</strong> repos</span>
                <span><strong>{profile.followers}</strong> followers</span>
                <span><strong>{profile.following}</strong> following</span>
              </div>
            </div>
          </div>

          <div className="repos-section">
            <h2>Repositories</h2>
            <ul className="repo-list">
              {repos.map((repo) => (
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
