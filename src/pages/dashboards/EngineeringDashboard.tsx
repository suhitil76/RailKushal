import React from 'react';
import { 
  PlusCircle, Inbox, ListTodo, Wrench, AlertTriangle, CheckCircle, 
  Layers, ArrowRight, ShieldAlert, Sparkles, CheckSquare 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { store } from '../../services/store';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const EngineeringDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const engTasks = state.tasks.filter(t => t.department === 'ENGINEERING');
  const engRequests = state.requests.filter(r => r.department === 'ENGINEERING');
  const criticalEng = engTasks.filter(t => t.severity === 'CRITICAL');
  const overdueEng = engTasks.filter(t => t.overdueDays > 0);

  // Asset Health Distribution
  const healthData = [
    { name: 'Pristine (80-100)', value: 34, color: '#34D399' },
    { name: 'Moderate (60-79)', value: 28, color: '#38BDF8' },
    { name: 'Degraded (40-59)', value: 14, color: '#F4B942' },
    { name: 'Critical Defect (<40)', value: 6, color: '#F05252' },
  ];

  // Defect Age Histogram
  const defectAgeData = [
    { bucket: '< 3 Days', count: 12 },
    { bucket: '3 - 7 Days', count: 8 },
    { bucket: '7 - 14 Days', count: 5 },
    { bucket: '> 14 Days', count: 2 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              Engineering Workspace
            </span>
            <span className="text-xs text-[#A7C1D4]">Permanent Way, Rails, Turnouts & Track Geometry</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            SSE (Permanent Way) Maintenance Command
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Log track geometry flaws, rail fractures, switch renewals, and track tamping machine requisitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/requests/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-teal-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Track Request</span>
          </button>
          <button
            onClick={() => onNavigate('/requests')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <Inbox className="w-4 h-4 text-[#38BDF8]" />
            <span>My Requests ({engRequests.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Active Track Defects</span>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{engTasks.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Logged in TMS</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F05252] uppercase">IMR / Critical Flaws</span>
          <div className="text-2xl font-black text-[#F05252] mt-2">{criticalEng.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Requires immediate removal</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F4B942] uppercase">Overdue Tasks</span>
          <div className="text-2xl font-black text-[#F4B942] mt-2">{overdueEng.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Pending block sanction</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#20C6B7] uppercase">Co-Working Opportunities</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">4 Corridor Bundles</div>
          <p className="text-[10px] text-[#34D399] mt-1">With TRD & S&T</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            Track Asset Condition Score Index
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {healthData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {healthData.map((h, i) => (
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
            Defect Age Histogram (Days Since Detection)
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectAgeData}>
                <XAxis dataKey="bucket" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#A7C1D4] text-center mt-2">
            Tasks older than 7 days receive automatic AI escalation for night corridor slots.
          </p>
        </div>
      </div>

      {/* Shared Work Opportunities Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102A43] to-[#163B5C] border border-[#20C6B7]/40 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#20C6B7]" />
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
            AI Recommended Joint Maintenance Windows (Shared with TRD & S&T)
          </h3>
        </div>
        <p className="text-xs text-[#A7C1D4] leading-relaxed mb-4">
          On section <span className="text-[#20C6B7] font-semibold">Chinchwad–Akurdi (CCH-AKRD)</span>, TRD has requested OHE insulator replacement and S&T has requested axle counter testing. Co-scheduling your tamping machine on this window eliminates 2 additional track traffic blocks.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/blocks/weekly')}
            className="px-3 py-1.5 rounded-lg bg-[#20C6B7] text-[#071626] font-bold text-xs hover:bg-[#20C6B7]/90 transition-colors"
          >
            View Shared Corridor Slot
          </button>
          <span className="text-xs text-[#A7C1D4] font-mono">Date: Sept 20 · 01:30 - 04:30</span>
        </div>
      </div>
    </div>
  );
};
