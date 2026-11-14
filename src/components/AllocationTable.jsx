import React from 'react';
import { CheckCircle2, AlertOctagon } from 'lucide-react';

export default function AllocationTable({ simulation }) {
  if (!simulation || !simulation.agents) return null;

  const agents = simulation.agents;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Infrastructure Power Allocation Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous multi-agent dispatch comparing nominal demand, minimum safety thresholds, and final allocated MW
          </p>
        </div>
        <div className="text-xs font-mono tabular-nums text-slate-400">
          Total Allocated: <span className="text-white font-semibold">{simulation.supply >= 0 ? agents.reduce((acc, a) => acc + a.allocated_power, 0) : 0} MW</span> / {simulation.supply} MW
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/50">
              <th className="py-3 px-6 font-medium">Service</th>
              <th className="py-3 px-4 font-medium text-right">Priority</th>
              <th className="py-3 px-4 font-medium text-right">Demand</th>
              <th className="py-3 px-4 font-medium text-right">Min Safe</th>
              <th className="py-3 px-4 font-medium text-right">Allocated</th>
              <th className="py-3 px-4 font-medium text-right">Unmet Need</th>
              <th className="py-3 px-4 font-medium text-right">Fulfillment</th>
              <th className="py-3 px-6 font-medium text-right">Agent Proposal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-sm">
            {agents.map((agent) => {
              const pct =
                agent.demand > 0
                  ? Math.round((agent.allocated_power / agent.demand) * 100)
                  : 100;
              const isSafe = agent.allocated_power >= agent.minimum_safe;

              return (
                <tr
                  key={agent.name}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-6 font-medium text-white">
                    {agent.name}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                    P{agent.priority}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                    {agent.demand} MW
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    {agent.minimum_safe} MW
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-blue-400">
                    {agent.allocated_power} MW
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-amber-400">
                    {agent.unmet_demand} MW
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isSafe ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 w-9 text-right">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono tabular-nums text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 font-semibold ${
                        isSafe ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isSafe ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {agent.proposal_evaluation}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
