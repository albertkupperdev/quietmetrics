export function Skeleton({ width = '100%', height = '16px', borderRadius = '6px' }: {
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius }} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="profile-card">
      <Skeleton width="80px" height="80px" borderRadius="50%" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton width="160px" height="22px" />
        <Skeleton width="100px" height="14px" />
        <Skeleton width="220px" height="14px" />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Skeleton width="60px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="stats-bar">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="stat-item">
          <Skeleton width="40px" height="28px" />
          <Skeleton width="60px" height="13px" />
        </div>
      ))}
    </div>
  );
}

export function RepoSkeleton() {
  return (
    <div className="repo-card">
      <div className="repo-header">
        <Skeleton width="140px" height="16px" />
        <Skeleton width="52px" height="20px" borderRadius="20px" />
      </div>
      <Skeleton width="80%" height="13px" />
      <div className="repo-meta">
        <Skeleton width="60px" height="13px" />
        <Skeleton width="40px" height="13px" />
        <Skeleton width="40px" height="13px" />
      </div>
    </div>
  );
}
