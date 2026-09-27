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
          className="flex items-center gap-1.5 text-xs text-rail-secondary hover:text-rail-teal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-rail-muted">Request ID:</span>
          <span className="font-mono text-sm font-bold text-rail-cyan">{request.requestCode}</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="p-6 rounded-2xl bg-rail-deep border border-rail-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              request.department === 'ENGINEERING' ? 'bg-rail-teal/20 text-rail-teal' :
              request.department === 'TRD' ? 'bg-rail-cyan/20 text-rail-cyan' : 'bg-rail-amber/20 text-rail-amber'
            }`}>
              {request.department}
            </span>
            <span className="text-xs text-rail-muted">·</span>
            <span className="font-mono text-xs text-rail-secondary">{task.taskCode}</span>
            <span className="text-xs text-rail-muted">·</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              request.status === 'ACCEPTED' ? 'bg-rail-emerald/20 text-rail-emerald' :
              request.status === 'DECLINED' ? 'bg-rail-coral/20 text-rail-coral' :
              request.status === 'CLARIFICATION_REQUESTED' ? 'bg-rail-amber/20 text-rail-amber' : 'bg-rail-cyan/20 text-rail-cyan'
            }`}>
              {request.status.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-xl font-bold text-rail-text mt-2 tracking-tight">{task.title}</h1>
          <p className="text-xs text-rail-secondary mt-1 leading-relaxed">{task.description}</p>
        </div>

        {/* Action Buttons */}
        {isControlOffice && (request.status === 'SUBMITTED' || request.status === 'UNDER_REVIEW') && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setModalType('ACCEPT')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-emerald hover:bg-rail-emerald/90 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Demand</span>
            </button>
            <button
              onClick={() => setModalType('CLARIFY')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-amber hover:bg-rail-amber/90 text-white text-xs font-bold transition-all shadow-md shadow-amber-950/40"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Return for Clarification</span>
            </button>
            <button
              onClick={() => setModalType('DECLINE')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rail-coral hover:bg-rail-coral/90 text-white text-xs font-bold transition-all shadow-md shadow-red-950/40"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        )}
      </div>

      {/* Clarification Notice Banner if present */}
      {request.clarificationNotes && (
        <div className="p-4 rounded-xl bg-rail-amber/15 border border-rail-amber/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rail-amber shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rail-amber">Control Office Clarification Required:</h4>
            <p className="text-xs text-rail-text mt-1">{request.clarificationNotes}</p>
          </div>
        </div>
      )}

      {/* Grid of Profile & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* AI Priority Breakdown Card */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rail-teal" />
                <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
                  AI Prioritization Scorecard &amp; Justification
                </h3>
              </div>
              <div className="text-base font-mono font-black text-rail-teal">
                {task.aiPriorityScore} / 100
              </div>
            </div>

            <p className="text-xs text-rail-secondary leading-relaxed mb-4">
              {task.aiPriorityExplanation}
            </p>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono">
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Safety (30%)</span>
                <p className="text-xs font-bold text-rail-text mt-1">{task.safetyCriticality}/100</p>
              </div>
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Failure (20%)</span>
                <p className="text-xs font-bold text-rail-text mt-1">{task.failureProbability}/100</p>
              </div>
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Urgency (15%)</span>
                <p className="text-xs font-bold text-rail-text mt-1">{task.urgency}/100</p>
              </div>
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Avail (15%)</span>
                <p className="text-xs font-bold text-rail-text mt-1">{task.availabilityImpact}/100</p>
              </div>
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Overdue (10%)</span>
                <p className="text-xs font-bold text-rail-amber mt-1">{task.overdueDays} days</p>
              </div>
              <div className="bg-rail-bg p-2.5 rounded-lg border border-rail-border">
                <span className="text-rail-muted">Weather (10%)</span>
                <p className="text-xs font-bold text-rail-cyan mt-1">Gated</p>
              </div>
            </div>
          </div>

          {/* Section & Timetable Conflict Check */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-3">
              Corridor Timetable Conflict Assessment
            </h3>
            <div className="p-3.5 rounded-xl bg-rail-bg border border-rail-border flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-rail-secondary">Corridor Window:</span>
                <p className="font-mono text-rail-text font-bold">01:30 - 04:30 (Stipulated Night Slot)</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-rail-secondary">Train Density:</span>
                <p className="text-rail-emerald font-bold">LOW (No Mail/Express Clashes)</p>
              </div>
            </div>
          </div>

          {/* Multi-Department Bundling Opportunities */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102A43] to-[#163B5C] border border-rail-teal/40 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-rail-teal" />
              <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
                Compatible Multi-Department Tasks (Eligible for Coordinated Block)
              </h3>
            </div>
            <p className="text-xs text-rail-secondary leading-relaxed mb-3">
              On this section ({section.name}), TRD task <span className="text-rail-cyan font-bold">TRD-207</span> (OHE Insulator) and S&T task <span className="text-rail-amber font-bold">SNT-305</span> (Axle Counter) can be dovetailed with this request.
            </p>
            <button
              onClick={() => onNavigate('/blocks/planning')}
              className="px-3 py-1.5 rounded-lg bg-rail-teal text-white font-bold text-xs hover:bg-rail-teal/90 transition-colors"
            >
              Open in Block Planning Workspace
            </button>
          </div>

          {/* Operational Comments Log */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-4">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rail-cyan" />
              Operational Coordination Log
            </h3>

            <div className="space-y-3">
              {comments.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rail-bg border border-rail-border text-xs">
                  <div className="flex justify-between text-[11px] text-rail-secondary mb-1">
                    <span className="font-bold text-rail-teal">{c.user}</span>
                    <span className="text-rail-muted font-mono">{c.time}</span>
                  </div>
                  <p className="text-rail-text leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add operational memo or safety fit note..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 bg-rail-bg border border-rail-border rounded-lg px-3 py-2 text-xs text-rail-text placeholder-[#6E8AA3] focus:outline-none focus:border-rail-teal"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-rail-elevated hover:bg-rail-teal text-rail-cyan hover:text-white font-bold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Logistics, Asset & Weather Profile (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Asset Card */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-3">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">Asset Telemetry</h3>
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-rail-muted">Asset Code:</span>
                <span className="font-mono text-rail-cyan font-bold">{asset.assetCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Asset Type:</span>
                <span className="text-rail-text">{asset.assetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Condition Score:</span>
                <span className="font-mono font-bold text-rail-amber">{asset.conditionScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Last Inspection:</span>
                <span className="font-mono text-rail-secondary">{asset.lastInspectionDate}</span>
              </div>
            </div>
          </div>

          {/* Meteorological Gating Card */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">IMD Weather Status</h3>
              <CloudSun className="w-4 h-4 text-rail-cyan" />
            </div>
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-rail-muted">Rainfall Risk:</span>
                <span className="font-mono text-rail-emerald font-bold">{weather.rainfallMm} mm/hr (Safe)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Lightning Risk:</span>
                <span className="font-mono text-rail-emerald font-bold">{weather.lightningRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Wind Speed:</span>
                <span className="font-mono text-rail-text">{weather.windSpeedKmph} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Warning Level:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rail-emerald/20 text-rail-emerald">
                  {weather.warningLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Crew Requisition */}
          <div className="p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-3">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">Logistics &amp; Crew</h3>
            <div className="text-xs space-y-2.5">
              <div>
                <span className="text-[11px] text-rail-muted block">Allocated Crew:</span>
                <p className="font-medium text-rail-text">{task.requiredCrew}</p>
              </div>
              <div>
                <span className="text-[11px] text-rail-muted block">Equipment / Machinery:</span>
                <p className="font-medium text-rail-text">{task.requiredEquipment}</p>
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
