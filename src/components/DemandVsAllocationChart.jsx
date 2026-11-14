import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function DemandVsAllocationChart({ simulation }) {
  if (!simulation || !simulation.agents) return null;

  const data = simulation.agents.map((a) => ({
    name: a.name,
    Demand: a.demand,
    Allocated: a.allocated_power,
    'Min Safe': a.minimum_safe,
  }));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Nominal Demand vs. Allocated Power vs. Safety Floor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifies how CrisisGrid AI protects minimum safety baselines while allocating surplus MW
          </p>
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-400">
          Unit: Megawatts (MW)
        </span>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#cbd5e1', fontSize: 12 }}
              unit=" MW"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(val) => [`${val} MW`]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            <Bar dataKey="Demand" fill="#475569" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Allocated" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Min Safe" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
