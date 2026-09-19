import React from 'react';
import { 
  Zap, PlusCircle, Inbox, CloudLightning, ShieldCheck, 
  Wind, AlertTriangle, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { store } from '../../services/store';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const TrdDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const trdTasks = state.tasks.filter(t => t.department === 'TRD');
  const trdRequests = state.requests.filter(r => r.department === 'TRD');
  const criticalTrd = trdTasks.filter(t => t.severity === 'CRITICAL');

  const oheHealthData = [
    { name: 'Optimal (80-100)', value: 42, color: '#34D399' },
    { name: 'Slight Wear (60-79)', value: 31, color: '#38BDF8' },
    { name: 'Hotspot / Sag (40-59)', value: 18, color: '#F4B942' },
    { name: 'Flashover Risk (<40)', value: 9, color: '#F05252' },
  ];

  const powerBlockData = [
    { type: 'Full Line Block', count: 6 },
    { type: 'Section Isolation', count: 14 },
    { type: 'Elementary Section', count: 9 },
    { type: 'Yard Siding Isolation', count: 5 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider font-mono">
              TRD Workspace
            </span>
            <span className="text-xs text-[#A7C1D4]">Traction Distribution · 25kV AC Overhead Equipment</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            DEE (TRD) Electrical Operations Command
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Manage OHE tower wagons, power block isolation permits, cantilever insulators, and traction substations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/requests/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-cyan-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Power Block Request</span>
          </button>
          <button
            onClick={() => onNavigate('/requests')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <Inbox className="w-4 h-4 text-[#38BDF8]" />
            <span>My Requests ({trdRequests.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Active OHE Tasks</span>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{trdTasks.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Logged in TDMS</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F05252] uppercase">Flashover / Hotspots</span>
          <div className="text-2xl font-black text-[#F05252] mt-2">{criticalTrd.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">High breakdown risk</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F4B942] uppercase">Tower Wagons Active</span>
          <div className="text-2xl font-black text-[#F4B942] mt-2">2 Units</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">RU-8821 &amp; RU-8824</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#20C6B7] uppercase">Isolation Readiness</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">100% Verified</div>
          <p className="text-[10px] text-[#34D399] mt-1">TPC permits mapped</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            OHE Asset Health Breakdown (TDMS Thermovision)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={oheHealthData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {oheHealthData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {oheHealthData.map((h, i) => (
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
            Power Block Requirements by Type
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerBlockData}>
                <XAxis dataKey="type" stroke="#6E8AA3" fontSize={9} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#20C6B7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#A7C1D4] text-center mt-2">
            Section isolation allows shadow work for Engineering while protecting linesmen.
          </p>
        </div>
      </div>

      {/* Lightning & Weather Constraint Box */}
      <div className="p-4 rounded-xl bg-[#102A43] border border-[#F4B942]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CloudLightning className="w-6 h-6 text-[#F4B942]" />
          <div>
            <h4 className="text-xs font-bold text-[#E6F4F1]">IMD Pune Lightning Safety Matrix</h4>
            <p className="text-xs text-[#A7C1D4]">
              Thunderstorm predicted on Sept 22 (14:00 - 19:00). Tower-wagon cantilever operations restricted during that window.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/weather')}
          className="px-3 py-1.5 rounded-lg bg-[#071626] border border-[#244B6A] text-xs text-[#38BDF8] hover:border-[#38BDF8]"
        >
          Inspect Weather Rules
        </button>
      </div>
    </div>
  );
};
