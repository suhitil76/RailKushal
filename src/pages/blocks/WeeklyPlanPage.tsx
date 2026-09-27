import React, { useState } from 'react';
import { 
  CalendarRange, CheckCircle2, AlertCircle, Clock, ShieldCheck, 
  Filter, CheckSquare, Download, Sparkles, UserCheck 
} from 'lucide-react';
import { store } from '../../services/store';
import { BlockPlan, Department } from '../../types/railway';
import { toast } from '../../components/common/Toast';

interface WeeklyPlanPageProps {
  onNavigate: (path: string) => void;
}

export const WeeklyPlanPage: React.FC<WeeklyPlanPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const currentUser = state.currentUser;
  const isControlOffice = currentUser?.role === 'CONTROL_OFFICE' || currentUser?.role === 'ADMIN';

  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showActuals, setShowActuals] = useState<boolean>(false);

  const daysOfWeek = [
    { day: 'Mon 15', date: '2026-09-15' },
    { day: 'Tue 16', date: '2026-09-16' },
    { day: 'Wed 17', date: '2026-09-17' },
    { day: 'Thu 18', date: '2026-09-18' },
    { day: 'Fri 19', date: '2026-09-19' },
    { day: 'Sat 20', date: '2026-09-20' },
    { day: 'Sun 21', date: '2026-09-21' },
  ];

  const filteredBlocks = state.blockPlans.filter(b => {
    if (selectedDept !== 'ALL' && !b.departments.includes(selectedDept as any)) return false;
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) return false;
    return true;
  });

  const handleToggleReadiness = (blockId: string, deptKey: any) => {
    store.toggleReadiness(blockId, deptKey);
    toast.info('Readiness Updated', 'Department readiness confirmation recorded in audit trail.');
  };

  const handleApprove = (blockId: string) => {
    if (!isControlOffice) {
      toast.error('Unauthorized', 'Only Control Office can publish division block schedules.');
      return;
    }
    store.approveAndPublishBlockPlan(blockId);
    toast.success('Block Formally Approved', 'Schedule locked and published to Operating Control.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-cyan/20 border border-rail-cyan/40 text-rail-cyan text-[10px] font-bold uppercase tracking-wider font-mono">
              Rolling Block Program (RBP)
            </span>
            <span className="text-xs text-rail-secondary">Week 38 (Sept 15 - Sept 21, 2026)</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            Pune Division 7-Day Synchronized Block Schedule
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Cross-departmental corridor allocations with live departmental readiness confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActuals(!showActuals)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              showActuals ? 'bg-rail-teal text-white border-rail-teal' : 'bg-rail-surface text-rail-secondary border-rail-border'
            }`}
          >
            {showActuals ? 'Showing Actual Executed Time' : 'Show Planned Schedule'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-rail-deep border border-rail-border">
        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-rail-bg border border-rail-border rounded-lg px-3 py-1.5 text-xs text-rail-text focus:border-rail-teal"
          >
            <option value="ALL">All Departments</option>
            <option value="ENGINEERING">Engineering Only</option>
            <option value="TRD">TRD Only</option>
            <option value="S_AND_T">S&amp;T Only</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-rail-bg border border-rail-border rounded-lg px-3 py-1.5 text-xs text-rail-text focus:border-rail-teal"
          >
            <option value="ALL">All Statuses</option>
            <option value="PROPOSED">Proposed (Candidate)</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
            <option value="COMPLETED">Completed (Historical)</option>
          </select>
        </div>

        <span className="text-xs text-rail-secondary font-mono">
          Showing <strong className="text-rail-teal">{filteredBlocks.length}</strong> active block allocations
        </span>
      </div>

      {/* 7-Day Matrix Table */}
      <div className="bg-rail-deep border border-rail-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-rail-surface text-rail-secondary border-b border-rail-border text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5 w-48 border-r border-rail-border">Corridor Section</th>
                {daysOfWeek.map((d, i) => (
                  <th key={i} className="p-3.5 border-r border-rail-border text-center min-w-[160px]">
                    <span className="text-rail-text font-bold block">{d.day}</span>
                    <span className="text-[10px] text-rail-muted font-mono font-normal">Corridor Window</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#244B6A]/50 font-mono text-[11px]">
              {state.sections.slice(0, 8).map(sec => (
                <tr key={sec.id} className="hover:bg-rail-surface/40 transition-colors">
                  <td className="p-3.5 font-bold text-rail-text border-r border-rail-border bg-rail-bg/40">
                    <p className="font-sans font-bold">{sec.name}</p>
                    <span className="text-[10px] text-rail-muted">{sec.code} ({sec.lengthKm}km)</span>
                  </td>

                  {daysOfWeek.map((d, i) => {
                    const blockInCell = filteredBlocks.find(b => b.sectionId === sec.id && (b.date === d.date || i === 5));

                    return (
                      <td key={i} className="p-2.5 border-r border-rail-border align-top">
                        {blockInCell ? (
                          <div className={`p-2.5 rounded-xl border space-y-1.5 transition-all shadow-sm ${
                            blockInCell.status === 'PUBLISHED' ? 'bg-rail-emerald/15 border-rail-emerald/40 text-rail-text' :
                            blockInCell.blockType === 'INTEGRATED' ? 'bg-rail-cyan/15 border-rail-cyan/40 text-rail-text' :
                            'bg-rail-bg border-rail-border text-rail-secondary'
                          }`}>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-rail-teal">{blockInCell.blockCode}</span>
                              <span className="text-[9px] px-1 rounded bg-rail-deep text-rail-secondary">{blockInCell.blockType}</span>
                            </div>

                            <div className="text-[10px] text-rail-secondary">
                              {showActuals && blockInCell.actualExecution ? (
                                <span className="text-rail-emerald font-bold">Act: {blockInCell.actualExecution.actualStart}-{blockInCell.actualExecution.actualEnd}</span>
                              ) : (
                                <span>{blockInCell.startTime} - {blockInCell.endTime}</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-rail-muted pt-1 border-t border-rail-border/50">
                              <span>{blockInCell.departments.join('+')}</span>
                              <span>{blockInCell.productiveMinutes}m prod</span>
                            </div>

                            {/* Readiness checkboxes */}
                            <div className="flex items-center gap-1.5 pt-1 text-[9px]">
                              <span title="P-Way Ready" onClick={() => handleToggleReadiness(blockInCell.id, 'engineeringReady')} className={`cursor-pointer px-1 rounded ${blockInCell.readinessChecklist.engineeringReady ? 'bg-rail-emerald/20 text-rail-emerald' : 'bg-rail-border text-rail-muted'}`}>P</span>
                              <span title="TRD Ready" onClick={() => handleToggleReadiness(blockInCell.id, 'trdIsolationReady')} className={`cursor-pointer px-1 rounded ${blockInCell.readinessChecklist.trdIsolationReady ? 'bg-rail-cyan/20 text-rail-cyan' : 'bg-rail-border text-rail-muted'}`}>T</span>
                              <span title="S&T Ready" onClick={() => handleToggleReadiness(blockInCell.id, 'sntDisconnectionReady')} className={`cursor-pointer px-1 rounded ${blockInCell.readinessChecklist.sntDisconnectionReady ? 'bg-rail-amber/20 text-rail-amber' : 'bg-rail-border text-rail-muted'}`}>S</span>
                              
                              {isControlOffice && blockInCell.status !== 'PUBLISHED' && (
                                <button
                                  onClick={() => handleApprove(blockInCell.id)}
                                  className="ml-auto px-1.5 py-0.5 rounded bg-rail-teal text-white font-bold text-[9px]"
                                >
                                  Publish
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-[10px] text-[#244B6A]">
                            Free Corridor
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
