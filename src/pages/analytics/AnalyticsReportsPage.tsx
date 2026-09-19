import React, { useState } from 'react';
import { 
  BarChart3, Download, Printer, TrendingUp, CheckCircle2, 
  Clock, ShieldAlert, FileText, Calendar 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { store } from '../../services/store';
import { toast } from '../../components/common/Toast';

export const AnalyticsReportsPage: React.FC = () => {
  const state = store.getState();
  const { tasks, blockPlans, requests } = state;

  const [dateRange, setDateRange] = useState('CURRENT_MONTH');

  const riskSectionData = [
    { section: 'PMP-CCH', score: 88.4, defects: 7 },
    { section: 'CCH-AKRD', score: 84.1, defects: 6 },
    { section: 'GRWD-TGN', score: 79.5, defects: 5 },
    { section: 'SVJR-KK', score: 76.2, defects: 4 },
    { section: 'KMST-MVL', score: 71.0, defects: 3 },
  ];

  const recurringDefects = [
    { name: 'Track Geometry / Rail Flaws', count: 18, color: '#F05252' },
    { name: 'OHE Insulator & Hotspots', count: 14, color: '#F4B942' },
    { name: 'Axle Counter Sensor Dropouts', count: 11, color: '#38BDF8' },
    { name: 'Turnout Switch Rail Wear', count: 8, color: '#20C6B7' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Section,RiskScore,ActiveDefects\n' + 
      riskSectionData.map(r => `${r.section},${r.score},${r.defects}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PUNE_DIVISION_ANALYTICS_REPORT.csv');
    document.body.appendChild(link);
    link.click();
    toast.success('Report Exported', 'Analytics CSV downloaded.');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto print:p-2">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#20C6B7]/20 border border-[#20C6B7]/40 text-[#20C6B7] text-[10px] font-bold uppercase tracking-wider font-mono">
              Operational Intelligence
            </span>
            <span className="text-xs text-[#A7C1D4]">Performance Analytics &amp; Safety Compliance</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Pune Division Block Planning Analytics &amp; Audit Reports
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Empirical block utilization rates, train conflict reduction statistics, and recurring infrastructure defect trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:text-[#E6F4F1] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report View</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#6E8AA3] uppercase">Productive Block Ratio</span>
          <div className="text-2xl font-black text-[#20C6B7] mt-2 font-mono">87.4%</div>
          <p className="text-[10px] text-[#34D399] mt-1">+13.8% over 2025</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#38BDF8] uppercase">Integrated Corridor Ratio</span>
          <div className="text-2xl font-black text-[#38BDF8] mt-2 font-mono">44.8%</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">Shared multi-department</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#34D399] uppercase">Avg Decision Latency</span>
          <div className="text-2xl font-black text-[#34D399] mt-2 font-mono">4.2 Hrs</div>
          <p className="text-[10px] text-[#A7C1D4] mt-1">From demand to sanction</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
          <span className="text-[11px] font-semibold text-[#F4B942] uppercase">Train Conflicts Prevented</span>
          <div className="text-2xl font-black text-[#F4B942] mt-2 font-mono">185 Mins</div>
          <p className="text-[10px] text-[#34D399] mt-1">Through nocturnal RBP</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top Risk Corridors Bar (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            Top Risk Sections (Cumulative Hazard Index)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskSectionData}>
                <XAxis dataKey="section" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Bar dataKey="score" fill="#F05252" name="Risk Index (0-100)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#A7C1D4] text-center mt-2">
            Pimpri–Chinchwad and Chinchwad–Akurdi require prioritized weekend nocturnal tamping windows.
          </p>
        </div>

        {/* Recurring Defect Categories (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A]">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-3">
            Recurring Defect Classification Breakdown
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={recurringDefects} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count">
                  {recurringDefects.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {recurringDefects.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[#A7C1D4] text-[11px]">{d.name}</span>
                </div>
                <span className="font-mono font-bold text-[#E6F4F1] text-[11px]">{d.count} Defect Logs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
