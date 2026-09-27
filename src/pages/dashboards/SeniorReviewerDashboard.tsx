import React from 'react';
import { 
  TrendingUp, ShieldAlert, Award, FileCheck, Layers, 
  Map, PlaySquare, ArrowRight, BarChart2 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { store } from '../../services/store';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const SeniorReviewerDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { tasks, blockPlans } = state;

  const criticalTasks = tasks.filter(t => t.severity === 'CRITICAL');
  const publishedBlocks = blockPlans.filter(b => b.status === 'PUBLISHED' || b.status === 'APPROVED');

  const divisionAvailabilityTrend = [
    { month: 'May', availability: 93.2, baseline: 90.1 },
    { month: 'Jun', availability: 93.8, baseline: 90.4 },
    { month: 'Jul', availability: 94.4, baseline: 90.8 },
    { month: 'Aug', availability: 95.1, baseline: 91.2 },
    { month: 'Sep (Cur)', availability: 96.2, baseline: 91.5 },
  ];

  const departmentComparison = [
    { dept: 'Engineering', completed: 42, pending: 18, efficiency: 86 },
    { dept: 'TRD', completed: 36, pending: 12, efficiency: 89 },
    { dept: 'S&T', completed: 28, pending: 9, efficiency: 91 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-emerald/20 border border-rail-emerald/40 text-rail-emerald text-[10px] font-bold uppercase tracking-wider font-mono">
              Executive Reviewer Workspace
            </span>
            <span className="text-xs text-rail-secondary">ADRM / Senior Divisional Operations Oversight</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            Pune Division Infrastructure Availability Scorecard
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            High-level operational metrics, Rolling Block Program compliance, and multi-department availability trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/simulator')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-semibold text-rail-text transition-colors"
          >
            <PlaySquare className="w-4 h-4 text-rail-cyan" />
            <span>What-If Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('/map')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Interactive GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-muted uppercase">Division Asset Availability</span>
          <div className="text-2xl font-black text-rail-emerald mt-2">96.2%</div>
          <p className="text-[10px] text-rail-secondary mt-1">+4.7% over 2025 baseline</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-teal uppercase">Integrated Block Ratio</span>
          <div className="text-2xl font-black text-rail-teal mt-2">44.8%</div>
          <p className="text-[10px] text-rail-secondary mt-1">Multi-department co-working</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-coral uppercase">Critical Safety Exceptions</span>
          <div className="text-2xl font-black text-rail-coral mt-2">{criticalTasks.length}</div>
          <p className="text-[10px] text-rail-secondary mt-1">Escalated to DRM review</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-cyan uppercase">Published Blocks</span>
          <div className="text-2xl font-black text-rail-cyan mt-2">{publishedBlocks.length}</div>
          <p className="text-[10px] text-rail-secondary mt-1">Active on Central Control</p>
        </div>
      </div>

      {/* Availability Trend & Dept Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
              Asset Availability Trend: RailKushal vs Conventional Baseline
            </h3>
            <span className="text-[10px] text-rail-emerald font-mono">Target: &gt;95%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={divisionAvailabilityTrend}>
                <XAxis dataKey="month" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} domain={[88, 98]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
                <Line type="monotone" dataKey="availability" stroke="#34D399" strokeWidth={3} name="RailKushal Synchronized" />
                <Line type="monotone" dataKey="baseline" stroke="#6E8AA3" strokeWidth={2} strokeDasharray="4 4" name="Siloed Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-rail-secondary mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-emerald" /> RailKushal Synchronized</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-muted" /> Conventional Siloed Baseline</div>
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
            Departmental Block Execution Efficiency
          </h3>
          <div className="space-y-4 mt-4">
            {departmentComparison.map((d, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-rail-bg border border-rail-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rail-text">{d.dept}</span>
                  <span className="text-rail-teal font-mono font-bold">{d.efficiency}% Efficiency</span>
                </div>
                <div className="w-full bg-rail-surface h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-rail-teal h-full rounded-full" style={{ width: `${d.efficiency}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-rail-secondary mt-1.5">
                  <span>{d.completed} completed blocks</span>
                  <span>{d.pending} backlog tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
