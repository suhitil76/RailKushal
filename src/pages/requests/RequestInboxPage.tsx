import React, { useState } from 'react';
import { 
  Inbox, Filter, CheckCircle2, XCircle, HelpCircle, PauseCircle, 
  Search, Eye, Merge, Sparkles, Layers, ArrowUpDown, ChevronRight 
} from 'lucide-react';
import { store } from '../../services/store';
import { MaintenanceRequest, MaintenanceTask, Department, RequestStatus } from '../../types/railway';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { toast } from '../../components/common/Toast';

interface RequestInboxPageProps {
  onNavigate: (path: string) => void;
  onSelectRequest: (requestId: string) => void;
}

export const RequestInboxPage: React.FC<RequestInboxPageProps> = ({ 
  onNavigate,
  onSelectRequest 
}) => {
  const state = store.getState();
  const currentUser = state.currentUser;
  const isControlOffice = currentUser?.role === 'CONTROL_OFFICE' || currentUser?.role === 'ADMIN';

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'ACCEPT' | 'DECLINE' | 'CLARIFY' | 'HOLD' | 'MERGE';
    reqId: string;
    reqCode: string;
  }>({
    isOpen: false,
    type: 'ACCEPT',
    reqId: '',
    reqCode: ''
  });

  // Selected request checkboxes for multi-select merge
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Filter requests based on user department (if Engineering/TRD/S&T, show only their own unless Control Office)
  let visibleRequests = state.requests;
  if (!isControlOffice && currentUser?.department) {
    visibleRequests = visibleRequests.filter(r => r.department === currentUser.department);
  }

  // Apply filters
  const filteredRequests = visibleRequests.filter(req => {
    const task = state.tasks.find(t => t.id === req.taskId);
    if (selectedDept !== 'ALL' && req.department !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && req.status !== selectedStatus) return false;
    if (selectedSection !== 'ALL' && task?.sectionId !== selectedSection) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = req.requestCode.toLowerCase().includes(q);
      const matchTitle = task?.title.toLowerCase().includes(q);
      const matchTask = task?.taskCode.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchTask) return false;
    }
    return true;
  });

  const handleActionClick = (type: 'ACCEPT' | 'DECLINE' | 'CLARIFY' | 'HOLD', reqId: string, reqCode: string) => {
    setModalState({ isOpen: true, type, reqId, reqCode });
  };

  const handleConfirmModal = (reason?: string) => {
    const { type, reqId } = modalState;
    if (type === 'ACCEPT') {
      store.updateRequestStatus(reqId, 'ACCEPTED', reason || 'Corridor window verified and approved.');
      toast.success('Request Accepted', 'The maintenance window is added to the candidate block pool.');
    } else if (type === 'DECLINE') {
      store.updateRequestStatus(reqId, 'DECLINED', reason || 'Declined due to corridor traffic congestion.');
      toast.error('Request Declined', 'Rejection reason dispatched to requesting officer.');
    } else if (type === 'CLARIFY') {
      store.updateRequestStatus(reqId, 'CLARIFICATION_REQUESTED', undefined, reason);
      toast.warning('Clarification Requested', 'Notification dispatched to submitting department.');
    } else if (type === 'HOLD') {
      store.updateRequestStatus(reqId, 'HOLD', reason || 'Held pending rolling block review.');
      toast.info('Request On Hold', 'Request placed on hold.');
    } else if (type === 'MERGE') {
      store.runAIBatchScheduler('2026-09-20');
      toast.success('Requests Merged', 'Candidate Integrated Block synthesized in Block Planning Workspace.');
      onNavigate('/blocks/planning');
    }
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const toggleSelectRow = (reqId: string) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(reqId)) next.delete(reqId);
      else next.add(reqId);
      return next;
    });
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-emerald/20 text-rail-emerald border border-rail-emerald/30">ACCEPTED</span>;
      case 'DECLINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-coral/20 text-rail-coral border border-rail-coral/30">DECLINED</span>;
      case 'CLARIFICATION_REQUESTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-amber/20 text-rail-amber border border-rail-amber/30">CLARIFY</span>;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-cyan/20 text-rail-cyan border border-rail-cyan/30">IN REVIEW</span>;
      case 'HOLD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-muted/20 text-rail-secondary border border-[#6E8AA3]/30">ON HOLD</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-muted/20 text-rail-muted">DRAFT</span>;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-teal/20 border border-rail-teal/40 text-rail-teal text-[10px] font-bold uppercase tracking-wider font-mono">
              Operational Inbox
            </span>
            <span className="text-xs text-rail-secondary">
              {isControlOffice ? 'All Department Demands' : `${currentUser?.department} Demands`}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            Maintenance Request Review &amp; Dispatch
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            {isControlOffice 
              ? 'Evaluate, accept, clarify, or bundle corridor block demands from Engineering, TRD, and S&T.'
              : 'Track status of your submitted demands and respond to Control Office clarification notes.'}
          </p>
        </div>

        {isControlOffice && selectedRowIds.size >= 2 && (
          <button
            onClick={() => setModalState({ isOpen: true, type: 'MERGE', reqId: '', reqCode: `${selectedRowIds.size} Demands` })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow-lg shadow-teal-950/40 transition-all animate-pulse"
          >
            <Merge className="w-4 h-4" />
            <span>Merge ({selectedRowIds.size}) Compatible Demands into Integrated Block</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-rail-deep border border-rail-border">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rail-muted" />
            <input
              type="text"
              placeholder="Search request code, task, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-rail-bg border border-rail-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-rail-text placeholder-[#6E8AA3] focus:outline-none focus:border-rail-teal"
            />
          </div>

          {/* Department Filter (if control office) */}
          {isControlOffice && (
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-rail-bg border border-rail-border rounded-lg px-2.5 py-1.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal"
            >
              <option value="ALL">All Departments</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="TRD">TRD (Electrical)</option>
              <option value="S_AND_T">S&T (Signals)</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-rail-bg border border-rail-border rounded-lg px-2.5 py-1.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted / In Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CLARIFICATION_REQUESTED">Clarification Requested</option>
            <option value="DECLINED">Declined</option>
            <option value="HOLD">On Hold</option>
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="bg-rail-bg border border-rail-border rounded-lg px-2.5 py-1.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal max-w-[200px]"
          >
            <option value="ALL">All Sections</option>
            {state.sections.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-rail-secondary font-mono">
          Showing <span className="text-rail-teal font-bold">{filteredRequests.length}</span> demands
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-rail-deep border border-rail-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-rail-surface text-rail-secondary border-b border-rail-border select-none uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                {isControlOffice && <th className="p-3.5 w-10 text-center">Merge</th>}
                <th className="p-3.5">Request Code</th>
                <th className="p-3.5">Dept</th>
                <th className="p-3.5">Task Description</th>
                <th className="p-3.5">Section</th>
                <th className="p-3.5">Block Type</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">AI Priority</th>
                <th className="p-3.5">Overdue</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#244B6A]/50">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-xs text-rail-muted">
                    No maintenance demands matching active filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  const task = state.tasks.find(t => t.id === req.taskId);
                  const sec = state.sections.find(s => s.id === task?.sectionId);
                  const isChecked = selectedRowIds.has(req.id);

                  return (
                    <tr 
                      key={req.id}
                      className="hover:bg-rail-surface/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectRequest(req.id)}
                    >
                      {/* Checkbox for merge */}
                      {isControlOffice && (
                        <td className="p-3.5 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(req.id)}
                            className="rounded border-rail-border text-rail-teal focus:ring-[#20C6B7] bg-rail-bg"
                          />
                        </td>
                      )}

                      {/* Request Code */}
                      <td className="p-3.5 font-mono font-bold text-rail-cyan">
                        {req.requestCode}
                      </td>

                      {/* Department */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          req.department === 'ENGINEERING' ? 'bg-rail-teal/15 text-rail-teal' :
                          req.department === 'TRD' ? 'bg-rail-cyan/15 text-rail-cyan' : 'bg-rail-amber/15 text-rail-amber'
                        }`}>
                          {req.department}
                        </span>
                      </td>

                      {/* Task title */}
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-rail-text truncate">{task?.title || 'Maintenance Task'}</p>
                        <p className="text-[11px] text-rail-muted truncate">{task?.defectType}</p>
                      </td>

                      {/* Section */}
                      <td className="p-3.5 text-rail-secondary whitespace-nowrap">
                        {sec?.name || 'Section'}
                      </td>

                      {/* Block Type */}
                      <td className="p-3.5">
                        <span className="font-mono text-[11px] text-rail-secondary">
                          {task?.requiredBlockType || 'LINE'}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="p-3.5 text-rail-text font-mono whitespace-nowrap">
                        {req.requestedDurationMinutes} mins
                      </td>

                      {/* AI Priority */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${
                            (task?.aiPriorityScore || 0) >= 85 ? 'text-rail-coral' :
                            (task?.aiPriorityScore || 0) >= 70 ? 'text-rail-amber' : 'text-rail-emerald'
                          }`}>
                            {task?.aiPriorityScore || 70}
                          </span>
                          <span className="text-[9px] text-rail-muted">/100</span>
                        </div>
                      </td>

                      {/* Overdue */}
                      <td className="p-3.5 whitespace-nowrap">
                        {(task?.overdueDays || 0) > 0 ? (
                          <span className="text-rail-coral font-semibold font-mono text-[11px]">
                            {task?.overdueDays}d overdue
                          </span>
                        ) : (
                          <span className="text-rail-muted text-[11px]">On-time</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isControlOffice && (req.status === 'SUBMITTED' || req.status === 'UNDER_REVIEW') ? (
                            <>
                              <button
                                onClick={() => handleActionClick('ACCEPT', req.id, req.requestCode)}
                                className="p-1.5 rounded bg-rail-emerald/15 hover:bg-rail-emerald/30 text-rail-emerald transition-colors"
                                title="Accept Request into Candidate Corridor Pool"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleActionClick('CLARIFY', req.id, req.requestCode)}
                                className="p-1.5 rounded bg-rail-amber/15 hover:bg-rail-amber/30 text-rail-amber transition-colors"
                                title="Return for Clarification"
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleActionClick('DECLINE', req.id, req.requestCode)}
                                className="p-1.5 rounded bg-rail-coral/15 hover:bg-rail-coral/30 text-rail-coral transition-colors"
                                title="Decline Request"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onSelectRequest(req.id)}
                              className="px-2.5 py-1 rounded bg-rail-surface hover:bg-rail-elevated text-rail-cyan font-semibold text-[11px] transition-colors"
                            >
                              Inspect
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={
          modalState.type === 'ACCEPT' ? `Accept Maintenance Demand ${modalState.reqCode}` :
          modalState.type === 'DECLINE' ? `Decline Maintenance Demand ${modalState.reqCode}` :
          modalState.type === 'CLARIFY' ? `Request Clarification on ${modalState.reqCode}` :
          modalState.type === 'MERGE' ? `Synthesize Integrated Block (${modalState.reqCode})` :
          `Place Demand on Hold`
        }
        description={
          modalState.type === 'ACCEPT' 
            ? 'Accepting this demand will lock it into the Central Control candidate block pool for nocturnal timetable synchronization.' :
          modalState.type === 'DECLINE'
            ? 'Declining this demand will formally return it to the submitting department with operational refusal grounds.' :
          modalState.type === 'CLARIFY'
            ? 'State the specific operational or safety questions needed from the submitting supervisor before block sanction.' :
            'Combine selected compatible multi-department demands into a unified Integrated Corridor Block.'
        }
        confirmLabel={
          modalState.type === 'ACCEPT' ? 'Accept Demand' :
          modalState.type === 'DECLINE' ? 'Decline Demand' :
          modalState.type === 'CLARIFY' ? 'Dispatch Clarification' :
          'Generate Integrated Block'
        }
        type={modalState.type === 'ACCEPT' ? 'success' : modalState.type === 'DECLINE' ? 'danger' : 'warning'}
        requireReason={modalState.type === 'DECLINE' || modalState.type === 'CLARIFY'}
        reasonPlaceholder={
          modalState.type === 'DECLINE' 
            ? 'Specify operational refusal grounds (e.g. Up Goods congestion, rake maintenance bottleneck)...'
            : 'Detail clarification required (e.g. confirm machine crew availability, backup cable status)...'
        }
        onConfirm={handleConfirmModal}
        onCancel={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
