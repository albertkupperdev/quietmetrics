export const DEMO_GITHUB_ID = -1;

export const demoProfile = {
  login: 'demo-dev',
  name: 'Demo Developer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/0?v=4',
  bio: 'Exploring QuietMetrics in demo mode — this data is staged, not live.',
  publicRepos: 28,
  followers: 412,
  following: 87,
};

const LANGUAGES = ['TypeScript', 'Python', 'Go', 'Rust', 'JavaScript', 'C++', 'Ruby'];

function repo(
  id: number,
  name: string,
  language: string,
  stars: number,
  forks: number,
  description: string,
  daysAgo: number
) {
  const updatedAt = new Date(Date.now() - daysAgo * 86_400_000).toISOString();
  return {
    id,
    name,
    fullName: `demo-dev/${name}`,
    private: false,
    description,
    stars,
    forks,
    language,
    updatedAt,
    url: `https://github.com/demo-dev/${name}`,
  };
}

export const demoRepos = [
  repo(1, 'streamline', 'TypeScript', 2840, 312, 'Reactive data pipelines for real-time dashboards', 0),
  repo(2, 'forge-cli', 'Rust', 1920, 198, 'A fast scaffolding CLI for monorepos', 1),
  repo(3, 'pulse-metrics', 'Go', 1540, 145, 'Lightweight metrics collector with a tiny footprint', 1),
  repo(4, 'vector-store', 'Python', 1310, 167, 'Embeddings-first vector database for small teams', 2),
  repo(5, 'lattice-ui', 'TypeScript', 980, 88, 'Headless component primitives for design systems', 2),
  repo(6, 'edge-cache', 'Rust', 870, 76, 'Distributed edge caching layer', 3),
  repo(7, 'flowstate', 'TypeScript', 745, 61, 'State machines for complex async UI flows', 4),
  repo(8, 'queue-runner', 'Go', 690, 54, 'Reliable background job runner with retries', 4),
  repo(9, 'shard-db', 'C++', 612, 49, 'Horizontally sharded key-value store', 5),
  repo(10, 'snapcss', 'JavaScript', 588, 71, 'Atomic CSS generator with zero runtime', 6),
  repo(11, 'replay-kit', 'TypeScript', 540, 38, 'Session replay tooling for debugging production issues', 7),
  repo(12, 'mesh-router', 'Go', 501, 44, 'Service mesh sidecar router', 8),
  repo(13, 'tinylex', 'Rust', 463, 29, 'A small, fast lexer generator', 9),
  repo(14, 'formkit', 'TypeScript', 421, 35, 'Schema-driven form rendering library', 10),
  repo(15, 'datacask', 'Python', 398, 31, 'Columnar storage format for analytics workloads', 11),
  repo(16, 'cron-glass', 'Go', 356, 22, 'Observable cron scheduler with a web UI', 13),
  repo(17, 'protozoo', 'C++', 312, 27, 'Protobuf schema registry and codegen', 15),
  repo(18, 'wisp-auth', 'TypeScript', 289, 19, 'Drop-in passwordless auth for small apps', 17),
  repo(19, 'rake-test', 'Ruby', 245, 16, 'Parallel test runner for Rails suites', 19),
  repo(20, 'colorlens', 'JavaScript', 221, 24, 'Accessible color palette generator', 22),
  repo(21, 'driftwatch', 'Python', 198, 14, 'Data drift detection for ML pipelines', 25),
  repo(22, 'nodepool', 'Go', 176, 11, 'Worker pool primitives with backpressure', 28),
  repo(23, 'glyphsmith', 'Rust', 154, 9, 'Variable font subsetting tool', 32),
  repo(24, 'inkwell-md', 'TypeScript', 132, 13, 'Markdown editor component with live preview', 36),
  repo(25, 'shoresync', 'JavaScript', 98, 7, 'Offline-first sync engine for mobile apps', 41),
  repo(26, 'pivotgrid', 'TypeScript', 76, 6, 'Pivot table component for data-heavy dashboards', 47),
  repo(27, 'quietlogs', 'Go', 54, 4, 'Structured logging with sane defaults', 55),
  repo(28, 'dotfiles', 'JavaScript', 31, 8, 'Personal dev environment configs', 64),
];

const WEEKLY_COMMIT_PATTERN = [34, 41, 28, 52, 47, 39, 61, 44, 58, 36, 49, 53];

export function getDemoActivity() {
  const now = new Date();
  const commitCadence = WEEKLY_COMMIT_PATTERN.map((commits, i) => {
    const weeksAgo = WEEKLY_COMMIT_PATTERN.length - 1 - i;
    const d = new Date(now);
    d.setDate(d.getDate() - weeksAgo * 7);
    return {
      week: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits,
    };
  });

  return {
    commitCadence,
    avgCycleTimeHours: 14,
    avgReviewLatencyHours: 3,
  };
}
