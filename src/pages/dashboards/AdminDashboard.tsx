import React, { useState } from 'react';
import { 
  Users, Database, Settings2, RotateCcw, ShieldCheck, 
  CheckCircle2, AlertTriangle, CloudSun, ArrowRight 
} from 'lucide-react';
import { store } from '../../services/store';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { toast } from '../../components/common/Toast';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const [showResetModal, setShowResetModal] = useState(false);

  const dataSources = [
    { name: 'Track Management System (TMS)', records: state.tasks.filter(t => t.sourceSystem === 'TMS').length, status: 'Online · Synced', freshness: '3 mins ago', quality: '98%' },
    { name: 'Traction Distribution (TDMS)', records: state.tasks.filter(t => t.sourceSystem === 'TDMS').length, status: 'Online · Synced', freshness: '7 mins ago', quality: '96%' },
    { name: 'Signalling Maintenance (SMMS)', records: state.tasks.filter(t => t.sourceSystem === 'SMMS').length, status: 'Online · Synced', freshness: '12 mins ago', quality: '97%' },
    { name: 'Control Office App (COA)', records: state.corridorWindows.length, status: 'Live Stream', freshness: 'Real-time', quality: '99%' },
    { name: 'Train Timetable & Freight Forecast', records: state.timetable.length, status: 'Active (7-day)', freshness: '1 hr ago', quality: '100%' },
    { name: 'IMD Pune Weather Radar', records: state.weather.length, status: '14-Day Model', freshness: '30 mins ago', quality: '94%' },
  ];

  const handleConfirmReset = () => {
    store.resetToDemoData();
    setShowResetModal(false);
    toast.success('Database Reset', 'All records restored to initial Pune Division synthetic demo state.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-coral/20 border border-rail-coral/40 text-rail-coral text-[10px] font-bold uppercase tracking-wider font-mono">
              System Administration
            </span>
            <span className="text-xs text-rail-secondary">CRIS / Central Railway Platform Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            RailKushal Infrastructure &amp; AI Control Plane
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Manage data integration adapters, AI scoring weights, user privileges, and demo environment state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/data-integration')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/40"
          >
            <Database className="w-4 h-4" />
            <span>Data Integration Centre</span>
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rail-coral/20 hover:bg-rail-coral/30 border border-rail-coral/50 text-xs font-bold text-rail-coral transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-muted uppercase">Active Demo Users</span>
          <div className="text-2xl font-black text-rail-text mt-2">{state.users.length} Roles</div>
          <p className="text-[10px] text-rail-secondary mt-1">RBAC Enforced</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-teal uppercase">Data Integration Freshness</span>
          <div className="text-2xl font-black text-rail-teal mt-2">100% Online</div>
          <p className="text-[10px] text-rail-emerald mt-1">6/6 Sources Synchronized</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-cyan uppercase">Audit Trail Events</span>
          <div className="text-2xl font-black text-rail-cyan mt-2">{state.auditLogs.length}</div>
          <p className="text-[10px] text-rail-secondary mt-1">Immutable Log</p>
        </div>
        <div className="p-4 rounded-xl bg-rail-deep border border-rail-border">
          <span className="text-[11px] font-semibold text-rail-amber uppercase">Failed Records / Errors</span>
          <div className="text-2xl font-black text-rail-emerald mt-2">0</div>
          <p className="text-[10px] text-rail-emerald mt-1">Zero Schema Violations</p>
        </div>
      </div>

      {/* Data Source Freshness Cards */}
      <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-rail-teal" />
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
              Connected Railway Maintenance &amp; Operations Systems
            </h3>
          </div>
          <span className="text-[10px] text-rail-muted font-mono">Central Railway Data Feeds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dataSources.map((ds, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-rail-bg border border-rail-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rail-text truncate mr-2">{ds.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rail-emerald/20 text-rail-emerald">
                  {ds.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-rail-secondary mt-3 font-mono">
                <span>{ds.records} Records</span>
                <span>Freshness: {ds.freshness}</span>
              </div>
              <div className="mt-2 text-[10px] text-rail-teal flex items-center justify-between">
                <span>Quality Score: {ds.quality}</span>
                <span className="text-rail-cyan hover:underline cursor-pointer" onClick={() => onNavigate('/data-integration')}>Inspect</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Weights Summary */}
      <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-rail-teal" />
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
              Explainable AI Prioritization Formula Weights
            </h3>
          </div>
          <p className="text-xs text-rail-secondary mt-1">
            Safety Criticality (30%) + Failure Prob (20%) + Urgency (15%) + Availability Impact (15%) + Overdue (10%) + Weather (10%)
          </p>
        </div>
        <button
          onClick={() => onNavigate('/ai-workbench')}
          className="px-3.5 py-2 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-bold text-rail-teal transition-colors shrink-0"
        >
          Configure AI Sliders
        </button>
      </div>

      {/* Confirmation Modal for Reset */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Demo Operational Database"
        description="Are you sure you want to reset all records to the original Pune Division synthetic dataset? This will restore all default tasks, requests, weather alerts, and candidate blocks."
        confirmLabel="Reset Database Now"
        type="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
