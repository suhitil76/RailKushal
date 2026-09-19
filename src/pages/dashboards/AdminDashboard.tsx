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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#F05252]/20 border border-[#F05252]/40 text-[#F05252] text-[10px] font-bold uppercase tracking-wider font-mono">
              System Administration
            </span>
            <span className="text-xs text-[#A7C1D4]">CRIS / Central Railway Platform Governance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            RailKushal Infrastructure &amp; AI Control Plane
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Manage data integration adapters, AI scoring weights, user privileges, and demo environment state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/data-integration')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-teal-950/40"
          >
            <Database className="w-4 h-4" />
            <span>Data Integration Centre</span>
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F05252]/20 hover:bg-[#F05252]/30 border border-[#F05252]/50 text-xs font-bold text-[#F05252] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Active Demo Users</span>
          <div className="text-2xl font-black text-[#E6F4F1] mt-2">{state.users.length} Roles</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">RBAC Enforced</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#20C6B7] uppercase">Data Integration Freshness</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2">100% Online</div>
          <p className="text-[10px] text-[#34D399] mt-1">6/6 Sources Synchronized</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#38BDF8] uppercase">Audit Trail Events</span>
          <div className="text-2xl font-black text-[#38BDF8] mt-2">{state.auditLogs.length}</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Immutable Log</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F4B942] uppercase">Failed Records / Errors</span>
          <div className="text-2xl font-black text-[#34D399] mt-2">0</div>
          <p className="text-[10px] text-[#34D399] mt-1">Zero Schema Violations</p>
        </div>
      </div>

      {/* Data Source Freshness Cards */}
      <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#20C6B7]" />
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
              Connected Railway Maintenance &amp; Operations Systems
            </h3>
          </div>
          <span className="text-[10px] text-[#6E8AA3] font-mono">Central Railway Data Feeds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dataSources.map((ds, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E6F4F1] truncate mr-2">{ds.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399]">
                  {ds.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#A7C1D4] mt-3 font-mono">
                <span>{ds.records} Records</span>
                <span>Freshness: {ds.freshness}</span>
              </div>
              <div className="mt-2 text-[10px] text-[#20C6B7] flex items-center justify-between">
                <span>Quality Score: {ds.quality}</span>
                <span className="text-[#38BDF8] hover:underline cursor-pointer" onClick={() => onNavigate('/data-integration')}>Inspect</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Weights Summary */}
      <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-[#20C6B7]" />
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
              Explainable AI Prioritization Formula Weights
            </h3>
          </div>
          <p className="text-xs text-[#A7C1D4] mt-1">
            Safety Criticality (30%) + Failure Prob (20%) + Urgency (15%) + Availability Impact (15%) + Overdue (10%) + Weather (10%)
          </p>
        </div>
        <button
          onClick={() => onNavigate('/ai-workbench')}
          className="px-3.5 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-bold text-[#20C6B7] transition-colors shrink-0"
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
