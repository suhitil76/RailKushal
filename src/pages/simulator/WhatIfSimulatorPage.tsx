import React, { useState } from 'react';
import { 
  PlaySquare, CloudRain, CloudLightning, AlertCircle, Clock, 
  RotateCcw, Sparkles, TrendingUp, CheckCircle2, ShieldAlert, BarChart2 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from '../../components/common/Toast';

export const WhatIfSimulatorPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string>('COORDINATED');
  const [heavyRainTriggered, setHeavyRainTriggered] = useState(false);
  const [trainDelayTriggered, setTrainDelayTriggered] = useState(false);
  const [emergencyDefectTriggered, setEmergencyDefectTriggered] = useState(false);

  // Dynamic simulation calculation
  const getMetrics = () => {
    if (activeScenario === 'BASELINE') {
      return {
        requestedHours: 124,
        grantedHours: 92,
        productiveHours: 64,
        idleHours: 28,
        integratedBlocks: 0,
        criticalCompleted: 14,
        trainConflictMinutes: 245,
        availability: 91.5,
        downtimeHours: 42,
        reschedules: 8
      };
    }

    let base = {
      requestedHours: 110,
      grantedHours: 104,
      productiveHours: 92,
      idleHours: 12,
      integratedBlocks: 4,
      criticalCompleted: 22,
      trainConflictMinutes: 45,
      availability: 96.2,
      downtimeHours: 24,
      reschedules: 2
    };

    if (heavyRainTriggered) {
      base.productiveHours -= 14;
      base.reschedules += 5;
      base.availability -= 0.8;
      base.idleHours += 6;
    }

    if (trainDelayTriggered) {
      base.trainConflictMinutes += 60;
      base.productiveHours -= 8;
      base.availability -= 0.5;
    }

    if (emergencyDefectTriggered) {
      base.criticalCompleted += 1;
      base.reschedules += 2;
      base.trainConflictMinutes += 30;
    }

    return base;
  };

  const metrics = getMetrics();

  const comparisonChartData = [
    { name: 'Productive Hours', Baseline: 64, RailKushal: metrics.productiveHours },
    { name: 'Idle Window Hours', Baseline: 28, RailKushal: metrics.idleHours },
    { name: 'Train Conflict (10m)', Baseline: 24.5, RailKushal: metrics.trainConflictMinutes / 10 },
    { name: 'Critical Completed', Baseline: 14, RailKushal: metrics.criticalCompleted },
  ];

  const handleReset = () => {
    setActiveScenario('COORDINATED');
    setHeavyRainTriggered(false);
    setTrainDelayTriggered(false);
    setEmergencyDefectTriggered(false);
    toast.info('Simulation Reset', 'Simulation reset to baseline state.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-teal/20 border border-rail-teal/40 text-rail-teal text-[10px] font-bold uppercase tracking-wider font-mono">
              Scenario Modeling Engine
            </span>
            <span className="text-xs text-rail-secondary">Deterministic Disruption &amp; Dovetailing Simulator</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            What-If Operations &amp; Disruption Sandbox
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Test how unexpected monsoon surges, sudden train delays, or emergency rail fractures affect maintenance throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-semibold text-rail-secondary hover:text-rail-text transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* Simulator Scenario Controls */}
      <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-4">
        <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
          1. Select Planning Model
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            onClick={() => setActiveScenario('COORDINATED')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeScenario === 'COORDINATED'
                ? 'bg-rail-elevated border-rail-teal shadow-lg shadow-cyan-950/40'
                : 'bg-rail-bg border-rail-border hover:bg-rail-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rail-text">RailKushal Synchronized Planning</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rail-teal/20 text-rail-teal">
                AI Coordinated
              </span>
            </div>
            <p className="text-xs text-rail-secondary leading-relaxed">
              Multi-department corridor bundling, timetable clash avoidance, and dynamic weather gating.
            </p>
          </div>

          <div
            onClick={() => setActiveScenario('BASELINE')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeScenario === 'BASELINE'
                ? 'bg-rail-elevated border-rail-coral shadow-lg shadow-red-950/40'
                : 'bg-rail-bg border-rail-border hover:bg-rail-surface'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rail-text">Decentralized Departmental Baseline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rail-coral/20 text-rail-coral">
                Conventional Siloed
              </span>
            </div>
            <p className="text-xs text-rail-secondary leading-relaxed">
              Engineering, TRD, and S&amp;T request individual blocks with duplicate setup, fit memos, and recurring speed restrictions.
            </p>
          </div>
        </div>

        {/* Dynamic Disruption Injections */}
        <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider pt-2 border-t border-rail-border/60">
          2. Inject Operational Stress Events
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setHeavyRainTriggered(!heavyRainTriggered);
              toast.warning(heavyRainTriggered ? 'Rain Event Cleared' : 'Monsoon Burst Injected', '70mm downpour simulated over Bhor Ghat corridor.');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              heavyRainTriggered 
                ? 'bg-rail-cyan text-white border-rail-cyan' 
                : 'bg-rail-bg text-rail-secondary border-rail-border hover:border-rail-cyan'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>Heavy Rain Event (70 mm/hr)</span>
          </button>

          <button
            onClick={() => {
              setTrainDelayTriggered(!trainDelayTriggered);
              toast.warning(trainDelayTriggered ? 'Train Delay Resolved' : 'Late Goods Rake Injected', 'Late-running Up Freight rake intruding into night corridor.');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              trainDelayTriggered 
                ? 'bg-rail-amber text-white border-[#F4B942]' 
                : 'bg-rail-bg text-rail-secondary border-rail-border hover:border-[#F4B942]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Train Delay Incursion (+45m)</span>
          </button>

          <button
            onClick={() => {
              setEmergencyDefectTriggered(!emergencyDefectTriggered);
              toast.error(emergencyDefectTriggered ? 'Emergency Cleared' : 'Emergency Fracture Logged', 'Immediate emergency speed restriction on Chinchwad.');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              emergencyDefectTriggered 
                ? 'bg-rail-coral text-white border-rail-coral' 
                : 'bg-rail-bg text-rail-secondary border-rail-border hover:border-rail-coral'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Emergency IMR Rail Fracture</span>
          </button>
        </div>
      </div>

      {/* Simulation Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-muted uppercase">Productive Block Hours</span>
          <div className="text-2xl font-black text-rail-teal mt-2 font-mono">{metrics.productiveHours}h</div>
          <p className="text-[10px] text-rail-secondary mt-1">Idle Time: {metrics.idleHours}h</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-cyan uppercase">Train Conflict Minutes</span>
          <div className="text-2xl font-black text-rail-cyan mt-2 font-mono">{metrics.trainConflictMinutes}m</div>
          <p className="text-[10px] text-rail-emerald mt-1">-81% vs decentralized baseline</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-emerald uppercase">Infrastructure Availability</span>
          <div className="text-2xl font-black text-rail-emerald mt-2 font-mono">{metrics.availability.toFixed(1)}%</div>
          <p className="text-[10px] text-rail-secondary mt-1">Safety-weighted uptime</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-amber uppercase">Weather Reschedules</span>
          <div className="text-2xl font-black text-rail-amber mt-2 font-mono">{metrics.reschedules} Blocks</div>
          <p className="text-[10px] text-rail-secondary mt-1">Gated to safe slots</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border">
        <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-4">
          Visual Efficiency Comparison: Baseline vs RailKushal Coordinated
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonChartData}>
              <XAxis dataKey="name" stroke="#6E8AA3" fontSize={11} tickLine={false} />
              <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
              <Bar dataKey="Baseline" fill="#6E8AA3" name="Conventional Baseline" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RailKushal" fill="#20C6B7" name="RailKushal Synchronized" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-center text-[10px] text-rail-muted font-mono">
          Simulation estimate — not live operational data. Generated for evaluation of Problem Statement 26027.
        </p>
      </div>
    </div>
  );
};
