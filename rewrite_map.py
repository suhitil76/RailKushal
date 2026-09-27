# -*- coding: utf-8 -*-
import os

file_path = r'c:\Users\patil\OneDrive\Desktop\SIH\RAILAPP_REF\src\pages\map\PuneDivisionMapPage.tsx'

content = '''import React, { useState, useMemo } from 'react';
import { 
  Search, Maximize2, Layers, MapPin, 
  AlertTriangle, ShieldCheck, CloudRain, Cpu, ArrowRight, X, 
  Zap, Wrench, Radio, Calendar, Info, RefreshCw 
} from 'lucide-react';
import { store } from '../../services/store';
import { Station, Section, Asset, MaintenanceTask, BlockPlan } from '../../types/railway';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: <div style="background-color: \; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const stationIcon = createIcon('#0369A1'); // rail-cyan
const majorStationIcon = createIcon('#0F766E'); // rail-teal
const defectIcon = L.divIcon({
  className: 'custom-icon',
  html: <div style="background-color: #B91C1C; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(185, 28, 28, 0.8); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

interface PuneDivisionMapPageProps {
  onNavigate: (path: string) => void;
}

// Map Updater Component
const MapUpdater = ({ viewScope }: { viewScope: 'PUNE' | 'ALL_INDIA' }) => {
  const map = useMap();
  React.useEffect(() => {
    if (viewScope === 'PUNE') {
      map.setView([18.5289, 73.8744], 9);
    } else {
      map.setView([21.1458, 79.0882], 5);
    }
  }, [viewScope, map]);
  return null;
};

export const PuneDivisionMapPage: React.FC<PuneDivisionMapPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { stations, sections, assets, tasks, blockPlans } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    stations: true,
    corridors: true,
    defects: true,
  });
  const [departmentFilter, setDepartmentFilter] = useState<'ALL' | 'ENGINEERING' | 'TRD' | 'S_AND_T'>('ALL');
  const [viewScope, setViewScope] = useState<'PUNE' | 'ALL_INDIA'>('PUNE');

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Default Center (Pune)
  const center: [number, number] = [18.5289, 73.8744];

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-rail-bg overflow-hidden flex select-none">
      <div className="flex-1 h-full relative z-0">
        <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <MapUpdater viewScope={viewScope} />
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Lines / Sections */}
          {activeLayers.corridors && sections.map(sec => {
            const fromStn = stations.find(s => s.id === sec.fromStationId);
            const toStn = stations.find(s => s.id === sec.toStationId);
            if (!fromStn || !toStn) return null;

            const isSelected = selectedSection?.id === sec.id;
            const isHighDensity = sec.trafficDensity === 'VERY_HIGH';
            const hasDefects = tasks.some(t => t.sectionId === sec.id && t.severity === 'CRITICAL');
            const hasApprovedBlock = blockPlans.some(b => b.sectionId === sec.id && (b.status === 'APPROVED' || b.status === 'PUBLISHED'));

            const color = hasApprovedBlock ? '#059669' : hasDefects ? '#B91C1C' : isHighDensity ? '#0369A1' : '#0F766E';

            return (
              <Polyline
                key={sec.id}
                positions={[[fromStn.latitude, fromStn.longitude], [toStn.latitude, toStn.longitude]]}
                pathOptions={{
                  color,
                  weight: isSelected ? 8 : (isHighDensity ? 5 : 3),
                  opacity: isSelected ? 1 : 0.8,
                  dashArray: sec.electrified ? undefined : '5, 5'
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedSection(sec);
                    setSelectedStation(null);
                  }
                }}
              >
                <LeafletTooltip>{sec.name} ({sec.code})</LeafletTooltip>
              </Polyline>
            );
          })}

          <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
            {/* Stations */}
            {activeLayers.stations && stations.map(stn => {
              if (viewScope === 'PUNE' && stn.zone !== 'CR' && stn.division !== 'PUNE' && stn.division !== 'Pune') {
                 return null;
              }

              return (
                <Marker 
                  key={stn.id} 
                  position={[stn.latitude, stn.longitude]} 
                  icon={stn.isMajor ? majorStationIcon : stationIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedStation(stn);
                      setSelectedSection(null);
                    }
                  }}
                >
                  <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                    <b>{stn.name} ({stn.code})</b>
                  </LeafletTooltip>
                </Marker>
              );
            })}

            {/* Defects */}
            {activeLayers.defects && tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').map(t => {
              const sec = sections.find(s => s.id === t.sectionId);
              if (!sec) return null;
              const fromStn = stations.find(s => s.id === sec.fromStationId);
              const toStn = stations.find(s => s.id === sec.toStationId);
              if (!fromStn || !toStn) return null;

              const midLat = (fromStn.latitude + toStn.latitude) / 2;
              const midLng = (fromStn.longitude + toStn.longitude) / 2;

              return (
                <Marker 
                  key={t.id} 
                  position={[midLat, midLng]} 
                  icon={defectIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedSection(sec);
                      setSelectedStation(null);
                    }
                  }}
                >
                  <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                    <b>Critical Defect: {t.taskCode}</b><br/>{t.title}
                  </LeafletTooltip>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Top Control Bar */}
        <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2.5 max-w-2xl">
          {/* View Scope Toggle */}
          <div className="flex bg-rail-surface/90 backdrop-blur border border-rail-border rounded-xl p-1 shadow-xl">
            <button
              onClick={() => setViewScope('PUNE')}
              className={px-3 py-1.5 rounded-lg text-xs font-bold transition-colors \}
            >
              Pune Division
            </button>
            <button
              onClick={() => setViewScope('ALL_INDIA')}
              className={px-3 py-1.5 rounded-lg text-xs font-bold transition-colors \}
            >
              All India
            </button>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-muted" />
            <input
              type="text"
              placeholder="Search station, section, task..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-rail-surface/90 backdrop-blur border border-rail-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-rail-text placeholder-rail-muted focus:outline-none focus:border-rail-teal shadow-xl"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-[400] p-3 rounded-xl bg-rail-surface/90 backdrop-blur border border-rail-border shadow-xl text-[11px] space-y-2 hidden md:block">
          <div className="font-bold text-xs text-rail-text mb-1">Network Legend</div>
          <div className="flex items-center gap-2 text-rail-secondary">
            <span className="w-3 h-1 bg-rail-teal rounded" /> Trunk Rail Corridor
          </div>
          <div className="flex items-center gap-2 text-rail-secondary">
            <span className="w-3 h-3 rounded-full bg-rail-cyan border-2 border-white" /> Major Station Junction
          </div>
          <div className="flex items-center gap-2 text-rail-secondary">
            <span className="w-3 h-3 rounded-full bg-rail-coral border-2 border-white" /> Critical Risk / Defect
          </div>
          <div className="flex items-center gap-2 text-rail-secondary">
            <span className="w-3 h-1 bg-rail-emerald rounded" /> Scheduled Block Area
          </div>
        </div>
      </div>

      {/* Slide-in Detailed Drawer (Right Side) */}
      {(selectedStation || selectedSection) && (
        <div className="w-96 bg-rail-deep border-l border-rail-border h-full overflow-y-auto p-5 shadow-2xl z-[500] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rail-border">
              <span className="text-[10px] font-mono text-rail-teal uppercase tracking-wider font-bold">
                {selectedStation ? 'Station Telemetry' : 'Corridor Section Details'}
              </span>
              <button 
                onClick={() => { setSelectedStation(null); setSelectedSection(null); }}
                className="p-1 rounded text-rail-muted hover:text-rail-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Station Drawer Content */}
            {selectedStation && (
              <div className="mt-4 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-rail-text">{selectedStation.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-rail-surface text-rail-cyan border border-rail-border">
                      {selectedStation.code}
                    </span>
                    <span className="text-xs text-rail-secondary">{selectedStation.zone} | {selectedStation.division} Division</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rail-bg border border-rail-border text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Tracks:</span>
                    <span className="font-mono text-rail-text">{selectedStation.tracks} Running Lines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Coordinates:</span>
                    <span className="font-mono text-rail-secondary">{selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Status:</span>
                    <span className="text-rail-emerald font-bold">Operational (Normal Traffic)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section Drawer Content */}
            {selectedSection && (
              <div className="mt-4 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-rail-text">{selectedSection.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-rail-surface text-rail-teal border border-rail-border">
                      {selectedSection.code}
                    </span>
                    <span className="text-xs text-rail-secondary">{selectedSection.lengthKm} Kilometers</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rail-bg border border-rail-border text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Line Configuration:</span>
                    <span className="font-mono text-rail-text">{selectedSection.lineCount} Lines &middot; Electrified 25kV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Traffic Density:</span>
                    <span className="text-rail-amber font-bold">{selectedSection.trafficDensity}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-2">
                    Active Critical Defects on Section
                  </h3>
                  {tasks.filter(t => t.sectionId === selectedSection.id).slice(0, 3).map(t => (
                    <div key={t.id} className="p-2.5 rounded-lg bg-rail-bg border border-rail-border mb-2 text-xs">
                      <div className="flex justify-between">
                        <span className="font-mono text-rail-coral font-bold">{t.taskCode}</span>
                        <span className="text-[10px] text-rail-teal font-mono">AI: {t.aiPriorityScore}</span>
                      </div>
                      <p className="text-rail-text truncate mt-0.5">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-rail-border mt-4">
            <button
              onClick={() => onNavigate('/blocks/planning')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow-lg shadow-rail-teal/40 transition-colors"
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
'''

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Map page rewritten with react-leaflet.")
