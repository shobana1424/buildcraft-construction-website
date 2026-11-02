import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { categoryBreakdown, overallProgress } from '../../utils/progress';

const tooltipStyle = { borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -12px rgba(16,43,85,.25)', fontSize: 12 };

export function OverallDonut({ site, height = 220 }) {
  const value = overallProgress(site);
  const data = [
    { name: 'Completed', value },
    { name: 'Remaining', value: 100 - value },
  ];
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius="68%" outerRadius="92%" startAngle={90} endAngle={-270} stroke="none" paddingAngle={value > 0 && value < 100 ? 2 : 0} isAnimationActive animationDuration={700}>
            <Cell fill="#1769E0" />
            <Cell fill="#E2E8F0" />
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-navy">{value}%</span>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Overall</span>
      </div>
    </div>
  );
}

export function CategoryBarChart({ site, height = 240 }) {
  const data = categoryBreakdown(site);
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} cursor={{ fill: '#F2F6FF' }} />
          <Bar dataKey="completed" name="Completion" radius={[8, 8, 0, 0]} animationDuration={700}>
            {data.map((d) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletedRemainingChart({ site, height = 240 }) {
  const data = categoryBreakdown(site);
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} cursor={{ fill: '#F2F6FF' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="completed" name="Completed" stackId="a" fill="#16A34A" animationDuration={700} />
          <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#CBD5E1" radius={[0, 8, 8, 0]} animationDuration={700} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Generic horizontal/vertical bar chart used by dashboards and reports.
export function SimpleBar({ data, dataKey = 'value', nameKey = 'name', height = 260, color = '#1769E0', unit = '%', colors }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} domain={unit === '%' ? [0, 100] : undefined} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}${unit}`} cursor={{ fill: '#F2F6FF' }} />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} fill={color} animationDuration={700}>
            {colors && data.map((d, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusDonut({ data, height = 220 }) {
  const palette = { 'On Track': '#16A34A', 'In Progress': '#F97316', Delayed: '#DC2626', Completed: '#1769E0' };
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3} stroke="none" animationDuration={700}>
            {data.map((d) => (
              <Cell key={d.name} fill={palette[d.name] || '#94A3B8'} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
