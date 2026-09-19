import React from 'react';
import { 
  Radio, PlusCircle, Inbox, ShieldCheck, CheckCircle2, 
  AlertCircle, ArrowRight, Cpu, Sparkles 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { store } from '../../services/store';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const SntDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const sntTasks = state.tasks.filter(t => t.department === 'S_AND_T');
  const sntRequests = state.requests.filter(r => r.department === 'S_AND_T');
  const criticalSnt = sntTasks.filter(t => t.severity === 'CRITICAL');

  const sntCategoryData = [
    { category: 'Axle Counters', count: 12 },
    { category: 'Point Machines', count: 9 },
    { category: 'Cables / OFC', count: 7 },
    { category: 'Signals / LED', count: 8 },
    { category: 'Interlocking', count: 5 },
  ];

  const gearHealthData = [
    { name: 'Nominal (80-100)', value: 45, color: '#34D399' },
    { name: 'Drift / Tolerance (60-79)', value: 29, color: '#38BDF8' },
    { name: 'Degraded Insulation (40-59)', value: 16, color: '#F4B942' },
    { name: 'Fail Hazard (<40)', value: 10, color: '#F05252' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#F4B942]/20 border border-[#F4B942]/40 text-[#F4B942] text-[10px] font-bold uppercase tracking-wider font-mono">
              S&T Workspace
            </span>
            <span className="text-xs text-[#A7C1D4]">Signals, Interlocking, Axle Counters & Telecommunications</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            SSE (Signal & Telecom) Maintenance Command
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Synchronize signal disconnection memos, point machine testing, and electronic interlocking restorations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/requests/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F4B942] hover:bg-[#F4B942]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-amber-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New S&T Disconnection Request</span>
          </button>
          <button
            onClick={() => onNavigate('/requests')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <Inbox className="w-4 h-4 text-[#38BDF8]" />
            <span>My Requests ({sntRequests.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Active S&T Tasks</span>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{sntTasks.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">SMMS Synced</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F05252] uppercase">Red Aspect Hazard</span>
          <div className="text-2xl font-black text-[#F05252] mt-2">{criticalSnt.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">High train delay impact</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#34D399] uppercase">Testing Protocols</span>
          <div className="text-2xl font-black text-[#34D399] mt-2">Ready</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Joint wheel test mapped</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#20C6B7] uppercase">Co-Scheduled Blocks</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">3 Blocks</div>
          <p className="text-[10px] text-[#34D399] mt-1">Bundled with Permanent Way</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            S&T Asset Health Index (SMMS Logs)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gearHealthData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {gearHealthData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {gearHealthData.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-[#A7C1D4] text-[11px]">{h.name}:</span>
                <span className="font-bold text-[#E6F4F1] text-[11px]">{h.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            Tasks by Signalling Equipment Category
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sntCategoryData}>
                <XAxis dataKey="category" stroke="#6E8AA3" fontSize={9} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#F4B942" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#A7C1D4] text-center mt-2">
            Axle counter and point machine maintenance are aligned with P-Way track tamping windows.
          </p>
        </div>
      </div>
    </div>
  );
};
