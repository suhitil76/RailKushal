import React, { useState } from 'react';
import { 
  ListTodo, Search, Filter, Wrench, Zap, Radio, AlertTriangle, 
  Clock, ShieldCheck, CheckCircle2, ChevronRight, BarChart2 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { store } from '../../services/store';
import { Asset, MaintenanceTask, Department } from '../../types/railway';

interface AssetRegisterPageProps {
  onNavigate: (path: string) => void;
}

export const AssetRegisterPage: React.FC<AssetRegisterPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { assets, tasks, sections } = state;

  const [activeTab, setActiveTab] = useState<'ALL' | 'ENGINEERING' | 'TRD' | 'S_AND_T' | 'DEFECTS' | 'OVERDUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Filter assets
  const filteredAssets = assets.filter(a => {
    if (activeTab === 'ENGINEERING' && a.department !== 'ENGINEERING') return false;
    if (activeTab === 'TRD' && a.department !== 'TRD') return false;
    if (activeTab === 'S_AND_T' && a.department !== 'S_AND_T') return false;
    if (activeTab === 'DEFECTS' && a.status === 'OPERATIONAL') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!a.assetCode.toLowerCase().includes(q) && !a.assetType.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const overdueTasks = tasks.filter(t => t.overdueDays > 0);

  // Asset Health Distribution
  const healthDistribution = [
    { name: 'Pristine (80-100)', count: assets.filter(a => a.conditionScore >= 80).length, color: '#34D399' },
    { name: 'Moderate (60-79)', count: assets.filter(a => a.conditionScore >= 60 && a.conditionScore < 80).length, color: '#38BDF8' },
    { name: 'Degraded (40-59)', count: assets.filter(a => a.conditionScore >= 40 && a.conditionScore < 60).length, color: '#F4B942' },
    { name: 'Critical Defect (<40)', count: assets.filter(a => a.conditionScore < 40).length, color: '#F05252' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider font-mono">
              Asset &amp; Task Register
            </span>
            <span className="text-xs text-[#A7C1D4]">Unified TMS · TDMS · SMMS Telemetry</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Fixed Infrastructure Health &amp; Maintenance Inventory
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Cross-departmental track components, 25kV OHE spans, point machines, and electronic axle counters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/blocks/planning')}
            className="px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs transition-colors shadow-md"
          >
            Plan Blocks for Backlog
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'ALL' ? 'bg-[#163B5C] text-[#20C6B7] border border-[#244B6A]' : 'text-[#A7C1D4] hover:text-[#E6F4F1]'
            }`}
          >
            All Assets ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('ENGINEERING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'ENGINEERING' ? 'bg-[#163B5C] text-[#20C6B7] border border-[#244B6A]' : 'text-[#A7C1D4] hover:text-[#E6F4F1]'
            }`}
          >
            Engineering ({assets.filter(a => a.department === 'ENGINEERING').length})
          </button>
          <button
            onClick={() => setActiveTab('TRD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'TRD' ? 'bg-[#163B5C] text-[#38BDF8] border border-[#244B6A]' : 'text-[#A7C1D4] hover:text-[#E6F4F1]'
            }`}
          >
            TRD ({assets.filter(a => a.department === 'TRD').length})
          </button>
          <button
            onClick={() => setActiveTab('S_AND_T')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'S_AND_T' ? 'bg-[#163B5C] text-[#F4B942] border border-[#244B6A]' : 'text-[#A7C1D4] hover:text-[#E6F4F1]'
            }`}
          >
            S&amp;T ({assets.filter(a => a.department === 'S_AND_T').length})
          </button>
          <button
            onClick={() => setActiveTab('DEFECTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'DEFECTS' ? 'bg-[#F05252]/20 text-[#F05252] border border-[#F05252]/40' : 'text-[#A7C1D4] hover:text-[#E6F4F1]'
            }`}
          >
            Defects ({assets.filter(a => a.status !== 'OPERATIONAL').length})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E8AA3]" />
          <input
            type="text"
            placeholder="Search asset code (TRK, OHE, AXC)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#071626] border border-[#244B6A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7]"
          />
        </div>
      </div>

      {/* Asset Table & Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B1F33] border border-[#244B6A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#102A43] text-[#A7C1D4] border-b border-[#244B6A] sticky top-0 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Asset Code</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Corridor Section</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Risk Level</th>
                  <th className="p-3.5">Last Inspected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#244B6A]/50">
                {filteredAssets.map(ast => {
                  const sec = sections.find(s => s.id === ast.sectionId);
                  const isSelected = selectedAsset?.id === ast.id;

                  return (
                    <tr
                      key={ast.id}
                      onClick={() => setSelectedAsset(ast)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#163B5C] text-[#E6F4F1]' : 'hover:bg-[#102A43]/50 text-[#A7C1D4]'
                      }`}
                    >
                      <td className="p-3.5 font-mono font-bold text-[#38BDF8]">{ast.assetCode}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          ast.department === 'ENGINEERING' ? 'bg-[#20C6B7]/15 text-[#20C6B7]' :
                          ast.department === 'TRD' ? 'bg-[#38BDF8]/15 text-[#38BDF8]' : 'bg-[#F4B942]/15 text-[#F4B942]'
                        }`}>
                          {ast.department}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#E6F4F1] font-medium">{ast.assetType}</td>
                      <td className="p-3.5">{sec?.name || 'Section'}</td>
                      <td className="p-3.5 font-mono font-bold">
                        <span className={
                          ast.conditionScore < 50 ? 'text-[#F05252]' :
                          ast.conditionScore < 70 ? 'text-[#F4B942]' : 'text-[#34D399]'
                        }>
                          {ast.conditionScore} / 100
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ast.availabilityRisk === 'CRITICAL' ? 'bg-[#F05252]/20 text-[#F05252]' :
                          ast.availabilityRisk === 'HIGH' ? 'bg-[#F4B942]/20 text-[#F4B942]' : 'bg-[#34D399]/20 text-[#34D399]'
                        }`}>
                          {ast.availabilityRisk}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[#6E8AA3]">{ast.lastInspectionDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Asset Profile (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-4">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
            {selectedAsset ? 'Asset Diagnostics & History' : 'Asset Health Distribution'}
          </h3>

          {selectedAsset ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#071626] border border-[#244B6A] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Asset Code:</span>
                  <span className="font-mono text-[#38BDF8] font-bold">{selectedAsset.assetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Department:</span>
                  <span className="text-[#E6F4F1] font-semibold">{selectedAsset.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Chainage:</span>
                  <span className="font-mono text-[#A7C1D4]">{selectedAsset.chainageKm} Km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Installation Year:</span>
                  <span className="font-mono text-[#A7C1D4]">{selectedAsset.installYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E8AA3]">Condition Rating:</span>
                  <span className="font-mono font-bold text-[#20C6B7]">{selectedAsset.conditionScore} / 100</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#A7C1D4] uppercase tracking-wider mb-2">
                  Associated Maintenance Tasks
                </h4>
                {tasks.filter(t => t.assetId === selectedAsset.id).length === 0 ? (
                  <p className="text-xs text-[#6E8AA3]">No pending defect work logged on this asset.</p>
                ) : (
                  tasks.filter(t => t.assetId === selectedAsset.id).map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-[#071626] border border-[#244B6A] mb-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#38BDF8]">{t.taskCode}</span>
                        <span className="text-[#20C6B7] font-mono">Score: {t.aiPriorityScore}</span>
                      </div>
                      <p className="text-[#E6F4F1] mt-1">{t.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={healthDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count">
                      {healthDistribution.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3 text-xs">
                {healthDistribution.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded bg-[#071626]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="text-[#A7C1D4] text-[11px]">{h.name}</span>
                    </div>
                    <span className="font-bold text-[#E6F4F1] font-mono">{h.count} Assets</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
