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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">ACCEPTED</span>;
      case 'DECLINED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F05252]/20 text-[#F05252] border border-[#F05252]/30">DECLINED</span>;
      case 'CLARIFICATION_REQUESTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4B942]/20 text-[#F4B942] border border-[#F4B942]/30">CLARIFY</span>;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">IN REVIEW</span>;
      case 'HOLD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6E8AA3]/20 text-[#A7C1D4] border border-[#6E8AA3]/30">ON HOLD</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6E8AA3]/20 text-[#6E8AA3]">DRAFT</span>;
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              Operational Inbox
            </span>
            <span className="text-xs text-[#A7C1D4]">
              {isControlOffice ? 'All Department Demands' : `${currentUser?.department} Demands`}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Maintenance Request Review &amp; Dispatch
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            {isControlOffice 
              ? 'Evaluate, accept, clarify, or bundle corridor block demands from Engineering, TRD, and S&T.'
              : 'Track status of your submitted demands and respond to Control Office clarification notes.'}
          </p>
        </div>

        {isControlOffice && selectedRowIds.size >= 2 && (
          <button
            onClick={() => setModalState({ isOpen: true, type: 'MERGE', reqId: '', reqCode: `${selectedRowIds.size} Demands` })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs shadow-lg shadow-teal-950/40 transition-all animate-pulse"
          >
            <Merge className="w-4 h-4" />
            <span>Merge ({selectedRowIds.size}) Compatible Demands into Integrated Block</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E8AA3]" />
            <input
              type="text"
              placeholder="Search request code, task, title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#071626] border border-[#244B6A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7]"
            />
          </div>

          {/* Department Filter (if control office) */}
          {isControlOffice && (
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-[#071626] border border-[#244B6A] rounded-lg px-2.5 py-1.5 text-xs text-[#E6F4F1] focus:outline-none focus:border-[#20C6B7]"
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
            className="bg-[#071626] border border-[#244B6A] rounded-lg px-2.5 py-1.5 text-xs text-[#E6F4F1] focus:outline-none focus:border-[#20C6B7]"
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
            className="bg-[#071626] border border-[#244B6A] rounded-lg px-2.5 py-1.5 text-xs text-[#E6F4F1] focus:outline-none focus:border-[#20C6B7] max-w-[200px]"
          >
            <option value="ALL">All Sections</option>
            {state.sections.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#A7C1D4] font-mono">
          Showing <span className="text-[#20C6B7] font-bold">{filteredRequests.length}</span> demands
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#0B1F33] border border-[#244B6A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#102A43] text-[#A7C1D4] border-b border-[#244B6A] select-none uppercase tracking-wider font-semibold text-[10px]">
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
                  <td colSpan={11} className="p-12 text-center text-xs text-[#6E8AA3]">
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
                      className="hover:bg-[#102A43]/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectRequest(req.id)}
                    >
                      {/* Checkbox for merge */}
                      {isControlOffice && (
                        <td className="p-3.5 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(req.id)}
                            className="rounded border-[#244B6A] text-[#20C6B7] focus:ring-[#20C6B7] bg-[#071626]"
                          />
                        </td>
                      )}

                      {/* Request Code */}
                      <td className="p-3.5 font-mono font-bold text-[#38BDF8]">
                        {req.requestCode}
                      </td>

                      {/* Department */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          req.department === 'ENGINEERING' ? 'bg-[#20C6B7]/15 text-[#20C6B7]' :
                          req.department === 'TRD' ? 'bg-[#38BDF8]/15 text-[#38BDF8]' : 'bg-[#F4B942]/15 text-[#F4B942]'
                        }`}>
                          {req.department}
                        </span>
                      </td>

                      {/* Task title */}
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-[#E6F4F1] truncate">{task?.title || 'Maintenance Task'}</p>
                        <p className="text-[11px] text-[#6E8AA3] truncate">{task?.defectType}</p>
                      </td>

                      {/* Section */}
                      <td className="p-3.5 text-[#A7C1D4] whitespace-nowrap">
                        {sec?.name || 'Section'}
                      </td>

                      {/* Block Type */}
                      <td className="p-3.5">
                        <span className="font-mono text-[11px] text-[#A7C1D4]">
                          {task?.requiredBlockType || 'LINE'}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="p-3.5 text-[#E6F4F1] font-mono whitespace-nowrap">
                        {req.requestedDurationMinutes} mins
                      </td>

                      {/* AI Priority */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${
                            (task?.aiPriorityScore || 0) >= 85 ? 'text-[#F05252]' :
                            (task?.aiPriorityScore || 0) >= 70 ? 'text-[#F4B942]' : 'text-[#34D399]'
                          }`}>
                            {task?.aiPriorityScore || 70}
                          </span>
                          <span className="text-[9px] text-[#6E8AA3]">/100</span>
                        </div>
                      </td>

                      {/* Overdue */}
                      <td className="p-3.5 whitespace-nowrap">
                        {(task?.overdueDays || 0) > 0 ? (
                          <span className="text-[#F05252] font-semibold font-mono text-[11px]">
                            {task?.overdueDays}d overdue
                          </span>
                        ) : (
                          <span className="text-[#6E8AA3] text-[11px]">On-time</span>
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
                                className="p-1.5 rounded bg-[#34D399]/15 hover:bg-[#34D399]/30 text-[#34D399] transition-colors"
                                title="Accept Request into Candidate Corridor Pool"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleActionClick('CLARIFY', req.id, req.requestCode)}
                                className="p-1.5 rounded bg-[#F4B942]/15 hover:bg-[#F4B942]/30 text-[#F4B942] transition-colors"
                                title="Return for Clarification"
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleActionClick('DECLINE', req.id, req.requestCode)}
                                className="p-1.5 rounded bg-[#F05252]/15 hover:bg-[#F05252]/30 text-[#F05252] transition-colors"
                                title="Decline Request"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onSelectRequest(req.id)}
                              className="px-2.5 py-1 rounded bg-[#102A43] hover:bg-[#163B5C] text-[#38BDF8] font-semibold text-[11px] transition-colors"
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
