import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const SECTOR_COLORS = {
  Hospital: '#2563EB',  // Blue
  Emergency: '#EF4444', // Red
  Water: '#10B981',     // Green
  Telecom: '#F59E0B',   // Orange
};

export default function AllocationPieChart({ simulation }) {
  if (!simulation || !simulation.allocation) return null;

  const data = Object.entries(simulation.allocation).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Electricity Share by Sector
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Proportional distribution of {simulation.supply} MW available grid supply
          </p>
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-400">
          {simulation.utilization_rate}% Utilized
        </span>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={95}
              paddingAngle={3}
              label={({ name, value }) => `${name}: ${value} MW`}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={SECTOR_COLORS[entry.name] || '#2563EB'}
                  stroke="#0f172a"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value} MW`, 'Allocated Power']}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
