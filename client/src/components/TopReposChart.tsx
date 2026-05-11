import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Repo {
  name: string;
  stars: number;
}

interface Props {
  repos: Repo[];
}

export default function TopReposChart({ repos }: Props) {
  const data = [...repos]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6)
    .map((r) => ({ name: r.name, stars: r.stars }));

  if (data.every((d) => d.stars === 0)) return null;

  return (
    <div className="chart-card">
      <h3>Top Repos by Stars</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
          <Bar dataKey="stars" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#6366f1' : '#a5b4fc'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
