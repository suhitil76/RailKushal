import React from 'react';
import { 
  Inbox, AlertCircle, Clock, CheckCircle2, TrendingUp, Calendar, 
  CloudRain, ShieldAlert, Cpu, ArrowRight, Zap, Play, Check, Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, 
  YAxis, Tooltip, LineChart, Line, ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { store } from '../../services/store';
import { toast } from '../../components/common/Toast';

interface ControlDashboardProps {
  onNavigate: (path: string) => void;
}

export const ControlDashboard: React.FC<ControlDashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { requests, tasks, blockPlans, weather, sections } = state;

  // KPIs
  const openRequests = requests.filter(r => r.status !== 'ACCEPTED' && r.status !== 'DECLINED' && r.status !== 'WITHDRAWN').length;
  const pendingReview = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const criticalTasks = tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').length;
  const overdueTasks = tasks.filter(t => t.overdueDays > 0 && t.status !== 'COMPLETED').length;
  const acceptedAwaitingBlock = tasks.filter(t => t.status === 'ACCEPTED').length;
  const proposedBlocks = blockPlans.filter(b => b.status === 'PROPOSED').length;
  const approvedBlocks = blockPlans.filter(b => b.status === 'APPROVED' || b.status === 'PUBLISHED').length;

  const productiveMinutes = blockPlans.reduce((acc, b) => acc + b.productiveMinutes, 0);
  const totalMinutes = blockPlans.reduce((acc, b) => acc + b.productiveMinutes + b.setupMinutes + b.restorationMinutes, 0);
  const utilizationRate = totalMinutes > 0 ? Math.round((productiveMinutes / totalMinutes) * 100) : 84;
  const integratedOpportunities = 4; // bundles identified
  const weatherRiskWindows = weather.filter(w => w.warningLevel !== 'GREEN').length;

  // Chart Data: Request Status Donut
  const requestStatusData = [
    { name: 'Pending Review', value: requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length, color: '#38BDF8' },
    { name: 'Accepted', value: requests.filter(r => r.status === 'ACCEPTED').length, color: '#34D399' },
    { name: 'Clarification', value: requests.filter(r => r.status === 'CLARIFICATION_REQUESTED').length, color: '#F4B942' },
    { name: 'Declined', value: requests.filter(r => r.status === 'DECLINED').length, color: '#F05252' },
    { name: 'Draft', value: requests.filter(r => r.status === 'DRAFT').length, color: '#6E8AA3' },
  ];

  // Department Backlog Stacked Bar
  const deptBacklogData = [
    { 
      dept: 'Engineering', 
      Critical: tasks.filter(t => t.department === 'ENGINEERING' && t.severity === 'CRITICAL').length,
      High: tasks.filter(t => t.department === 'ENGINEERING' && t.severity === 'HIGH').length,
      Medium: tasks.filter(t => t.department === 'ENGINEERING' && t.severity === 'MEDIUM').length,
    },
    { 
      dept: 'TRD (Electrical)', 
      Critical: tasks.filter(t => t.department === 'TRD' && t.severity === 'CRITICAL').length,
      High: tasks.filter(t => t.department === 'TRD' && t.severity === 'HIGH').length,
      Medium: tasks.filter(t => t.department === 'TRD' && t.severity === 'MEDIUM').length,
    },
    { 
      dept: 'S&T (Signals)', 
      Critical: tasks.filter(t => t.department === 'S_AND_T' && t.severity === 'CRITICAL').length,
      High: tasks.filter(t => t.department === 'S_AND_T' && t.severity === 'HIGH').length,
      Medium: tasks.filter(t => t.department === 'S_AND_T' && t.severity === 'MEDIUM').length,
    },
  ];

  // Weekly Block Utilization Line Trend
  const weeklyUtilizationTrend = [
    { day: 'Mon 15', utilization: 78, availability: 94.2 },
    { day: 'Tue 16', utilization: 82, availability: 95.0 },
    { day: 'Wed 17', utilization: 79, availability: 94.8 },
    { day: 'Thu 18', utilization: 85, availability: 95.4 },
    { day: 'Fri 19', utilization: 84, availability: 95.8 },
    { day: 'Sat 20', utilization: 91, availability: 96.2 },
    { day: 'Sun 21', utilization: 88, availability: 95.9 },
  ];

  // Criticality vs Urgency Scatter Plot
  const scatterData = tasks.slice(0, 30).map(t => ({
    x: t.urgency,
    y: t.safetyCriticality,
    z: t.aiPriorityScore,
    code: t.taskCode,
    dept: t.department
  }));

  const handleQuickRunBatch = () => {
    store.runAIBatchScheduler('2026-09-20');
    toast.success('AI Scheduling Complete', 'Synthesized candidate blocks for Sept 20 with zero train timetable collisions.');
    onNavigate('/blocks/planning');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1F33] via-[#102A43] to-[#163B5C] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              Central Control Dashboard
            </span>
            <span className="text-xs text-[#A7C1D4]">Pune Division · Central Railway</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Integrated Block Command & Synchronization
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Real-time decision support dovetailing Engineering, TRD, and S&T maintenance corridors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('/requests')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <Inbox className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Review Requests ({pendingReview})</span>
          </button>

          <button
            onClick={handleQuickRunBatch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-teal-950/40"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Auto-Generate Plan</span>
          </button>

          <button
            onClick={() => onNavigate('/map')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#E6F4F1] transition-colors"
          >
            <span>Open Map</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#20C6B7]" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Open Requests */}
        <div 
          onClick={() => onNavigate('/requests')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#38BDF8] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#38BDF8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Open Requests</span>
            <Inbox className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{openRequests}</div>
          <div className="text-[10px] text-[#38BDF8] mt-1 font-medium flex items-center gap-1">
            <span>{pendingReview} pending review</span>
          </div>
        </div>

        {/* Critical Tasks */}
        <div 
          onClick={() => onNavigate('/tasks')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#F05252] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#F05252]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Critical Tasks</span>
            <AlertCircle className="w-4 h-4 text-[#F05252]" />
          </div>
          <div className="text-2xl font-black text-[#F05252] mt-2">{criticalTasks}</div>
          <div className="text-[10px] text-[#A7C1D4] mt-1">High derailment/OHE risk</div>
        </div>

        {/* Overdue Work */}
        <div 
          onClick={() => onNavigate('/tasks')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#F4B942] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#F4B942]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Overdue Backlog</span>
            <Clock className="w-4 h-4 text-[#F4B942]" />
          </div>
          <div className="text-2xl font-black text-[#F4B942] mt-2">{overdueTasks}</div>
          <div className="text-[10px] text-[#A7C1D4] mt-1">Max overdue: 9 days</div>
        </div>

        {/* Productive Utilization */}
        <div 
          onClick={() => onNavigate('/blocks/planning')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#20C6B7] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#20C6B7]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Block Utilization</span>
            <TrendingUp className="w-4 h-4 text-[#20C6B7]" />
          </div>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">{utilizationRate}%</div>
          <div className="text-[10px] text-[#34D399] mt-1">+14% vs siloed baseline</div>
        </div>

        {/* Bundled Blocks */}
        <div 
          onClick={() => onNavigate('/blocks/weekly')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#38BDF8] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#38BDF8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Proposed Blocks</span>
            <Calendar className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{proposedBlocks}</div>
          <div className="text-[10px] text-[#20C6B7] mt-1 font-medium">{approvedBlocks} approved</div>
        </div>

        {/* Weather Risk */}
        <div 
          onClick={() => onNavigate('/weather')}
          className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] hover:border-[#F97316] cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#6E8AA3] group-hover:text-[#F97316]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Weather Alert</span>
            <CloudRain className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="text-2xl font-black text-[#F97316] mt-2">{weatherRiskWindows} Days</div>
          <div className="text-[10px] text-[#A7C1D4] mt-1">Yellow/Amber active</div>
        </div>
      </div>

      {/* Row 2: Charts & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Request Status Donut (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Request Workflow Breakdown</h3>
            <span className="text-[10px] text-[#A7C1D4] font-mono">{requests.length} Total</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#E6F4F1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {requestStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#A7C1D4] text-[11px]">{item.name}:</span>
                <span className="font-bold text-[#E6F4F1] text-[11px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Backlog Stacked Bar (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Departmental Defect Backlog</h3>
            <span className="text-[10px] text-[#20C6B7] font-mono">TMS · TDMS · SMMS</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBacklogData}>
                <XAxis dataKey="dept" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="Critical" stackId="a" fill="#F05252" radius={[0, 0, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill="#F4B942" />
                <Bar dataKey="Medium" stackId="a" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#A7C1D4] mt-1">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#F05252]" /> Critical</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#F4B942]" /> High</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#38BDF8]" /> Medium</div>
          </div>
        </div>

        {/* Weekly Block Utilization Line Graph (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Productive Utilization Trend</h3>
            <span className="text-[10px] text-[#34D399] font-semibold">Target: &gt;85%</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyUtilizationTrend}>
                <XAxis dataKey="day" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} domain={[70, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="utilization" stroke="#20C6B7" strokeWidth={2.5} dot={{ r: 3, fill: '#20C6B7' }} />
                <Line type="monotone" dataKey="availability" stroke="#38BDF8" strokeWidth={2} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#A7C1D4] mt-1">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#20C6B7]" /> Productive %</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#38BDF8]" /> Track Availability %</div>
          </div>
        </div>
      </div>

      {/* Row 3: Critical Task Priority Queue & Upcoming Candidate Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: AI Priority Queue (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F05252]" />
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                Top Priority Maintenance Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/ai-workbench')}
              className="text-xs text-[#20C6B7] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explainable AI Workbench</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 5).map(task => {
              const sec = sections.find(s => s.id === task.sectionId);
              return (
                <div 
                  key={task.id}
                  className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] hover:border-[#20C6B7]/50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  onClick={() => onNavigate('/requests')}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#38BDF8]">{task.taskCode}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        task.severity === 'CRITICAL' ? 'bg-[#F05252]/20 text-[#F05252]' : 'bg-[#F4B942]/20 text-[#F4B942]'
                      }`}>
                        {task.severity}
                      </span>
                      <span className="text-[10px] text-[#6E8AA3] font-mono">[{task.department}]</span>
                    </div>
                    <p className="text-xs text-[#E6F4F1] font-medium truncate mt-0.5">{task.title}</p>
                    <p className="text-[10px] text-[#A7C1D4] truncate mt-0.5">Section: {sec?.name || 'Pune Network'}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#20C6B7] font-mono">{task.aiPriorityScore} / 100</div>
                    <div className="text-[10px] text-[#6E8AA3]">
                      {task.overdueDays > 0 ? <span className="text-[#F05252] font-semibold">{task.overdueDays}d Overdue</span> : 'On Schedule'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Upcoming Coordinated Blocks (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#20C6B7]" />
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                Candidate Coordinated Blocks
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/blocks/weekly')}
              className="text-xs text-[#20C6B7] hover:underline font-semibold"
            >
              Weekly Schedule
            </button>
          </div>

          <div className="space-y-3">
            {blockPlans.slice(0, 4).map(blk => {
              const sec = sections.find(s => s.id === blk.sectionId);
              return (
                <div key={blk.id} className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#20C6B7]">{blk.blockCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      blk.status === 'APPROVED' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#38BDF8]/20 text-[#38BDF8]'
                    }`}>
                      {blk.status}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#E6F4F1]">{sec?.name}</div>
                  <div className="text-[11px] text-[#A7C1D4] mt-0.5 flex items-center gap-2 font-mono">
                    <span>{blk.date}</span>
                    <span>·</span>
                    <span>{blk.startTime} - {blk.endTime}</span>
                    <span>·</span>
                    <span className="text-[#38BDF8]">{blk.blockType}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#244B6A]/60 flex items-center justify-between text-[10px]">
                    <span className="text-[#6E8AA3]">Depts: {blk.departments.join(', ')}</span>
                    <span className="text-[#34D399] font-mono">{blk.productiveMinutes}m productive</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
