import React from 'react';
import AllocationTable from '../components/AllocationTable.jsx';
import AllocationPieChart from '../components/AllocationPieChart.jsx';
import DemandVsAllocationChart from '../components/DemandVsAllocationChart.jsx';
import DependencyPanel from '../components/DependencyPanel.jsx';
import RecommendationPanel from '../components/RecommendationPanel.jsx';
import KPISection from '../components/KPISection.jsx';

export default function Results({ simulation }) {
  if (!simulation) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">
            Post-Negotiation Dispatch Report · Safety Validator & Cascading Dependency Analysis
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Simulation Results & Safety Audit ({simulation.scenario})
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive breakdown of allocated megawatts, supply utilization, dependency links, and AI operational directives.
          </p>
        </div>

        <div className="font-mono tabular-nums text-xs text-right space-y-1">
          <div className="text-slate-400">
            Supply Utilization:{' '}
            <span className="text-white font-semibold">
              {simulation.utilization_rate}%
            </span>
          </div>
          <div className="text-slate-400">
            Safety Validator:{' '}
            <span
              className={
                simulation.safe
                  ? 'text-emerald-400 font-semibold'
                  : 'text-red-400 font-semibold'
              }
            >
              {simulation.safe ? 'SAFE (COMPLIANT)' : 'UNSAFE (DEFICIT)'}
            </span>
          </div>
        </div>
      </div>

      <KPISection simulation={simulation} />

      <AllocationTable simulation={simulation} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AllocationPieChart simulation={simulation} />
        <DemandVsAllocationChart simulation={simulation} />
      </div>

      <DependencyPanel simulation={simulation} />

      <RecommendationPanel simulation={simulation} />
    </div>
  );
}
