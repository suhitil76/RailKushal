import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, ZoomIn, ZoomOut, Maximize2, Layers, MapPin, 
  AlertTriangle, ShieldCheck, CloudRain, Cpu, ArrowRight, X, 
  Zap, Wrench, Radio, Calendar, Info, RefreshCw 
} from 'lucide-react';
import { store } from '../../services/store';
import { Station, Section, Asset, MaintenanceTask, BlockPlan } from '../../types/railway';

interface PuneDivisionMapPageProps {
  onNavigate: (path: string) => void;
}

export const PuneDivisionMapPage: React.FC<PuneDivisionMapPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { stations, sections, assets, tasks, blockPlans, weather } = state;

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    stations: true,
    corridors: true,
    defects: true,
    blocks: true,
    weather: true,
    density: true
  });
  const [departmentFilter, setDepartmentFilter] = useState<'ALL' | 'ENGINEERING' | 'TRD' | 'S_AND_T'>('ALL');

  // Selected Elements
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Geo-Projection helpers (Pune Division bounds)
  // Lat: 16.5 to 18.9, Lng: 73.2 to 74.8
  const minLat = 16.5, maxLat = 18.9;
  const minLng = 73.2, maxLng = 74.8;
  const width = 1100, height = 800;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 160) + 80;
    // Invert Y because latitude increases northward
    const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 160) + 80;
    return { x, y };
  };

  // Search Filter Highlights
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const matchedStn = stations.find(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    const matchedSec = sections.find(s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    const matchedTask = tasks.find(t => t.taskCode.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));
    return { matchedStn, matchedSec, matchedTask };
  }, [searchQuery, stations, sections, tasks]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-[#071626] overflow-hidden flex select-none">
      {/* Map Canvas / SVG Area */}
      <div 
        className="flex-1 h-full relative cursor-grab active:cursor-grabbing bg-rail-pattern"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2.5 max-w-2xl">
          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E8AA3]" />
            <input
              type="text"
              placeholder="Search station (PUNE, LNL), section (CCH-AKRD), task (ENG-104)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1F33]/90 backdrop-blur border border-[#244B6A] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7] shadow-xl"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value as any)}
            className="bg-[#0B1F33]/90 backdrop-blur border border-[#244B6A] rounded-xl px-3 py-2 text-xs text-[#E6F4F1] focus:border-[#20C6B7] shadow-xl"
          >
            <option value="ALL">All Departments</option>
            <option value="ENGINEERING">Engineering</option>
            <option value="TRD">TRD (Electrical)</option>
            <option value="S_AND_T">S&T (Signals)</option>
          </select>
        </div>

        {/* Map Legend Overlay (Top Right) */}
        <div className="absolute top-4 right-4 z-20 p-3 rounded-xl bg-[#0B1F33]/90 backdrop-blur border border-[#244B6A] shadow-xl text-[11px] space-y-2 hidden md:block">
          <div className="font-bold text-xs text-[#E6F4F1] mb-1">Network Legend</div>
          <div className="flex items-center gap-2 text-[#A7C1D4]">
            <span className="w-3 h-1 bg-[#20C6B7] rounded" /> Trunk Rail Corridor
          </div>
          <div className="flex items-center gap-2 text-[#A7C1D4]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] border border-[#20C6B7]" /> Major Station Junction
          </div>
          <div className="flex items-center gap-2 text-[#A7C1D4]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F05252] animate-ping" /> Critical Defect Marker
          </div>
          <div className="flex items-center gap-2 text-[#A7C1D4]">
            <span className="w-3 h-1 bg-[#34D399] rounded" /> Approved Maintenance Block
          </div>
        </div>

        {/* Zoom & Navigation Controls (Bottom Left) */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
          <button
            onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
            className="p-2.5 rounded-xl bg-[#0B1F33] border border-[#244B6A] text-[#A7C1D4] hover:text-[#E6F4F1] hover:border-[#20C6B7] shadow-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.6, z - 0.25))}
            className="p-2.5 rounded-xl bg-[#0B1F33] border border-[#244B6A] text-[#A7C1D4] hover:text-[#E6F4F1] hover:border-[#20C6B7] shadow-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2.5 rounded-xl bg-[#0B1F33] border border-[#244B6A] text-[#A7C1D4] hover:text-[#E6F4F1] hover:border-[#20C6B7] shadow-lg transition-colors"
            title="Fit Pune Division"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive SVG Network */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Track Corridor Lines (Sections) */}
            {activeLayers.corridors && sections.map(sec => {
              const fromStn = stations.find(s => s.id === sec.fromStationId);
              const toStn = stations.find(s => s.id === sec.toStationId);
              if (!fromStn || !toStn) return null;

              const p1 = project(fromStn.latitude, fromStn.longitude);
              const p2 = project(toStn.latitude, toStn.longitude);

              const isSelected = selectedSection?.id === sec.id;
              const isHighDensity = sec.trafficDensity === 'VERY_HIGH';
              const hasDefects = tasks.some(t => t.sectionId === sec.id && t.severity === 'CRITICAL');
              const hasApprovedBlock = blockPlans.some(b => b.sectionId === sec.id && (b.status === 'APPROVED' || b.status === 'PUBLISHED'));

              return (
                <g 
                  key={sec.id}
                  onClick={() => {
                    setSelectedSection(sec);
                    setSelectedStation(null);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Invisible wide hit area */}
                  <line 
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                    stroke="transparent" 
                    strokeWidth="16" 
                  />

                  {/* Outer Glow for selected or critical */}
                  {isSelected && (
                    <line 
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                      stroke="#20C6B7" 
                      strokeWidth="8" 
                      strokeOpacity="0.5" 
                      className="animate-pulse"
                    />
                  )}

                  {/* Railway track line */}
                  <line 
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                    stroke={
                      hasApprovedBlock ? '#34D399' :
                      hasDefects ? '#F05252' :
                      isHighDensity ? '#38BDF8' : '#20C6B7'
                    }
                    strokeWidth={isHighDensity ? 4.5 : 3}
                    strokeDasharray={sec.electrified ? undefined : '5 3'}
                    strokeLinecap="round"
                    className="transition-all group-hover:stroke-[#20C6B7] group-hover:stroke-width-6"
                  />

                  {/* Section Label (midpoint) */}
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 8}
                    fill="#A7C1D4"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-black"
                  >
                    {sec.code} ({sec.lengthKm}km)
                  </text>
                </g>
              );
            })}

            {/* 2. Critical Defect Pins */}
            {activeLayers.defects && tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').map(t => {
              const sec = sections.find(s => s.id === t.sectionId);
              if (!sec) return null;
              const fromStn = stations.find(s => s.id === sec.fromStationId);
              const toStn = stations.find(s => s.id === sec.toStationId);
              if (!fromStn || !toStn) return null;

              const p1 = project(fromStn.latitude, fromStn.longitude);
              const p2 = project(toStn.latitude, toStn.longitude);
              const midX = (p1.x + p2.x) / 2 + 5;
              const midY = (p1.y + p2.y) / 2 - 5;

              return (
                <g key={t.id} className="cursor-pointer" onClick={() => setSelectedSection(sec)}>
                  <circle cx={midX} cy={midY} r="6" fill="#F05252" className="animate-ping" opacity="0.7" />
                  <circle cx={midX} cy={midY} r="4" fill="#F05252" stroke="#071626" strokeWidth="1.5" />
                </g>
              );
            })}

            {/* 3. Station Nodes */}
            {activeLayers.stations && stations.map(stn => {
              const pos = project(stn.latitude, stn.longitude);
              const isSelected = selectedStation?.id === stn.id;
              const isMajor = stn.isMajor;

              return (
                <g
                  key={stn.id}
                  onClick={() => {
                    setSelectedStation(stn);
                    setSelectedSection(null);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Station Node Ring */}
                  {isSelected && (
                    <circle 
                      cx={pos.x} cy={pos.y} 
                      r={isMajor ? 14 : 10} 
                      fill="none" 
                      stroke="#20C6B7" 
                      strokeWidth="2.5" 
                      className="animate-pulse" 
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={isMajor ? 7 : 4.5}
                    fill={isMajor ? '#38BDF8' : '#0B1F33'}
                    stroke={isSelected ? '#20C6B7' : '#244B6A'}
                    strokeWidth={isMajor ? 2.5 : 1.5}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Station Code Label */}
                  <text
                    x={pos.x}
                    y={pos.y + (isMajor ? 17 : 13)}
                    fill={isSelected ? '#20C6B7' : isMajor ? '#E6F4F1' : '#A7C1D4'}
                    fontSize={isMajor ? '11' : '9'}
                    fontWeight={isMajor ? 'bold' : 'normal'}
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {stn.code}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Disclaimer Bar (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-[#0B1F33]/80 backdrop-blur border border-[#244B6A] text-[10px] text-[#6E8AA3]">
          Demo network representation for Pune Division. Verify operational geography and safety constraints before production use.
        </div>
      </div>

      {/* Slide-in Detailed Drawer (Right Side) for Station or Section */}
      {(selectedStation || selectedSection) && (
        <div className="w-96 bg-[#0B1F33] border-l border-[#244B6A] h-full overflow-y-auto p-5 shadow-2xl z-30 animate-in slide-in-from-right flex flex-col justify-between">
          <div>
            {/* Drawer Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#244B6A]">
              <span className="text-[10px] font-mono text-[#20C6B7] uppercase tracking-wider font-bold">
                {selectedStation ? 'Station Telemetry' : 'Corridor Section Details'}
              </span>
              <button 
                onClick={() => { setSelectedStation(null); setSelectedSection(null); }}
                className="p-1 rounded text-[#6E8AA3] hover:text-[#E6F4F1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Station Drawer Content */}
            {selectedStation && (
              <div className="mt-4 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#E6F4F1]">{selectedStation.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#102A43] text-[#38BDF8] border border-[#244B6A]">
                      {selectedStation.code}
                    </span>
                    <span className="text-xs text-[#A7C1D4]">Route Km: {selectedStation.routeKm}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Tracks:</span>
                    <span className="font-mono text-[#E6F4F1]">{selectedStation.tracks} Running Lines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Coordinates:</span>
                    <span className="font-mono text-[#A7C1D4]">{selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Status:</span>
                    <span className="text-[#34D399] font-bold">Operational (Normal Traffic)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-2">
                    Nearby Maintenance Demands
                  </h3>
                  {tasks.filter(t => t.sectionId.includes(selectedStation.id.slice(4))).slice(0, 3).map(t => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-[#071626] border border-[#244B6A] mb-2 text-xs">
                      <span className="font-mono text-[#38BDF8] font-bold">{t.taskCode}</span>
                      <p className="text-[#E6F4F1] truncate mt-0.5">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Drawer Content */}
            {selectedSection && (
              <div className="mt-4 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#E6F4F1]">{selectedSection.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#102A43] text-[#20C6B7] border border-[#244B6A]">
                      {selectedSection.code}
                    </span>
                    <span className="text-xs text-[#A7C1D4]">{selectedSection.lengthKm} Kilometers</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#071626] border border-[#244B6A] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Line Configuration:</span>
                    <span className="font-mono text-[#E6F4F1]">{selectedSection.lineCount} Lines · Electrified 25kV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Traffic Density:</span>
                    <span className="text-[#F4B942] font-bold">{selectedSection.trafficDensity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E8AA3]">Stipulated Window:</span>
                    <span className="font-mono text-[#34D399]">01:30 - 04:30 (Night Corridor)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider mb-2">
                    Active Critical Defects on Section
                  </h3>
                  {tasks.filter(t => t.sectionId === selectedSection.id).slice(0, 3).map(t => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-[#071626] border border-[#244B6A] mb-2 text-xs">
                      <div className="flex justify-between">
                        <span className="font-mono text-[#F05252] font-bold">{t.taskCode}</span>
                        <span className="text-[10px] text-[#20C6B7] font-mono">AI: {t.aiPriorityScore}</span>
                      </div>
                      <p className="text-[#E6F4F1] truncate mt-0.5">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-[#244B6A]">
            <button
              onClick={() => onNavigate('/blocks/planning')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs shadow-lg shadow-teal-950/40 transition-colors"
            >
              <Cpu className="w-4 h-4" />
              <span>Open in Planning Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
