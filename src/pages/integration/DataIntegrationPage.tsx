import React, { useState } from 'react';
import { 
  Database, Upload, Download, CheckCircle2, AlertCircle, 
  FileSpreadsheet, ArrowRight, RefreshCw, Layers, ShieldCheck 
} from 'lucide-react';
import { store } from '../../services/store';
import { toast } from '../../components/common/Toast';

export const DataIntegrationPage: React.FC = () => {
  const state = store.getState();
  const [selectedSource, setSelectedSource] = useState<string>('TMS');
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<any[] | null>(null);

  const sources = [
    { id: 'TMS', name: 'Track Management System (TMS)', type: 'Permanent Way', count: state.tasks.filter(t => t.sourceSystem === 'TMS').length, quality: '98.5%', status: 'Healthy · Auto-Sync' },
    { id: 'TDMS', name: 'Traction Distribution (TDMS)', type: '25kV AC OHE', count: state.tasks.filter(t => t.sourceSystem === 'TDMS').length, quality: '97.2%', status: 'Healthy · Auto-Sync' },
    { id: 'SMMS', name: 'Signalling Management (SMMS)', type: 'Signals & Telecom', count: state.tasks.filter(t => t.sourceSystem === 'SMMS').length, quality: '96.8%', status: 'Healthy · Auto-Sync' },
    { id: 'COA', name: 'Control Office Application (COA)', type: 'Stipulated Corridors', count: state.corridorWindows.length, quality: '99.1%', status: 'Live Feed Stream' },
    { id: 'TT', name: 'Train Timetable & Goods Forecast', type: 'Timetable Occupancy', count: state.timetable.length, quality: '100%', status: 'Active (7-Day)' },
    { id: 'MET', name: 'IMD Pune Weather Radar', type: 'Meteorology', count: state.weather.length, quality: '95.0%', status: 'Radar Doppler Sim' },
  ];

  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setTimeout(() => {
      // Generate synthetic preview records
      setImportPreview([
        { taskCode: 'ENG-IMP-501', title: 'Track geometry tamp Km 22.4', defect: 'Twist Defect', severity: 'HIGH', section: 'sec-akrd-dehr', status: 'VALID' },
        { taskCode: 'ENG-IMP-502', title: 'Rail end batter weld dressing', defect: 'DFWO Weld', severity: 'CRITICAL', section: 'sec-dehr-bgwi', status: 'VALID' },
        { taskCode: 'TRD-IMP-503', title: 'Cantilever insulator wash', defect: 'Pollution Flashover', severity: 'MEDIUM', section: 'sec-tgn-vdn', status: 'VALID' },
        { taskCode: 'SNT-IMP-504', title: 'Axle counter sensor clamp inspection', defect: 'Clamp Loose', severity: 'HIGH', section: 'sec-cch-akrd', status: 'VALID' },
      ]);
      setIsImporting(false);
      toast.info('CSV Parsed', '4 valid maintenance records staged for schema verification.');
    }, 450);
  };

  const handleCommitImport = () => {
    if (!importPreview) return;
    toast.success('Import Successful', '4 new maintenance records successfully integrated into Pune Division database.');
    setImportPreview(null);
  };

  const downloadSampleTemplate = (filename: string) => {
    let content = '';
    if (filename === 'maintenance_tasks.csv') {
      content = 'TaskCode,SourceSystem,Department,Title,DefectType,Severity,SafetyCriticality,SectionCode,EstimatedDurationMinutes\n' +
                'ENG-201,TMS,ENGINEERING,USFD flaw repair near Chinchwad,IMR Rail Defect,CRITICAL,95,CCH-AKRD,180\n' +
                'TRD-302,TDMS,TRD,OHE Mast insulator renewal,Thermal Hotspot,HIGH,85,TGN-VDN,150\n' +
                'SNT-403,SMMS,S_AND_T,Axle counter reset tuning,Count Drop,HIGH,82,PMP-CCH,120';
    } else if (filename === 'stations.csv') {
      content = 'Code,Name,Latitude,Longitude,Tracks,IsMajor\n' +
                'PUNE,Pune Junction,18.5289,73.8744,6,true\n' +
                'LNL,Lonavala,18.7519,73.4074,5,true\n' +
                'CCH,Chinchwad,18.6367,73.7885,4,true';
    } else {
      content = 'Field1,Field2,Field3,Field4\nSampleA,100,True,2026-09-20\nSampleB,200,False,2026-09-21';
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.info('Template Downloaded', `${filename} ready for offline editing.`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider font-mono">
              Enterprise Integration Centre
            </span>
            <span className="text-xs text-[#A7C1D4]">Admin Pipeline &amp; CSV Adapter Hub</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Indian Railways Digital Feeds &amp; Batch CSV Ingestion
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Interconnects TMS, SMMS, TDMS, and COA feeds into the RailKushal unified decision layer.
          </p>
        </div>
      </div>

      {/* Connected Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map(s => (
          <div 
            key={s.id}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedSource === s.id ? 'bg-[#163B5C] border-[#20C6B7] shadow-lg shadow-cyan-950/40' : 'bg-[#0B1F33] border-[#244B6A] hover:bg-[#102A43]'
            }`}
            onClick={() => setSelectedSource(s.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#E6F4F1]">{s.name}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#34D399]/20 text-[#34D399]">
                {s.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#A7C1D4] font-mono mt-3">
              <span>{s.count} Active Records</span>
              <span>Quality: <strong className="text-[#20C6B7]">{s.quality}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Ingestion Simulation & Validator */}
      <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#244B6A] shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#244B6A]">
          <div>
            <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
              Batch CSV Upload &amp; Schema Validation Engine
            </h3>
            <p className="text-xs text-[#A7C1D4] mt-0.5">
              Upload departmental defect registers for automated column mapping, deduplication, and AI scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs shadow-md cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Parsing CSV...' : 'Upload Maintenance CSV'}</span>
              <input type="file" accept=".csv" onChange={handleSimulateCSVUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Staged Records Preview Table if uploaded */}
        {importPreview && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#34D399] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 4 Records Validated against CRIS Railway Standards
              </span>
              <button
                onClick={handleCommitImport}
                className="px-3 py-1.5 rounded-lg bg-[#34D399] hover:bg-[#34D399]/90 text-[#071626] font-bold text-xs"
              >
                Commit Staged Records to Database
              </button>
            </div>

            <div className="bg-[#071626] border border-[#244B6A] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#102A43] text-[#A7C1D4] text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-3">Task Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Defect</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Section ID</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#244B6A]/50">
                  {importPreview.map((r, i) => (
                    <tr key={i} className="text-[#E6F4F1]">
                      <td className="p-3 font-mono font-bold text-[#38BDF8]">{r.taskCode}</td>
                      <td className="p-3">{r.title}</td>
                      <td className="p-3 text-[#A7C1D4]">{r.defect}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.severity === 'CRITICAL' ? 'bg-[#F05252]/20 text-[#F05252]' : 'bg-[#F4B942]/20 text-[#F4B942]'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#6E8AA3]">{r.section}</td>
                      <td className="p-3 text-[#34D399] font-bold text-[10px]">READY TO COMMIT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Downloadable Sample Templates */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-[#A7C1D4] uppercase tracking-wider mb-2.5">
            Download Standard Indian Railways CSV Templates:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'stations.csv', 'sections.csv', 'assets.csv', 
              'maintenance_tasks.csv', 'timetable.csv', 
              'corridor_windows.csv', 'weather.csv', 'block_requests.csv'
            ].map(tpl => (
              <button
                key={tpl}
                onClick={() => downloadSampleTemplate(tpl)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071626] hover:bg-[#102A43] border border-[#244B6A] text-[#A7C1D4] hover:text-[#20C6B7] text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{tpl}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
