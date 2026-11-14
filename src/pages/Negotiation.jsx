import React from 'react';
import NegotiationTimeline from '../components/NegotiationTimeline.jsx';
import KPISection from '../components/KPISection.jsx';

export default function Negotiation({ simulation }) {
  if (!simulation) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">
            Autonomous Protocol Execution · Utility Function: score = priority × unmet_demand
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Multi-Agent Negotiation Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live protocol trace showing baseline safety lock, iterative marginal power bidding, and agent proposal evaluations.
          </p>
        </div>
        <div className="text-right font-mono tabular-nums text-xs text-slate-400">
          <div>Active Scenario: <span className="text-white font-semibold">{simulation.scenario}</span></div>
          <div className="mt-1">Outcome: <span className={simulation.safe ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>{simulation.status_message}</span></div>
        </div>
      </div>

      <KPISection simulation={simulation} />

      {/* Agent Utility Scoring Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {simulation.agents?.map((agent) => {
          const initialUnmet = Math.max(0, agent.demand - agent.minimum_safe);
          const initialScore = agent.priority * initialUnmet;
          const finalScore = agent.priority * agent.unmet_demand;
          return (
            <div
              key={agent.name}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white text-sm">{agent.name} Agent</span>
                <span className="font-mono tabular-nums">Priority {agent.priority}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between font-mono tabular-nums">
                <span>Request / Min Safe:</span>
                <span className="text-slate-200">{agent.demand} MW / {agent.minimum_safe} MW</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between font-mono tabular-nums">
                <span>Initial Bid Score:</span>
                <span className="text-blue-400">{initialScore}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between font-mono tabular-nums">
                <span>Final Allocated:</span>
                <span className="text-emerald-400 font-semibold">{agent.allocated_power} MW ({agent.proposal_evaluation})</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between font-mono tabular-nums">
                <span>Residual Score:</span>
                <span className="text-amber-400">{finalScore}</span>
              </div>
            </div>
          );
        })}
      </div>

      <NegotiationTimeline logs={simulation.logs || []} autoAnimate={true} />
    </div>
  );
}
