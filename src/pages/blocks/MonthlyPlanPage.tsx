import React, { useState } from 'react';
import { 
  Layers, Calendar, BarChart3, TrendingDown, TrendingUp, 
  Sparkles, Download, CheckCircle2, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { store } from '../../services/store';
import { toast } from '../../components/common/Toast';

interface MonthlyPlanPageProps {
  onNavigate: (path: string) => void;
}

export const MonthlyPlanPage: React.FC<MonthlyPlanPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const [viewMode, setViewMode] = useState<'HEATMAP' | 'FORECAST'>('HEATMAP');

  const monthlyCapacityData = [
    { week: 'Week 38 (Current)', availableCapacityHours: 84, demandedHours: 72, allocatedHours: 68 },
    { week: 'Week 39', availableCapacityHours: 84, demandedHours: 65, allocatedHours: 62 },
    { week: 'Week 40', availableCapacityHours: 78, demandedHours: 58, allocatedHours: 55 },
    { week: 'Week 41', availableCapacityHours: 84, demandedHours: 50, allocatedHours: 48 },
    { week: 'Week 42', availableCapacityHours: 84, demandedHours: 44, allocatedHours: 42 },
  ];

  const backlogReductionForecast = [
    { week: 'W37 (Prior)', backlog: 182, availability: 94.2 },
    { week: 'W38 (Cur)', backlog: 148, availability: 95.8 },
    { week: 'W39', backlog: 112, availability: 96.4 },
    { week: 'W40', backlog: 82, availability: 97.0 },
    { week: 'W41', backlog: 56, availability: 97.5 },
    { week: 'W42', backlog: 38, availability: 98.1 },
  ];

  const handleReoptimize = () => {
    toast.success('Rolling Optimization Complete', '4-week rolling corridor demand balanced with zero peak train conflicts.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-cyan/20 border border-rail-cyan/40 text-rail-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
              Long-Term Rolling Program
            </span>
            <span className="text-xs text-rail-secondary">4 to 6-Week Horizon Capacity Synchronization</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            Monthly Corridor Capacity &amp; Backlog Forecast
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Macro-level corridor planning, track tamping cycles, deep screening programs, and availability recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReoptimize}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-Optimize Rolling Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-muted uppercase">4-Week Capacity Window</span>
          <div className="text-2xl font-black text-rail-text mt-2">336 Hours</div>
          <p className="text-[10px] text-rail-emerald mt-1">Stipulated corridor slots</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-teal uppercase">Backlog Reduction Rate</span>
          <div className="text-2xl font-black text-rail-teal mt-2">-74% in 4 Weeks</div>
          <p className="text-[10px] text-rail-emerald mt-1">From 148 to 38 tasks</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-cyan uppercase">Forecast Availability</span>
          <div className="text-2xl font-black text-rail-cyan mt-2">98.1% Target</div>
          <p className="text-[10px] text-rail-secondary mt-1">+3.9% improvement</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-amber uppercase">Weather Gated Demand</span>
          <div className="text-2xl font-black text-rail-amber mt-2">12 Tasks</div>
          <p className="text-[10px] text-rail-secondary mt-1">Monsoon window deferred</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Capacity vs Demand (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
            Corridor Block Demand vs Stipulated Capacity (Hours/Week)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCapacityData}>
                <XAxis dataKey="week" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
                <Bar dataKey="availableCapacityHours" fill="#163B5C" name="Available Corridor Capacity" radius={[4, 4, 0, 0]} />
                <Bar dataKey="allocatedHours" fill="#20C6B7" name="AI Allocated Integrated Hours" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-rail-secondary mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-elevated" /> Free Corridor Capacity</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-teal" /> Coordinated Maintenance Blocks</div>
          </div>
        </div>

        {/* Backlog Reduction & Availability Forecast (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-rail-deep border border-rail-border">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
            Track Defect Backlog Reduction &amp; Availability Recovery
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={backlogReductionForecast}>
                <XAxis dataKey="week" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '11px' }} />
                <Area type="monotone" dataKey="backlog" stroke="#F05252" fill="#F05252" fillOpacity={0.15} name="Backlog Tasks" />
                <Area type="monotone" dataKey="availability" stroke="#34D399" fill="#34D399" fillOpacity={0.15} name="Track Availability %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-rail-secondary mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-coral" /> Active Backlog</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rail-emerald" /> Infrastructure Availability %</div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="mt-8 bg-rail-deep border border-rail-border p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
            October 2026 Integrated Block Calendar
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-rail-secondary">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-rail-emerald/20 border border-rail-emerald/40" /> Clear Corridors</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-rail-amber/20 border border-rail-amber/40" /> Traffic Constraints</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-rail-coral/20 border border-rail-coral/40" /> Mega Blocks</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-rail-muted uppercase pb-2 border-b border-rail-border/50">
              {day}
            </div>
          ))}
          {/* Pad the first week (assuming Oct 1 is Thursday) */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[80px] p-2 rounded-xl border border-transparent opacity-30 bg-rail-surface/30"></div>
          ))}
          {/* Calendar Days */}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            let statusClass = "bg-rail-surface border-rail-border hover:border-rail-teal/50";
            let event = null;
            
            if ([2, 9, 16, 23, 30].includes(day)) {
              statusClass = "bg-rail-emerald/10 border-rail-emerald/30";
              event = <div className="mt-1 text-[9px] font-medium text-rail-emerald bg-rail-emerald/20 px-1 py-0.5 rounded truncate">Routine Maintenance</div>;
            } else if ([7, 21].includes(day)) {
              statusClass = "bg-rail-amber/10 border-rail-amber/30";
              event = <div className="mt-1 text-[9px] font-medium text-rail-amber bg-rail-amber/20 px-1 py-0.5 rounded truncate">VIP/Special Trains</div>;
            } else if ([11, 25].includes(day)) {
              statusClass = "bg-rail-coral/10 border-rail-coral/30";
              event = <div className="mt-1 text-[9px] font-medium text-rail-coral bg-rail-coral/20 px-1 py-0.5 rounded truncate">Mega Block (6hr)</div>;
            }

            return (
              <div key={day} className={`min-h-[80px] p-2 rounded-xl border ${statusClass} transition-colors cursor-pointer group`}>
                <span className="text-xs font-bold text-rail-secondary group-hover:text-rail-text">{day}</span>
                {event}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
