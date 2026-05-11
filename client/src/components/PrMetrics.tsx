interface Props {
  avgCycleTimeHours: number | null;
  avgReviewLatencyHours: number | null;
}

function formatHours(hours: number | null): string {
  if (hours === null) return '—';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export default function PrMetrics({ avgCycleTimeHours, avgReviewLatencyHours }: Props) {
  return (
    <div className="pr-metrics">
      <div className="pr-metric-card">
        <span className="pr-metric-value">{formatHours(avgCycleTimeHours)}</span>
        <span className="pr-metric-label">Avg PR Cycle Time</span>
        <span className="pr-metric-sub">open → merged</span>
      </div>
      <div className="pr-metric-card">
        <span className="pr-metric-value">{formatHours(avgReviewLatencyHours)}</span>
        <span className="pr-metric-label">Avg Review Latency</span>
        <span className="pr-metric-sub">open → first review</span>
      </div>
    </div>
  );
}
