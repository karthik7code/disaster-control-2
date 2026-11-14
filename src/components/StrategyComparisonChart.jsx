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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export default function StrategyComparisonChart({ comparisonData }) {
  if (!comparisonData || !comparisonData.strategies) return null;

  const strategies = comparisonData.strategies;

  // Bar chart data comparing scores & utilization across the 3 strategies
  const barData = strategies.map((s) => ({
    name: s.strategy,
    'Overall Score': s.overall_score,
    'Fairness Score': s.fairness_score,
    'Utilization (%)': s.resource_utilization,
  }));

  // Radar chart data across 5 normalized dimensions (0-100)
  const byName = Object.fromEntries(strategies.map((s) => [s.strategy, s]));
  const eq = byName['Equal Allocation'] || {};
  const fp = byName['Fixed Priority'] || {};
  const ai = byName['CrisisGrid AI'] || {};

  const radarData = [
    {
      metric: 'Overall Score',
      'Equal Allocation': eq.overall_score ?? 0,
      'Fixed Priority': fp.overall_score ?? 0,
      'CrisisGrid AI': ai.overall_score ?? 0,
    },
    {
      metric: 'Fairness',
      'Equal Allocation': eq.fairness_score ?? 0,
      'Fixed Priority': fp.fairness_score ?? 0,
      'CrisisGrid AI': ai.fairness_score ?? 0,
    },
    {
      metric: 'Utilization',
      'Equal Allocation': eq.resource_utilization ?? 0,
      'Fixed Priority': fp.resource_utilization ?? 0,
      'CrisisGrid AI': ai.resource_utilization ?? 0,
    },
    {
      metric: 'Safety Compliance',
      'Equal Allocation': ((eq.operational_services ?? 0) / 4) * 100,
      'Fixed Priority': ((fp.operational_services ?? 0) / 4) * 100,
      'CrisisGrid AI': ((ai.operational_services ?? 0) / 4) * 100,
    },
    {
      metric: 'Zero-Violation Reliability',
      'Equal Allocation': Math.max(0, 100 - (eq.safety_violations ?? 0) * 30),
      'Fixed Priority': Math.max(0, 100 - (fp.safety_violations ?? 0) * 30),
      'CrisisGrid AI': Math.max(0, 100 - (ai.safety_violations ?? 0) * 30),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">
            Strategy Score & Utilization Benchmark
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct comparison of Overall Score, Fairness Index, and Grid Utilization
          </p>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
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
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              <Bar dataKey="Overall Score" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Fairness Score" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Utilization (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">
            Multi-Dimensional Resilience Radar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates Safety Compliance, Zero-Violation Reliability, Fairness, and Overall Score
          </p>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar
                name="CrisisGrid AI"
                dataKey="CrisisGrid AI"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.35}
              />
              <Radar
                name="Fixed Priority"
                dataKey="Fixed Priority"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.2}
              />
              <Radar
                name="Equal Allocation"
                dataKey="Equal Allocation"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
