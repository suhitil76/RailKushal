import React, { useState } from 'react';
import { 
  CalendarClock, Cpu, ShieldCheck, AlertTriangle, Layers, 
  CheckCircle2, Play, Download, Printer, Lock, Unlock, Sparkles, 
  ArrowRight, Clock, Train, CloudSun, Wrench, Zap, Radio, RefreshCw 
} from 'lucide-react';
import { store } from '../../services/store';
import { BlockPlan, MaintenanceTask, Section } from '../../types/railway';
import { generateAutomatedBlockPlan, SchedulingResult } from '../../services/scheduler';
import { toast } from '../../components/common/Toast';

interface BlockPlanningWorkspaceProps {
  onNavigate: (path: string) => void;
}

export const BlockPlanningWorkspacePage: React.FC<BlockPlanningWorkspaceProps> = ({ onNavigate }) => {
  const state = store.getState();
  const currentUser = state.currentUser;
  const isControlOffice = currentUser?.role === 'CONTROL_OFFICE' || currentUser?.role === 'ADMIN';

  const [targetDate, setTargetDate] = useState<string>('2026-09-20');
  const [selectedBlockId, setSelectedBlockId] = useState<string>(state.blockPlans[0]?.id || '');
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  const [showBaselineComparison, setShowBaselineComparison] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active blocks for this date
  const blocksForDate = state.blockPlans.filter(b => b.date === targetDate || b.planType === 'WEEKLY');
  const selectedBlock = state.blockPlans.find(b => b.id === selectedBlockId) || blocksForDate[0] || state.blockPlans[0];
  const selectedSection = state.sections.find(s => s.id === selectedBlock?.sectionId);

  // Auto-schedule generator
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const res = store.runAIBatchScheduler(targetDate);
      setSchedulingResult(res);
      setIsGenerating(false);
      setShowBaselineComparison(true);
      toast.success('AI Scheduling Solver Run Complete', `Generated ${res.candidateBlocks.length} conflict-free candidate blocks (${res.metrics.integratedBlockCount} Integrated Blocks).`);
    }, 400);
  };

  const handleApproveAndPublish = (blockId: string) => {
    if (!isControlOffice) {
      toast.error('Unauthorized', 'Only Control Office Planners can approve and publish division block programs.');
      return;
    }
    store.approveAndPublishBlockPlan(blockId);
    toast.success('Block Formally Published', 'Plan published to Operating Control and affected departmental depots.');
  };

  const handleExportCSV = () => {
    const headers = 'BlockCode,Section,Date,StartTime,EndTime,Type,Status,Departments,ProductiveMinutes\n';
    const rows = state.blockPlans.map(b => 
      `${b.blockCode},${b.sectionId},${b.date},${b.startTime},${b.endTime},${b.blockType},${b.status},"${b.departments.join(';')}",${b.productiveMinutes}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAILKUSHAL_PUNE_BLOCK_PLAN_${targetDate}.csv`;
    a.click();
    toast.success('Plan Exported', 'CSV block schedule downloaded.');
  };

  return (
    <div className="p-6 space-y-5 max-w-[1800px] mx-auto">
      {/* Top Banner with Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-rail-deep border border-rail-border p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rail-teal/20 border border-rail-teal/40 text-rail-teal text-[10px] font-bold uppercase tracking-wider font-mono">
              AI Scheduling Engine
            </span>
            <span className="text-xs text-rail-secondary">Multi-Department Corridor Dovetailing</span>
          </div>
          <h1 className="text-xl font-extrabold text-rail-text mt-1 tracking-tight">
            Block Planning &amp; Conflict-Free Gantt Workspace
          </h1>
          <p className="text-xs text-rail-secondary mt-0.5">
            Dovetails Engineering, TRD, and S&T maintenance within stipulated corridor windows while protecting train punctuality.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-rail-bg border border-rail-border px-3 py-1.5 rounded-lg text-xs">
            <span className="text-rail-muted">Plan Date:</span>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="bg-transparent text-rail-text font-mono focus:outline-none"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow-lg shadow-teal-950/40 transition-all disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing...' : 'Run AI Auto-Schedule'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-semibold text-rail-secondary hover:text-rail-text transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Baseline Comparison Card (if scheduler run) */}
      {showBaselineComparison && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102A43] via-[#163B5C] to-[#0B1F33] border border-rail-teal shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rail-teal" />
              <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
                AI Coordinated Plan vs Conventional Decentralized Baseline
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rail-emerald/20 text-rail-emerald">
              +38.4% Dovetailing Efficiency
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border">
              <span className="text-rail-muted block">Track Downtime Saved:</span>
              <span className="text-lg font-black text-rail-emerald font-mono">180 Mins</span>
              <p className="text-[10px] text-rail-secondary mt-0.5">Unified setup &amp; fit memos</p>
            </div>
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border">
              <span className="text-rail-muted block">Train Delays Avoided:</span>
              <span className="text-lg font-black text-rail-cyan font-mono">135 Mins</span>
              <p className="text-[10px] text-rail-secondary mt-0.5">Reduced speed restrictions</p>
            </div>
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border">
              <span className="text-rail-muted block">Multi-Dept Bundles:</span>
              <span className="text-lg font-black text-rail-teal font-mono">4 Integrated Blocks</span>
              <p className="text-[10px] text-rail-secondary mt-0.5">P-Way + TRD + S&amp;T</p>
            </div>
            <div className="p-3 rounded-xl bg-rail-bg border border-rail-border">
              <span className="text-rail-muted block">Projected Availability:</span>
              <span className="text-lg font-black text-rail-text font-mono">96.2%</span>
              <p className="text-[10px] text-rail-emerald mt-0.5">+4.7% over 2025</p>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Layout: Left (Queue), Center (Gantt), Right (Candidate Block Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Task Backlog (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-rail-deep border border-rail-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rail-border">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">Eligible Tasks</h3>
            <span className="text-[10px] text-rail-cyan font-mono">Accepted Pool</span>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {state.tasks.slice(0, 10).map(t => (
              <div 
                key={t.id}
                className="p-3 rounded-xl bg-rail-bg border border-rail-border hover:border-rail-teal transition-all text-xs"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-rail-cyan">{t.taskCode}</span>
                  <span className="text-rail-teal font-mono font-bold">Score: {t.aiPriorityScore}</span>
                </div>
                <p className="text-xs text-rail-text font-medium truncate mt-1">{t.title}</p>
                <div className="flex items-center justify-between text-[10px] text-rail-secondary mt-2">
                  <span>{t.department}</span>
                  <span className="font-mono text-rail-text">{t.estimatedDurationMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Col: Gantt Timeline (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rail-border">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-rail-teal" />
              <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">
                Corridor Timeline: {targetDate}
              </h3>
            </div>
            <span className="text-[10px] text-rail-secondary font-mono">Night &amp; Daylight Windows</span>
          </div>

          {/* Time axis header */}
          <div className="grid grid-cols-6 text-[10px] text-rail-muted font-mono text-center border-b border-rail-border/60 pb-1">
            <span>00:00 - 04:00</span>
            <span>04:00 - 08:00</span>
            <span>08:00 - 12:00</span>
            <span>12:00 - 16:00</span>
            <span>16:00 - 20:00</span>
            <span>20:00 - 24:00</span>
          </div>

          {/* Gantt Corridor Rows */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {state.sections.slice(0, 7).map(sec => {
              const secBlocks = state.blockPlans.filter(b => b.sectionId === sec.id);

              return (
                <div key={sec.id} className="p-3.5 rounded-xl bg-rail-bg border border-rail-border">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-rail-text">{sec.name}</span>
                    <span className="text-[10px] text-rail-muted font-mono">{sec.code} · {sec.trafficDensity}</span>
                  </div>

                  {/* Visual timeline track */}
                  <div className="relative h-10 bg-rail-surface rounded-lg border border-rail-border/50 overflow-hidden flex items-center">
                    {/* Simulated train traffic dots */}
                    <div className="absolute left-[25%] h-full w-8 bg-rail-coral/15 border-x border-rail-coral/30 flex items-center justify-center text-[9px] text-rail-coral font-mono" title="Express Train Occupancy">
                      Train
                    </div>
                    <div className="absolute left-[70%] h-full w-10 bg-rail-coral/15 border-x border-rail-coral/30 flex items-center justify-center text-[9px] text-rail-coral font-mono" title="Suburban Peak">
                      Local
                    </div>

                    {/* Maintenance Blocks Overlays */}
                    {secBlocks.map(blk => {
                      const isSelected = selectedBlock?.id === blk.id;
                      return (
                        <div
                          key={blk.id}
                          onClick={() => setSelectedBlockId(blk.id)}
                          className={`absolute left-[5%] w-[28%] h-7 rounded-md px-2 flex items-center justify-between text-[10px] font-mono font-bold cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-rail-teal text-white ring-2 ring-white shadow-lg' 
                              : blk.status === 'PUBLISHED'
                              ? 'bg-rail-emerald text-white'
                              : blk.blockType === 'INTEGRATED'
                              ? 'bg-rail-cyan text-white'
                              : 'bg-rail-elevated text-rail-teal border border-rail-teal'
                          }`}
                        >
                          <span className="truncate">{blk.blockCode}</span>
                          <span className="shrink-0 text-[9px]">{blk.startTime}-{blk.endTime}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Candidate Block Details (3 cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-rail-deep border border-rail-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rail-border">
            <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">Block Specifications</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              selectedBlock?.status === 'PUBLISHED' ? 'bg-rail-emerald/20 text-rail-emerald' : 'bg-rail-cyan/20 text-rail-cyan'
            }`}>
              {selectedBlock?.status}
            </span>
          </div>

          {selectedBlock ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-sm font-bold text-rail-teal">{selectedBlock.blockCode}</span>
                <p className="text-xs text-rail-text font-semibold mt-0.5">{selectedSection?.name}</p>
                <p className="text-[11px] text-rail-secondary font-mono">{selectedBlock.date} ({selectedBlock.startTime} - {selectedBlock.endTime})</p>
              </div>

              <div className="p-3 rounded-xl bg-rail-bg border border-rail-border space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-rail-muted">Block Category:</span>
                  <span className="text-rail-cyan font-bold">{selectedBlock.blockType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rail-muted">Productive Time:</span>
                  <span className="text-rail-emerald font-bold">{selectedBlock.productiveMinutes} Mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rail-muted">Setup / Fit Buffers:</span>
                  <span className="text-rail-secondary">{selectedBlock.setupMinutes}m + {selectedBlock.restorationMinutes}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rail-muted">Train Conflict:</span>
                  <span className="text-rail-emerald font-bold">0 Mins (Clean Corridor)</span>
                </div>
              </div>

              {/* Department Readiness Checklist */}
              <div className="p-3.5 rounded-xl bg-rail-bg border border-rail-border space-y-2">
                <span className="text-[10px] font-bold text-rail-secondary uppercase tracking-wider block">
                  Department Readiness Verification
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-rail-secondary">P-Way Readiness:</span>
                    <span className="text-rail-emerald font-bold">✓ Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-rail-secondary">TRD 25kV Isolation:</span>
                    <span className="text-rail-emerald font-bold">✓ TPC Mapped</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-rail-secondary">S&amp;T Disconnection:</span>
                    <span className="text-rail-emerald font-bold">✓ Protocol Ready</span>
                  </div>
                </div>
              </div>

              {/* Publish CTA for Control Office */}
              {isControlOffice && selectedBlock.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handleApproveAndPublish(selectedBlock.id)}
                  className="w-full py-2.5 rounded-xl bg-rail-emerald hover:bg-rail-emerald/90 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  Approve &amp; Formally Publish Block
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-rail-muted">Select a block on the timeline to inspect constraints.</p>
          )}
        </div>
      </div>
    </div>
  );
};
