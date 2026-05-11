import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Week {
  week: string;
  commits: number;
}

interface Props {
  data: Week[];
}

export default function CommitChart({ data }: Props) {
  return (
    <div className="chart-card chart-card--wide">
      <h3>Commit Cadence — last 12 weeks</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={2} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#commitGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
