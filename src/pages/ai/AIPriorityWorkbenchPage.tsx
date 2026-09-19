import React, { useState } from 'react';
import { 
  Cpu, Sliders, Shield, AlertTriangle, Sparkles, CheckCircle2, 
  ArrowRight, RotateCcw, Edit3, HelpCircle, Save 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { store } from '../../services/store';
import { MaintenanceTask } from '../../types/railway';
import { calculateAIPriority, DEFAULT_AI_WEIGHTS } from '../../services/aiPriority';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { toast } from '../../components/common/Toast';

interface AIPriorityWorkbenchPageProps {
  onNavigate: (path: string) => void;
}

export const AIPriorityWorkbenchPage: React.FC<AIPriorityWorkbenchPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const currentUser = state.currentUser;
  const isAuthorized = currentUser?.role === 'CONTROL_OFFICE' || currentUser?.role === 'ADMIN';

  const [selectedTask, setSelectedTask] = useState<MaintenanceTask>(state.tasks[0]);
  const [weights, setWeights] = useState(state.aiWeights);
  const [overrideModal, setOverrideModal] = useState(false);
  const [overrideScore, setOverrideScore] = useState(selectedTask.aiPriorityScore);

  // Compute breakdown for selected task
  const breakdown = calculateAIPriority(selectedTask, state.weather[0], weights);

  const componentChartData = [
    { name: 'Safety (30%)', score: breakdown.components.safety, max: 30 },
    { name: 'Failure (20%)', score: breakdown.components.failureProb, max: 20 },
    { name: 'Urgency (15%)', score: breakdown.components.urgency, max: 15 },
    { name: 'Avail (15%)', score: breakdown.components.availability, max: 15 },
    { name: 'Overdue (10%)', score: breakdown.components.overdue, max: 10 },
    { name: 'Weather (10%)', score: breakdown.components.weather, max: 10 },
  ];

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    const updated = { ...weights, [key]: val };
    setWeights(updated);
  };

  const handleSaveWeights = () => {
    store.updateAIWeights(weights);
    toast.success('AI Weights Updated', 'Re-computed prioritization matrix across all 150+ maintenance tasks.');
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_AI_WEIGHTS);
    store.updateAIWeights(DEFAULT_AI_WEIGHTS);
    toast.info('Weights Restored', 'Standard RDSO/Safety weighted scoring criteria reapplied.');
  };

  const handleConfirmOverride = (reason?: string) => {
    if (!reason?.trim()) {
      toast.error('Reason Required', 'Operational reason is mandatory for safety priority override.');
      return;
    }
    store.overrideTaskPriority(selectedTask.id, overrideScore, reason);
    setOverrideModal(false);
    toast.success('Priority Overridden', `Score for ${selectedTask.taskCode} updated to ${overrideScore}. Audit trail recorded.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              Explainable AI Intelligence
            </span>
            <span className="text-xs text-[#A7C1D4]">Ministry of Railways Problem Statement ID: 26027</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            AI Maintenance Priority Workbench &amp; Weight Configurator
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Transparent mathematical multi-criteria scoring combining safety, failure probability, traffic impact, and weather exposure.
          </p>
        </div>

        {isAuthorized && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveWeights}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Apply AI Weights</span>
            </button>
            <button
              onClick={handleResetWeights}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:text-[#E6F4F1] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Task Selector Queue (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">Maintenance Task Queue</h3>
            <span className="text-[10px] text-[#20C6B7] font-mono">150+ Tasks</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {state.tasks.slice(0, 15).map(task => {
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setOverrideScore(task.aiPriorityScore);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#163B5C] border-[#20C6B7] shadow-lg shadow-cyan-950/40' 
                      : 'bg-[#071626] border-[#244B6A] hover:bg-[#102A43]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#38BDF8]">{task.taskCode}</span>
                    <span className="font-mono text-xs font-bold text-[#20C6B7]">{task.aiPriorityScore} / 100</span>
                  </div>
                  <p className="text-xs text-[#E6F4F1] truncate mt-1">{task.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#A7C1D4] mt-2 font-mono">
                    <span>{task.department}</span>
                    <span className={task.severity === 'CRITICAL' ? 'text-[#F05252] font-bold' : ''}>
                      {task.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right Col: Explainable Breakdown & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Selected Task Detailed Explanation Card */}
          <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#244B6A] shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#244B6A] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#38BDF8]">{selectedTask.taskCode}</span>
                  <span className="text-xs text-[#6E8AA3]">·</span>
                  <span className="text-xs text-[#A7C1D4]">{selectedTask.department}</span>
                  <span className="text-xs text-[#6E8AA3]">·</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    breakdown.riskLabel === 'CRITICAL' ? 'bg-[#F05252]/20 text-[#F05252]' :
                    breakdown.riskLabel === 'HIGH' ? 'bg-[#F4B942]/20 text-[#F4B942]' : 'bg-[#34D399]/20 text-[#34D399]'
                  }`}>
                    {breakdown.riskLabel} RISK
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#E6F4F1] mt-1.5">{selectedTask.title}</h2>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[#6E8AA3] uppercase block font-semibold">Priority Score</span>
                  <span className="text-2xl font-black text-[#20C6B7] font-mono">{selectedTask.aiPriorityScore}</span>
                </div>

                {isAuthorized && (
                  <button
                    onClick={() => setOverrideModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs text-[#38BDF8] font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Override</span>
                  </button>
                )}
              </div>
            </div>

            {/* Override notice if present */}
            {selectedTask.priorityOverride && (
              <div className="p-3 rounded-lg bg-[#F4B942]/15 border border-[#F4B942]/40 text-xs text-[#E6F4F1] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F4B942]">Manual Priority Override Applied:</span> Original score was {selectedTask.priorityOverride.originalScore}, adjusted to {selectedTask.priorityOverride.overrideScore}.
                  <p className="text-[11px] text-[#A7C1D4] mt-0.5">Reason: {selectedTask.priorityOverride.reason} (By: {selectedTask.priorityOverride.overriddenBy})</p>
                </div>
              </div>
            )}

            {/* Plain Language Explainability */}
            <div className="p-4 rounded-xl bg-[#071626] border border-[#244B6A] space-y-2">
              <span className="text-xs font-bold text-[#20C6B7] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Natural-Language Decision Rationale
              </span>
              <p className="text-xs text-[#E6F4F1] leading-relaxed">
                {breakdown.rationale}
              </p>
              <div className="pt-2 border-t border-[#244B6A]/50 flex items-center justify-between text-xs text-[#A7C1D4]">
                <span>Planning Horizon: <strong className="text-[#38BDF8]">{breakdown.planningHorizon}</strong></span>
                <span>Recommended Window: <strong className="text-[#34D399]">{breakdown.recommendedWindow}</strong></span>
              </div>
            </div>

            {/* Component Bar Chart */}
            <div>
              <h4 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-2">
                Score Contribution Breakdown (Normalized Weighted Values)
              </h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={componentChartData}>
                    <XAxis dataKey="name" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                    <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} domain={[0, 30]} />
                    <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                    <Bar dataKey="score" fill="#20C6B7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Configuration Formula Sliders (Admin & Control Office) */}
          <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#244B6A] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#20C6B7]" />
                <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                  Configurable Multi-Criteria Weight Coefficients
                </h3>
              </div>
              <span className="text-xs text-[#34D399] font-mono font-bold">
                Sum: {Math.round((weights.safetyCriticality + weights.failureProbability + weights.urgency + weights.availabilityImpact + weights.overdueRisk + weights.weatherExposure) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Safety Criticality:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.safetyCriticality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={weights.safetyCriticality}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('safetyCriticality', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Failure Probability:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.failureProbability * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.40"
                  step="0.05"
                  value={weights.failureProbability}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('failureProbability', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Urgency:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.urgency * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.urgency}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('urgency', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Availability Impact:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.availabilityImpact * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.availabilityImpact}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('availabilityImpact', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Overdue Penalty:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.overdueRisk * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.05"
                  value={weights.overdueRisk}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('overdueRisk', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#A7C1D4] mb-1">
                  <span>Weather Exposure:</span>
                  <span className="font-mono text-[#20C6B7] font-bold">{Math.round(weights.weatherExposure * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.05"
                  value={weights.weatherExposure}
                  disabled={!isAuthorized}
                  onChange={e => handleWeightChange('weatherExposure', parseFloat(e.target.value))}
                  className="w-full accent-[#20C6B7]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Override Modal */}
      <ConfirmationModal
        isOpen={overrideModal}
        title={`Override AI Priority: ${selectedTask.taskCode}`}
        description={`Current calculated score is ${selectedTask.aiPriorityScore}. Overriding requires formal operational grounds which will be immutably recorded in the division audit log.`}
        confirmLabel="Confirm Priority Override"
        type="warning"
        requireReason={true}
        reasonPlaceholder="Mandatory operational justification for priority change (e.g. Caution Order, VIP route, GM inspection)..."
        onConfirm={handleConfirmOverride}
        onCancel={() => setOverrideModal(false)}
      />
    </div>
  );
};
