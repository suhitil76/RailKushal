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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-cyan/20 border border-rail-cyan/40 text-rail-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
              TRD Workspace
            </span>
            <span className="text-xs text-rail-secondary">Traction Distribution · 25kV AC Overhead Equipment</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            DEE (TRD) Electrical Operations Command
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Manage OHE tower wagons, power block isolation permits, cantilever insulators, and traction substations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/requests/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-cyan hover:bg-rail-cyan/90 text-white text-xs font-bold transition-all shadow-md shadow-slate-200/60"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Power Block Request</span>
          </button>
          <button
            onClick={() => onNavigate('/requests')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-semibold text-rail-text transition-colors"
          >
            <Inbox className="w-4 h-4 text-rail-cyan" />
            <span>My Requests ({trdRequests.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-muted uppercase">Active OHE Tasks</span>
          <div className="text-2xl font-black text-rail-text mt-2">{trdTasks.length}</div>
          <p className="text-[10px] text-rail-secondary mt-1">Logged in TDMS</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-coral uppercase">Flashover / Hotspots</span>
          <div className="text-2xl font-black text-rail-coral mt-2">{criticalTrd.length}</div>
          <p className="text-[10px] text-rail-secondary mt-1">High breakdown risk</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-amber uppercase">Tower Wagons Active</span>
          <div className="text-2xl font-black text-rail-amber mt-2">2 Units</div>
          <p className="text-[10px] text-rail-secondary mt-1">RU-8821 &amp; RU-8824</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-teal uppercase">Isolation Readiness</span>
          <div className="text-2xl font-black text-rail-teal mt-2">100% Verified</div>
          <p className="text-[10px] text-rail-emerald mt-1">TPC permits mapped</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
            OHE Asset Health Breakdown (TDMS Thermovision)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={oheHealthData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {oheHealthData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {oheHealthData.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-rail-secondary text-[11px]">{h.name}:</span>
                <span className="font-bold text-rail-text text-[11px]">{h.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
            Power Block Requirements by Type
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerBlockData}>
                <XAxis dataKey="type" stroke="#6E8AA3" fontSize={9} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#20C6B7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-rail-secondary text-center mt-2">
            Section isolation allows shadow work for Engineering while protecting linesmen.
          </p>
        </div>
      </div>

      {/* Lightning & Weather Constraint Box */}
      <div className="p-4 rounded-xl bg-rail-surface border border-rail-amber/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CloudLightning className="w-6 h-6 text-rail-amber" />
          <div>
            <h4 className="text-xs font-bold text-rail-text">IMD Pune Lightning Safety Matrix</h4>
            <p className="text-xs text-rail-secondary">
              Thunderstorm predicted on Sept 22 (14:00 - 19:00). Tower-wagon cantilever operations restricted during that window.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/weather')}
          className="px-3 py-1.5 rounded-lg bg-rail-bg border border-rail-border text-xs text-rail-cyan hover:border-rail-cyan"
        >
          Inspect Weather Rules
        </button>
      </div>
    </div>
  );
};
