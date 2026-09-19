import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, HelpCircle, Clock, AlertTriangle, 
  MapPin, Shield, Wrench, CloudSun, Calendar, MessageSquare, Send, 
  Sparkles, Layers, Cpu, Radio, Zap 
} from 'lucide-react';
import { store } from '../../services/store';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { toast } from '../../components/common/Toast';

interface RequestDetailPageProps {
  requestId: string;
  onNavigate: (path: string) => void;
}

export const RequestDetailPage: React.FC<RequestDetailPageProps> = ({ 
  requestId, 
  onNavigate 
}) => {
  const state = store.getState();
  const currentUser = state.currentUser;
  const isControlOffice = currentUser?.role === 'CONTROL_OFFICE' || currentUser?.role === 'ADMIN';

  const request = state.requests.find(r => r.id === requestId) || state.requests[0];
  const task = state.tasks.find(t => t.id === request.taskId) || state.tasks[0];
  const asset = state.assets.find(a => a.id === task.assetId) || state.assets[0];
  const section = state.sections.find(s => s.id === task.sectionId) || state.sections[0];
  const weather = state.weather.find(w => w.date === '2026-09-20') || state.weather[0];

  // Modal State for Action
  const [modalType, setModalType] = useState<'ACCEPT' | 'DECLINE' | 'CLARIFY' | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ user: string; text: string; time: string }[]>([
    { user: 'Vikas Deshmukh (SSE/P-Way)', text: 'Critical flaw identified during USFD flaw scan. Requires 180 min night window for rail tensor replacement.', time: 'Yesterday 14:30' }
  ]);

  const handleConfirmModal = (reason?: string) => {
    if (!modalType) return;
    if (modalType === 'ACCEPT') {
      store.updateRequestStatus(request.id, 'ACCEPTED', reason || 'Window approved for nocturnal corridor execution.');
      toast.success('Request Accepted', 'The maintenance request has been accepted into the planning pool.');
    } else if (modalType === 'DECLINE') {
      store.updateRequestStatus(request.id, 'DECLINED', reason || 'Refused due to goods train bottleneck.');
      toast.error('Request Declined', 'Operational refusal grounds dispatched.');
    } else if (modalType === 'CLARIFY') {
      store.updateRequestStatus(request.id, 'CLARIFICATION_REQUESTED', undefined, reason);
      toast.warning('Clarification Requested', 'Questions sent to requesting officer.');
    }
    setModalType(null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [
      ...prev, 
      { 
        user: `${currentUser?.name} (${currentUser?.role})`, 
        text: commentText.trim(), 
        time: 'Just now' 
      }
    ]);
    setCommentText('');
    toast.info('Comment Posted', 'Operational note appended to demand record.');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/requests')}
          className="flex items-center gap-1.5 text-xs text-[#A7C1D4] hover:text-[#20C6B7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#6E8AA3]">Request ID:</span>
          <span className="font-mono text-sm font-bold text-[#38BDF8]">{request.requestCode}</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#244B6A] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              request.department === 'ENGINEERING' ? 'bg-[#20C6B7]/20 text-[#20C6B7]' :
              request.department === 'TRD' ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-[#F4B942]/20 text-[#F4B942]'
            }`}>
              {request.department}
            </span>
            <span className="text-xs text-[#6E8AA3]">·</span>
            <span className="font-mono text-xs text-[#A7C1D4]">{task.taskCode}</span>
            <span className="text-xs text-[#6E8AA3]">·</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              request.status === 'ACCEPTED' ? 'bg-[#34D399]/20 text-[#34D399]' :
              request.status === 'DECLINED' ? 'bg-[#F05252]/20 text-[#F05252]' :
              request.status === 'CLARIFICATION_REQUESTED' ? 'bg-[#F4B942]/20 text-[#F4B942]' : 'bg-[#38BDF8]/20 text-[#38BDF8]'
            }`}>
              {request.status.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-xl font-bold text-[#E6F4F1] mt-2 tracking-tight">{task.title}</h1>
          <p className="text-xs text-[#A7C1D4] mt-1 leading-relaxed">{task.description}</p>
        </div>

        {/* Action Buttons */}
        {isControlOffice && (request.status === 'SUBMITTED' || request.status === 'UNDER_REVIEW') && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setModalType('ACCEPT')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#34D399] hover:bg-[#34D399]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Demand</span>
            </button>
            <button
              onClick={() => setModalType('CLARIFY')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F4B942] hover:bg-[#F4B942]/90 text-[#071626] text-xs font-bold transition-all shadow-md shadow-amber-950/40"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Return for Clarification</span>
            </button>
            <button
              onClick={() => setModalType('DECLINE')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F05252] hover:bg-[#F05252]/90 text-white text-xs font-bold transition-all shadow-md shadow-red-950/40"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        )}
      </div>

      {/* Clarification Notice Banner if present */}
      {request.clarificationNotes && (
        <div className="p-4 rounded-xl bg-[#F4B942]/15 border border-[#F4B942]/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F4B942] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#F4B942]">Control Office Clarification Required:</h4>
            <p className="text-xs text-[#E6F4F1] mt-1">{request.clarificationNotes}</p>
          </div>
        </div>
      )}

      {/* Grid of Profile & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* AI Priority Breakdown Card */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#20C6B7]" />
                <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                  AI Prioritization Scorecard &amp; Justification
                </h3>
              </div>
              <div className="text-base font-mono font-black text-[#20C6B7]">
                {task.aiPriorityScore} / 100
              </div>
            </div>

            <p className="text-xs text-[#A7C1D4] leading-relaxed mb-4">
              {task.aiPriorityExplanation}
            </p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono">
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Safety (30%)</span>
                <p className="text-xs font-bold text-[#E6F4F1] mt-1">{task.safetyCriticality}/100</p>
              </div>
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Failure (20%)</span>
                <p className="text-xs font-bold text-[#E6F4F1] mt-1">{task.failureProbability}/100</p>
              </div>
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Urgency (15%)</span>
                <p className="text-xs font-bold text-[#E6F4F1] mt-1">{task.urgency}/100</p>
              </div>
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Avail (15%)</span>
                <p className="text-xs font-bold text-[#E6F4F1] mt-1">{task.availabilityImpact}/100</p>
              </div>
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Overdue (10%)</span>
                <p className="text-xs font-bold text-[#F4B942] mt-1">{task.overdueDays} days</p>
              </div>
              <div className="bg-[#071626] p-2.5 rounded-lg border border-[#244B6A]">
                <span className="text-[#6E8AA3]">Weather (10%)</span>
                <p className="text-xs font-bold text-[#38BDF8] mt-1">Gated</p>
              </div>
            </div>
          </div>

          {/* Section & Timetable Conflict Check */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
              Corridor Timetable Conflict Assessment
            </h3>
            <div className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A] flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[#A7C1D4]">Corridor Window:</span>
                <p className="font-mono text-[#E6F4F1] font-bold">01:30 - 04:30 (Stipulated Night Slot)</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[#A7C1D4]">Train Density:</span>
                <p className="text-[#34D399] font-bold">LOW (No Mail/Express Clashes)</p>
              </div>
            </div>
          </div>

          {/* Multi-Department Bundling Opportunities */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102A43] to-[#163B5C] border border-[#20C6B7]/40 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#20C6B7]" />
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                Compatible Multi-Department Tasks (Eligible for Coordinated Block)
              </h3>
            </div>
            <p className="text-xs text-[#A7C1D4] leading-relaxed mb-3">
              On this section ({section.name}), TRD task <span className="text-[#38BDF8] font-bold">TRD-207</span> (OHE Insulator) and S&T task <span className="text-[#F4B942] font-bold">SNT-305</span> (Axle Counter) can be dovetailed with this request.
            </p>
            <button
              onClick={() => onNavigate('/blocks/planning')}
              className="px-3 py-1.5 rounded-lg bg-[#20C6B7] text-[#071626] font-bold text-xs hover:bg-[#20C6B7]/90 transition-colors"
            >
              Open in Block Planning Workspace
            </button>
          </div>

          {/* Operational Comments Log */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-4">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
              Operational Coordination Log
            </h3>

            <div className="space-y-3">
              {comments.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] text-xs">
                  <div className="flex justify-between text-[11px] text-[#A7C1D4] mb-1">
                    <span className="font-bold text-[#20C6B7]">{c.user}</span>
                    <span className="text-[#6E8AA3] font-mono">{c.time}</span>
                  </div>
                  <p className="text-[#E6F4F1] leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add operational memo or safety fit note..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 bg-[#071626] border border-[#244B6A] rounded-lg px-3 py-2 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-[#163B5C] hover:bg-[#20C6B7] text-[#38BDF8] hover:text-[#071626] font-bold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Logistics, Asset & Weather Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Asset Card */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Asset Telemetry</h3>
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Asset Code:</span>
                <span className="font-mono text-[#38BDF8] font-bold">{asset.assetCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Asset Type:</span>
                <span className="text-[#E6F4F1]">{asset.assetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Condition Score:</span>
                <span className="font-mono font-bold text-[#F4B942]">{asset.conditionScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Last Inspection:</span>
                <span className="font-mono text-[#A7C1D4]">{asset.lastInspectionDate}</span>
              </div>
            </div>
          </div>

          {/* Meteorological Gating Card */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">IMD Weather Status</h3>
              <CloudSun className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Rainfall Risk:</span>
                <span className="font-mono text-[#34D399] font-bold">{weather.rainfallMm} mm/hr (Safe)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Lightning Risk:</span>
                <span className="font-mono text-[#34D399] font-bold">{weather.lightningRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Wind Speed:</span>
                <span className="font-mono text-[#E6F4F1]">{weather.windSpeedKmph} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Warning Level:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#34D399]/20 text-[#34D399]">
                  {weather.warningLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Crew Requisition */}
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Logistics &amp; Crew</h3>
            <div className="text-xs space-y-2.5">
              <div>
                <span className="text-[11px] text-[#6E8AA3] block">Allocated Crew:</span>
                <p className="font-medium text-[#E6F4F1]">{task.requiredCrew}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#6E8AA3] block">Equipment / Machinery:</span>
                <p className="font-medium text-[#E6F4F1]">{task.requiredEquipment}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalType !== null}
        title={
          modalType === 'ACCEPT' ? 'Accept Maintenance Demand' :
          modalType === 'DECLINE' ? 'Decline Maintenance Demand' :
          'Return Demand for Clarification'
        }
        description={
          modalType === 'ACCEPT' ? 'This action commits the window into the candidate schedule for automated timetable bundling.' :
          modalType === 'DECLINE' ? 'Please provide operational reasons for refusal.' :
          'Specify the exact information required from the field supervisor.'
        }
        confirmLabel={modalType === 'ACCEPT' ? 'Accept Demand' : modalType === 'DECLINE' ? 'Decline Demand' : 'Dispatch Clarification'}
        type={modalType === 'ACCEPT' ? 'success' : modalType === 'DECLINE' ? 'danger' : 'warning'}
        requireReason={modalType === 'DECLINE' || modalType === 'CLARIFY'}
        onConfirm={handleConfirmModal}
        onCancel={() => setModalType(null)}
      />
    </div>
  );
};
