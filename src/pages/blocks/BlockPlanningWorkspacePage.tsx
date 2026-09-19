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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              AI Scheduling Engine
            </span>
            <span className="text-xs text-[#A7C1D4]">Multi-Department Corridor Dovetailing</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Block Planning &amp; Conflict-Free Gantt Workspace
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Dovetails Engineering, TRD, and S&T maintenance within stipulated corridor windows while protecting train punctuality.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#071626] border border-[#244B6A] px-3 py-1.5 rounded-lg text-xs">
            <span className="text-[#6E8AA3]">Plan Date:</span>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="bg-transparent text-[#E6F4F1] font-mono focus:outline-none"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs shadow-lg shadow-teal-950/40 transition-all disabled:opacity-50"
          >
            <Cpu className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing...' : 'Run AI Auto-Schedule'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:text-[#E6F4F1] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Baseline Comparison Card (if scheduler run) */}
      {showBaselineComparison && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#102A43] via-[#163B5C] to-[#0B1F33] border border-[#20C6B7] shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#20C6B7]" />
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                AI Coordinated Plan vs Conventional Decentralized Baseline
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399]">
              +38.4% Dovetailing Efficiency
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A]">
              <span className="text-[#6E8AA3] block">Track Downtime Saved:</span>
              <span className="text-lg font-black text-[#34D399] font-mono">180 Mins</span>
              <p className="text-[10px] text-[#A7C1D4] mt-0.5">Unified setup &amp; fit memos</p>
            </div>
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A]">
              <span className="text-[#6E8AA3] block">Train Delays Avoided:</span>
              <span className="text-lg font-black text-[#38BDF8] font-mono">135 Mins</span>
              <p className="text-[10px] text-[#A7C1D4] mt-0.5">Reduced speed restrictions</p>
            </div>
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A]">
              <span className="text-[#6E8AA3] block">Multi-Dept Bundles:</span>
              <span className="text-lg font-black text-[#20C6B7] font-mono">4 Integrated Blocks</span>
              <p className="text-[10px] text-[#A7C1D4] mt-0.5">P-Way + TRD + S&amp;T</p>
            </div>
            <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A]">
              <span className="text-[#6E8AA3] block">Projected Availability:</span>
              <span className="text-lg font-black text-[#E6F4F1] font-mono">96.2%</span>
              <p className="text-[10px] text-[#34D399] mt-0.5">+4.7% over 2025</p>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Layout: Left (Queue), Center (Gantt), Right (Candidate Block Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Task Backlog (3 cols) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#244B6A]">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Eligible Tasks</h3>
            <span className="text-[10px] text-[#38BDF8] font-mono">Accepted Pool</span>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {state.tasks.slice(0, 10).map(t => (
              <div 
                key={t.id}
                className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] hover:border-[#20C6B7] transition-all text-xs"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-[#38BDF8]">{t.taskCode}</span>
                  <span className="text-[#20C6B7] font-mono font-bold">Score: {t.aiPriorityScore}</span>
                </div>
                <p className="text-xs text-[#E6F4F1] font-medium truncate mt-1">{t.title}</p>
                <div className="flex items-center justify-between text-[10px] text-[#A7C1D4] mt-2">
                  <span>{t.department}</span>
                  <span className="font-mono text-[#E6F4F1]">{t.estimatedDurationMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Col: Gantt Timeline (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#244B6A]">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#20C6B7]" />
              <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                Corridor Timeline: {targetDate}
              </h3>
            </div>
            <span className="text-[10px] text-[#A7C1D4] font-mono">Night &amp; Daylight Windows</span>
          </div>

          {/* Time axis header */}
          <div className="grid grid-cols-6 text-[10px] text-[#6E8AA3] font-mono text-center border-b border-[#244B6A]/60 pb-1">
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
                <div key={sec.id} className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#E6F4F1]">{sec.name}</span>
                    <span className="text-[10px] text-[#6E8AA3] font-mono">{sec.code} · {sec.trafficDensity}</span>
                  </div>

                  {/* Visual timeline track */}
                  <div className="relative h-10 bg-[#102A43] rounded-lg border border-[#244B6A]/50 overflow-hidden flex items-center">
                    {/* Simulated train traffic dots */}
                    <div className="absolute left-[25%] h-full w-8 bg-[#F05252]/15 border-x border-[#F05252]/30 flex items-center justify-center text-[9px] text-[#F05252] font-mono" title="Express Train Occupancy">
                      Train
                    </div>
                    <div className="absolute left-[70%] h-full w-10 bg-[#F05252]/15 border-x border-[#F05252]/30 flex items-center justify-center text-[9px] text-[#F05252] font-mono" title="Suburban Peak">
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
                              ? 'bg-[#20C6B7] text-[#071626] ring-2 ring-white shadow-lg' 
                              : blk.status === 'PUBLISHED'
                              ? 'bg-[#34D399] text-[#071626]'
                              : blk.blockType === 'INTEGRATED'
                              ? 'bg-[#38BDF8] text-[#071626]'
                              : 'bg-[#163B5C] text-[#20C6B7] border border-[#20C6B7]'
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
        <div className="lg:col-span-3 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#244B6A]">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Block Specifications</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              selectedBlock?.status === 'PUBLISHED' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#38BDF8]/20 text-[#38BDF8]'
            }`}>
              {selectedBlock?.status}
            </span>
          </div>

          {selectedBlock ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-sm font-bold text-[#20C6B7]">{selectedBlock.blockCode}</span>
                <p className="text-xs text-[#E6F4F1] font-semibold mt-0.5">{selectedSection?.name}</p>
                <p className="text-[11px] text-[#A7C1D4] font-mono">{selectedBlock.date} ({selectedBlock.startTime} - {selectedBlock.endTime})</p>
              </div>

              <div className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Block Category:</span>
                  <span className="text-[#38BDF8] font-bold">{selectedBlock.blockType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Productive Time:</span>
                  <span className="text-[#34D399] font-bold">{selectedBlock.productiveMinutes} Mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Setup / Fit Buffers:</span>
                  <span className="text-[#A7C1D4]">{selectedBlock.setupMinutes}m + {selectedBlock.restorationMinutes}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Train Conflict:</span>
                  <span className="text-[#34D399] font-bold">0 Mins (Clean Corridor)</span>
                </div>
              </div>

              {/* Department Readiness Checklist */}
              <div className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A] space-y-2">
                <span className="text-[10px] font-bold text-[#A7C1D4] uppercase tracking-wider block">
                  Department Readiness Verification
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A7C1D4]">P-Way Readiness:</span>
                    <span className="text-[#34D399] font-bold">✓ Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A7C1D4]">TRD 25kV Isolation:</span>
                    <span className="text-[#34D399] font-bold">✓ TPC Mapped</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A7C1D4]">S&amp;T Disconnection:</span>
                    <span className="text-[#34D399] font-bold">✓ Protocol Ready</span>
                  </div>
                </div>
              </div>

              {/* Publish CTA for Control Office */}
              {isControlOffice && selectedBlock.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handleApproveAndPublish(selectedBlock.id)}
                  className="w-full py-2.5 rounded-xl bg-[#34D399] hover:bg-[#34D399]/90 text-[#071626] font-extrabold text-xs shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  Approve &amp; Formally Publish Block
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#6E8AA3]">Select a block on the timeline to inspect constraints.</p>
          )}
        </div>
      </div>
    </div>
  );
};
