import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Save, Send, AlertTriangle, 
  MapPin, Shield, Clock, Wrench, Zap, Radio, Sparkles 
} from 'lucide-react';
import { store } from '../../services/store';
import { Department, BlockType, WeatherSensitivity, DefectSeverity } from '../../types/railway';
import { calculateAIPriority } from '../../services/aiPriority';
import { toast } from '../../components/common/Toast';

interface NewRequestWizardProps {
  onNavigate: (path: string) => void;
}

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({ onNavigate }) => {
  const state = store.getState();
  const currentUser = state.currentUser;

  // Inferred Department
  const userDept: Department = 
    currentUser?.department === 'ENGINEERING' || currentUser?.department === 'TRD' || currentUser?.department === 'S_AND_T'
      ? currentUser.department
      : 'ENGINEERING';

  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Work Identity
    department: userDept,
    sourceSystem: userDept === 'ENGINEERING' ? 'TMS' : userDept === 'TRD' ? 'TDMS' : 'SMMS',
    title: '',
    description: '',
    defectType: '',
    severity: 'HIGH' as DefectSeverity,
    safetyCriticality: 80,
    failureProbability: 70,
    urgency: 75,
    availabilityImpact: 70,
    assetId: state.assets.find(a => a.department === userDept)?.id || state.assets[0].id,

    // Step 2: Location
    sectionId: state.sections[0].id,
    chainageKm: 15.4,
    trackLine: 'Down Line (DN)',

    // Step 3: Work / Access
    durationMinutes: 180,
    setupMinutes: 20,
    restorationMinutes: 15,
    requiredBlockType: (userDept === 'TRD' ? 'POWER' : 'LINE') as BlockType,
    preferredDate: '2026-09-21',
    preferredStartTime: '01:30',
    preferredEndTime: '04:30',
    requiredCrew: `${userDept} Maintenance Squad (10 personnel)`,
    requiredEquipment: userDept === 'TRD' ? 'Tower Wagon RU-8821 + Earth Sets' : userDept === 'ENGINEERING' ? 'DUOMATIC Tamping Machine' : 'Digital Signal Calibrator Kit',

    // Step 4: Safety & Dept Specific
    weatherSensitivity: (userDept === 'TRD' ? 'LIGHTNING_SENSITIVE' : userDept === 'ENGINEERING' ? 'RAIN_SENSITIVE' : 'NONE') as WeatherSensitivity,
    // Eng
    trackComponent: '60kg 90UTS Rail',
    defectClassification: 'Track Geometry / Gauge',
    cautionOrderRequired: true,
    speedRestrictionKmph: 45,
    // TRD
    oheSpan: 'Span 42/12 to 42/18',
    isolationPoint: 'Isolator ISO-CCH-12',
    tpcPermitRequired: true,
    // SNT
    gearCategory: 'Dual Detection Axle Counter (DAC)',
    interlockingDisconnection: true,
    testingProtocol: '10-Pass Joint Wheel Simulation',
  });

  // Calculate AI priority preview dynamically
  const previewTask: any = {
    ...formData,
    overdueDays: 0,
    estimatedDurationMinutes: formData.durationMinutes,
  };
  const aiPreview = calculateAIPriority(previewTask, state.weather[0], state.aiWeights);

  const handleSubmit = (isDraft: boolean) => {
    if (!formData.title.trim()) {
      toast.error('Title Required', 'Please enter a descriptive maintenance task title.');
      setStep(1);
      return;
    }

    const { task, request } = store.createMaintenanceRequest(
      {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        sourceSystem: formData.sourceSystem as any,
        defectType: formData.defectType || 'Corridor Defect',
        severity: formData.severity,
        safetyCriticality: formData.safetyCriticality,
        failureProbability: formData.failureProbability,
        urgency: formData.urgency,
        availabilityImpact: formData.availabilityImpact,
        assetId: formData.assetId,
        sectionId: formData.sectionId,
        estimatedDurationMinutes: formData.durationMinutes,
        setupMinutes: formData.setupMinutes,
        restorationMinutes: formData.restorationMinutes,
        requiredBlockType: formData.requiredBlockType,
        weatherSensitivity: formData.weatherSensitivity,
        requiredCrew: formData.requiredCrew,
        requiredEquipment: formData.requiredEquipment,
        engDetails: formData.department === 'ENGINEERING' ? {
          trackComponent: formData.trackComponent,
          defectClassification: formData.defectClassification,
          cautionOrderRequired: formData.cautionOrderRequired,
          speedRestrictionKmph: formData.speedRestrictionKmph
        } : undefined,
        trdDetails: formData.department === 'TRD' ? {
          oheSpan: formData.oheSpan,
          isolationPoint: formData.isolationPoint,
          powerBlockType: 'SECTION',
          tpcPermitRequired: formData.tpcPermitRequired
        } : undefined,
        sntDetails: formData.department === 'S_AND_T' ? {
          gearCategory: formData.gearCategory,
          interlockingDisconnectionRequired: formData.interlockingDisconnection,
          testingProtocol: formData.testingProtocol,
          commissioningOfficer: currentUser?.name || 'SSE/Signal'
        } : undefined,
      },
      {
        requestedStart: `${formData.preferredDate}T${formData.preferredStartTime}:00Z`,
        requestedEnd: `${formData.preferredDate}T${formData.preferredEndTime}:00Z`,
        requestedDurationMinutes: formData.durationMinutes + formData.setupMinutes + formData.restorationMinutes,
        isDraft
      }
    );

    if (isDraft) {
      toast.info('Draft Saved', `Request ${request.requestCode} saved to your local draft queue.`);
    } else {
      toast.success('Request Submitted', `Demand ${request.requestCode} forwarded to Control Office with AI Priority ${aiPreview.score}.`);
    }

    onNavigate('/requests');
  };

  const stepsList = ['Work Identity', 'Location & Asset', 'Corridor & Access', 'Safety Protocols', 'AI Review & Submit'];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/requests')}
          className="flex items-center gap-1.5 text-xs text-[#A7C1D4] hover:text-[#20C6B7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Demands Inbox</span>
        </button>

        <span className="text-xs text-[#38BDF8] font-mono">
          Department: <span className="font-bold text-[#E6F4F1]">{formData.department}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#0B1F33] border border-[#244B6A] p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          {stepsList.map((stName, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurr = step === stepNum;
            return (
              <div key={idx} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone ? 'bg-[#20C6B7] text-[#071626]' : isCurr ? 'bg-[#163B5C] border-2 border-[#20C6B7] text-[#20C6B7]' : 'bg-[#071626] border border-[#244B6A] text-[#6E8AA3]'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className={`text-[11px] font-semibold hidden md:inline ${isCurr ? 'text-[#20C6B7]' : 'text-[#6E8AA3]'}`}>
                    {stName}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${isDone ? 'bg-[#20C6B7]' : 'bg-[#244B6A]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Form Cards */}
      <div className="bg-[#0B1F33] border border-[#244B6A] rounded-2xl p-6 shadow-2xl space-y-5">
        {/* Step 1: Work Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#E6F4F1]">Step 1: Work Identity &amp; Defect Classification</h2>
              <p className="text-xs text-[#A7C1D4] mt-0.5">Specify task title, defect characteristics, and source maintenance registry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Source Maintenance System</label>
                <select
                  value={formData.sourceSystem}
                  onChange={e => setFormData({ ...formData, sourceSystem: e.target.value as any })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  <option value="TMS">TMS (Track Management System)</option>
                  <option value="TDMS">TDMS (Traction Distribution Management)</option>
                  <option value="SMMS">SMMS (Signalling &amp; Telecom Management)</option>
                  <option value="MANUAL">Manual Field Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Defect Severity Rating</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value as DefectSeverity })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  <option value="CRITICAL">CRITICAL (Immediate safety / derailment / trip risk)</option>
                  <option value="HIGH">HIGH (Speed restriction / throughput bottleneck)</option>
                  <option value="MEDIUM">MEDIUM (Preventive schedule within 7 days)</option>
                  <option value="LOW">LOW (Deferred maintenance / inspection)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Task Title <span className="text-[#F05252]">*</span></label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Critical overdue track geometry alignment & rail renewal on Chinchwad–Talegaon"
                className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:border-[#20C6B7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Defect Category / Fault Tag</label>
                <input
                  type="text"
                  value={formData.defectType}
                  onChange={e => setFormData({ ...formData, defectType: e.target.value })}
                  placeholder="e.g. IMR Rail Flaw / Hotspot / Axle Counter Dropout"
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Target Asset ID</label>
                <select
                  value={formData.assetId}
                  onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  {state.assets.filter(a => a.department === formData.department).slice(0, 15).map(a => (
                    <option key={a.id} value={a.id}>{a.assetCode} ({a.assetType})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Defect Description &amp; Field Context</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide physical inspection notes, instrument readings (USFD/megger/temperature), or caution order status..."
                className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:border-[#20C6B7]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#E6F4F1]">Step 2: Section &amp; Spatial Alignment</h2>
              <p className="text-xs text-[#A7C1D4] mt-0.5">Select rail corridor section, line designation, and chainage marker.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Corridor Section</label>
                <select
                  value={formData.sectionId}
                  onChange={e => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  {state.sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code} · {s.lengthKm} km)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Track Designation</label>
                <select
                  value={formData.trackLine}
                  onChange={e => setFormData({ ...formData, trackLine: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  <option value="Down Line (DN)">Down Line (DN - Pune toward Lonavala)</option>
                  <option value="Up Line (UP)">Up Line (UP - Lonavala toward Pune)</option>
                  <option value="Suburban Local Line">Suburban Dedicated Local Line</option>
                  <option value="Yard Siding / Loop Line">Yard Siding / Goods Loop Line</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Chainage Kilometer Marker</label>
              <input
                type="number"
                step="0.1"
                value={formData.chainageKm}
                onChange={e => setFormData({ ...formData, chainageKm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
              />
            </div>

            {/* Clickable Mini Map Selector Preview */}
            <div className="p-4 rounded-xl bg-[#071626] border border-[#244B6A]">
              <span className="text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#20C6B7]" />
                Section Corridor Geo-Context
              </span>
              <p className="text-xs text-[#A7C1D4] leading-relaxed">
                Selected: <span className="text-[#20C6B7] font-bold">{state.sections.find(s => s.id === formData.sectionId)?.name}</span>. 
                Double electrified corridor with automated absolute block signalling. Traffic Density: <span className="text-[#F4B942] font-semibold">HIGH</span>.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Work / Access */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#E6F4F1]">Step 3: Block Type, Duration &amp; Logistics</h2>
              <p className="text-xs text-[#A7C1D4] mt-0.5">Determine block category, setup/restoration buffers, and crew requisitions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Required Block Type</label>
                <select
                  value={formData.requiredBlockType}
                  onChange={e => setFormData({ ...formData, requiredBlockType: e.target.value as BlockType })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                >
                  <option value="LINE">Line Block (Track isolation for P-Way / S&T)</option>
                  <option value="POWER">Power Block (25kV OHE isolation for TRD)</option>
                  <option value="INTEGRATED">Integrated Block (Synchronized multi-dept work)</option>
                  <option value="SHADOW">Shadow Block (Minor maintenance within existing block)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Effective Work Duration (Minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Setup / Safety Buffer (Minutes)</label>
                <input
                  type="number"
                  value={formData.setupMinutes}
                  onChange={e => setFormData({ ...formData, setupMinutes: parseInt(e.target.value) || 15 })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Restoration / Fit Memo Buffer (Minutes)</label>
                <input
                  type="number"
                  value={formData.restorationMinutes}
                  onChange={e => setFormData({ ...formData, restorationMinutes: parseInt(e.target.value) || 15 })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Window Start Time</label>
                <input
                  type="time"
                  value={formData.preferredStartTime}
                  onChange={e => setFormData({ ...formData, preferredStartTime: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Window End Time</label>
                <input
                  type="time"
                  value={formData.preferredEndTime}
                  onChange={e => setFormData({ ...formData, preferredEndTime: e.target.value })}
                  className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Required Machinery &amp; Track Equipment</label>
              <input
                type="text"
                value={formData.requiredEquipment}
                onChange={e => setFormData({ ...formData, requiredEquipment: e.target.value })}
                className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Safety & Department Specifics */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#E6F4F1]">Step 4: Department Safety &amp; Weather Protocols</h2>
              <p className="text-xs text-[#A7C1D4] mt-0.5">Validate meteorological constraints and department-specific compliance items.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6F4F1] mb-1">Weather Sensitivity Level</label>
              <select
                value={formData.weatherSensitivity}
                onChange={e => setFormData({ ...formData, weatherSensitivity: e.target.value as WeatherSensitivity })}
                className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
              >
                <option value="NONE">Weather Resilient (Tunnel, sheltered relay room, normal track)</option>
                <option value="RAIN_SENSITIVE">Rain Sensitive (Deep screening, tamping, ballast renewal)</option>
                <option value="LIGHTNING_SENSITIVE">Lightning Sensitive (Exposed OHE ladder work, mast insulators)</option>
                <option value="WIND_SENSITIVE">Wind Sensitive (Tower wagon elevated platform &gt;35 km/h)</option>
                <option value="HEAT_SENSITIVE">Heat Sensitive (Rail de-stressing, welding &gt;38°C)</option>
              </select>
            </div>

            {/* Department Specific Fields */}
            {formData.department === 'ENGINEERING' && (
              <div className="p-4 rounded-xl bg-[#102A43] border border-[#244B6A] space-y-3">
                <span className="text-xs font-bold text-[#20C6B7] uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" /> Permanent Way Safety Checklist
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">Track Component Type</label>
                    <input
                      type="text"
                      value={formData.trackComponent}
                      onChange={e => setFormData({ ...formData, trackComponent: e.target.value })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">Speed Restriction (Kmph)</label>
                    <input
                      type="number"
                      value={formData.speedRestrictionKmph}
                      onChange={e => setFormData({ ...formData, speedRestrictionKmph: parseInt(e.target.value) || 30 })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.department === 'TRD' && (
              <div className="p-4 rounded-xl bg-[#102A43] border border-[#244B6A] space-y-3">
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Traction Distribution Isolation Protocol
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">OHE Span Identifier</label>
                    <input
                      type="text"
                      value={formData.oheSpan}
                      onChange={e => setFormData({ ...formData, oheSpan: e.target.value })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">Isolation Switching Point</label>
                    <input
                      type="text"
                      value={formData.isolationPoint}
                      onChange={e => setFormData({ ...formData, isolationPoint: e.target.value })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.department === 'S_AND_T' && (
              <div className="p-4 rounded-xl bg-[#102A43] border border-[#244B6A] space-y-3">
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4" /> Signalling Disconnection &amp; Restoration Protocol
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">Gear Category</label>
                    <input
                      type="text"
                      value={formData.gearCategory}
                      onChange={e => setFormData({ ...formData, gearCategory: e.target.value })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#A7C1D4] mb-1">Joint Testing Protocol</label>
                    <input
                      type="text"
                      value={formData.testingProtocol}
                      onChange={e => setFormData({ ...formData, testingProtocol: e.target.value })}
                      className="w-full bg-[#071626] border border-[#244B6A] rounded-lg p-2 text-xs text-[#E6F4F1]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Evidence & Submit with AI Preview */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#E6F4F1]">Step 5: AI Prioritization Preview &amp; Submission</h2>
              <p className="text-xs text-[#A7C1D4] mt-0.5">Review explainable prioritization breakdown before final dispatch.</p>
            </div>

            {/* AI Priority Card */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#102A43] to-[#163B5C] border border-[#20C6B7] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#20C6B7]" />
                  <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
                    Calculated AI Priority Score:
                  </h3>
                </div>
                <div className="text-xl font-black text-[#20C6B7] font-mono">
                  {aiPreview.score} / 100 ({aiPreview.riskLabel})
                </div>
              </div>

              <p className="text-xs text-[#A7C1D4] leading-relaxed mb-3">
                {aiPreview.rationale}
              </p>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono border-t border-[#244B6A] pt-3">
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Safety (30%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.safety}</div>
                </div>
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Failure (20%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.failureProb}</div>
                </div>
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Urgency (15%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.urgency}</div>
                </div>
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Avail (15%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.availability}</div>
                </div>
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Overdue (10%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.overdue}</div>
                </div>
                <div className="bg-[#071626] p-2 rounded">
                  <div className="text-[#6E8AA3]">Weather (10%)</div>
                  <div className="text-xs font-bold text-[#E6F4F1] mt-0.5">{aiPreview.components.weather}</div>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-xl bg-[#071626] border border-[#244B6A] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Task Title:</span>
                <span className="font-semibold text-[#E6F4F1]">{formData.title || 'Untitled Task'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Section:</span>
                <span className="text-[#A7C1D4]">{state.sections.find(s => s.id === formData.sectionId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Requested Window:</span>
                <span className="font-mono text-[#38BDF8]">{formData.preferredDate} ({formData.preferredStartTime} - {formData.preferredEndTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E8AA3]">Block Duration:</span>
                <span className="font-mono text-[#E6F4F1]">{formData.durationMinutes} mins + {formData.setupMinutes + formData.restorationMinutes}m buffers</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Buttons */}
        <div className="pt-4 border-t border-[#244B6A] flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:bg-[#102A43] hover:text-[#E6F4F1] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:text-[#E6F4F1] transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Save Draft</span>
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !formData.title.trim()) {
                    toast.error('Required', 'Please enter task title.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-extrabold text-xs shadow-lg shadow-teal-950/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Control Office</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
