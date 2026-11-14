import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Scale,
  MessageSquareCode,
  Save,
  Trash2,
  RotateCcw,
  Edit3,
  Check,
} from 'lucide-react';
import KPISection from '../components/KPISection.jsx';
import AllocationTable from '../components/AllocationTable.jsx';
import DemandVsAllocationChart from '../components/DemandVsAllocationChart.jsx';
import AllocationPieChart from '../components/AllocationPieChart.jsx';
import DependencyPanel from '../components/DependencyPanel.jsx';
import RecommendationPanel from '../components/RecommendationPanel.jsx';

export default function Dashboard({
  simulation,
  scenarios,
  onSelectQuickScenario,
  loading,
  user,
  cloudSimulations = [],
  onSaveSimulation,
  onUpdateCloudNote,
  onDeleteCloudSimulation,
  onRestoreCloudSimulation,
  savingToCloud,
}) {
  const [editingId, setEditingId] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  if (!simulation) {
    return (
      <div className="p-8 text-sm text-slate-400">
        Loading CrisisGrid AI command center state...
      </div>
    );
  }

  const startEditNote = (record) => {
    setEditingId(record.id);
    setNoteInput(record.notes || '');
  };

  const commitEditNote = async (simId) => {
    await onUpdateCloudNote(simId, noteInput);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <div>
          <div className="text-xs text-slate-400">
            Autonomous Multi-Agent Disaster Dispatch · Priority × Unmet Demand Protocol
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            CrisisGrid AI Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time multi-agent electricity negotiation across Hospital, Water Supply, Emergency Services, and Telecom Network during critical grid disruptions.
          </p>
        </div>

        {/* Quick Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {['Flood', 'Earthquake', 'Power Shortage'].map((name) => {
            const active = simulation.scenario === name;
            return (
              <button
                key={name}
                type="button"
                disabled={loading}
                onClick={() => onSelectQuickScenario(name)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {name}
              </button>
            );
          })}
          <Link
            to="/scenario"
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Configure Custom</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KPISection simulation={simulation} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemandVsAllocationChart simulation={simulation} />
        <AllocationPieChart simulation={simulation} />
      </div>

      {/* Allocation Table & Dependency Risks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AllocationTable simulation={simulation} />
        </div>
        <div className="xl:col-span-1">
          <DependencyPanel simulation={simulation} />
        </div>
      </div>

      {/* Validator Warnings & Strategic Recommendations */}
      <RecommendationPanel simulation={simulation} />

      {/* Saved Cloud Simulation Ledger (when signed in) */}
      {user && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Saved Simulation History
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Persisted disaster negotiation snapshots for {user.email}
              </p>
            </div>
            <button
              type="button"
              disabled={savingToCloud}
              onClick={onSaveSimulation}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingToCloud ? 'Saving...' : 'Save Current Run'}</span>
            </button>
          </div>

          {cloudSimulations.length === 0 ? (
            <div className="p-6 text-xs text-slate-400">
              No saved simulation runs yet. Click "Save Current Run" to persist the active allocation snapshot.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/50">
                    <th className="py-3 px-6 font-medium">Scenario</th>
                    <th className="py-3 px-4 font-medium text-right">Supply / Demand</th>
                    <th className="py-3 px-4 font-medium text-right">Allocated (H / W / E / T)</th>
                    <th className="py-3 px-4 font-medium">Safety Outcome</th>
                    <th className="py-3 px-4 font-medium">Operator Notes</th>
                    <th className="py-3 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-sm">
                  {cloudSimulations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-white">
                        {rec.scenario}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs text-slate-300">
                        {rec.supply} MW / {rec.totalDemand} MW
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-xs text-blue-400">
                        {rec.hospitalAllocated} / {rec.waterAllocated} / {rec.emergencyAllocated} / {rec.telecomAllocated} MW
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono tabular-nums">
                        <span className={rec.safe ? 'text-emerald-400' : 'text-red-400'}>
                          {rec.statusMessage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {editingId === rec.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              maxLength={300}
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              placeholder="Add dispatch note..."
                              className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => commitEditNote(rec.id)}
                              className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-xs">
                              {rec.notes || 'No notes'}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEditNote(rec)}
                              className="text-slate-500 hover:text-slate-300 cursor-pointer"
                              title="Edit Note"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRestoreCloudSimulation(rec)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
                            title="Re-run this scenario"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Load</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteCloudSimulation(rec.id)}
                            className="p-1.5 rounded bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quick Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/negotiation"
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/60 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-sm font-semibold text-white">
              Inspect Agent Negotiation Logs
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {simulation.logs?.length || 0} protocol rounds recorded
            </div>
          </div>
          <MessageSquareCode className="w-5 h-5 text-blue-400 shrink-0" />
        </Link>

        <Link
          to="/results"
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-sm font-semibold text-white">
              Full Allocation & Safety Audit
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Supply utilization {simulation.utilization_rate}% · {simulation.warnings?.length || 0} warnings
            </div>
          </div>
          <Play className="w-5 h-5 text-emerald-400 shrink-0" />
        </Link>

        <Link
          to="/comparison"
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/60 transition-colors flex items-center justify-between"
        >
          <div>
            <div className="text-sm font-semibold text-white">
              Benchmark Allocation Strategies
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Compare Equal vs. Fixed Priority vs. CrisisGrid AI
            </div>
          </div>
          <Scale className="w-5 h-5 text-amber-400 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
