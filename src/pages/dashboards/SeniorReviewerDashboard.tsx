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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399] text-[10px] font-bold uppercase tracking-wider font-mono">
              Executive Reviewer Workspace
            </span>
            <span className="text-xs text-[#A7C1D4]">ADRM / Senior Divisional Operations Oversight</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Pune Division Infrastructure Availability Scorecard
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            High-level operational metrics, Rolling Block Program compliance, and multi-department availability trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/simulator')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <PlaySquare className="w-4 h-4 text-[#38BDF8]" />
            <span>What-If Simulator</span>
          </button>
          <button
            onClick={() => onNavigate('/map')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs transition-colors"
          >
            <Map className="w-4 h-4" />
            <span>Interactive GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Division Asset Availability</span>
          <div className="text-2xl font-black text-[#34D399] mt-2">96.2%</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">+4.7% over 2025 baseline</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#20C6B7] uppercase">Integrated Block Ratio</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">44.8%</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Multi-department co-working</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F05252] uppercase">Critical Safety Exceptions</span>
          <div className="text-2xl font-black text-[#F05252] mt-2">{criticalTasks.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Escalated to DRM review</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#38BDF8] uppercase">Published Blocks</span>
          <div className="text-2xl font-black text-[#38BDF8] mt-2">{publishedBlocks.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Active on Central Control</p>
        </div>
      </div>

      {/* Availability Trend & Dept Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
              Asset Availability Trend: RailKushal vs Conventional Baseline
            </h3>
            <span className="text-[10px] text-[#34D399] font-mono">Target: &gt;95%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={divisionAvailabilityTrend}>
                <XAxis dataKey="month" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} domain={[88, 98]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Line type="monotone" dataKey="availability" stroke="#34D399" strokeWidth={3} name="RailKushal Synchronized" />
                <Line type="monotone" dataKey="baseline" stroke="#6E8AA3" strokeWidth={2} strokeDasharray="4 4" name="Siloed Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-[#A7C1D4] mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#34D399]" /> RailKushal Synchronized</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6E8AA3]" /> Conventional Siloed Baseline</div>
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            Departmental Block Execution Efficiency
          </h3>
          <div className="space-y-4 mt-4">
            {departmentComparison.map((d, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E6F4F1]">{d.dept}</span>
                  <span className="text-[#20C6B7] font-mono font-bold">{d.efficiency}% Efficiency</span>
                </div>
                <div className="w-full bg-[#102A43] h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#20C6B7] h-full rounded-full" style={{ width: `${d.efficiency}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#A7C1D4] mt-1.5">
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
