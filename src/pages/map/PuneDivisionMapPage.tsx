import React, { useState } from 'react';
import {
  Search, Cpu, X, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { store } from '../../services/store';
import { Station, Section, MaintenanceTask } from '../../types/railway';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCircleIcon = (color: string, size = 14) =>
  L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const majorStationIcon = createCircleIcon('#0F766E', 16);
const minorStationIcon = createCircleIcon('#0369A1', 10);
const defectIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#B91C1C;width:18px;height:18px;border-radius:50%;border:2.5px solid white;box-shadow:0 0 8px rgba(185,28,28,0.8);animation:pulse 2s infinite;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const allIndiaStationIcon = createCircleIcon('#1769AA', 14);

interface PuneDivisionMapPageProps {
  onNavigate: (path: string) => void;
}

// Re-centre map when scope changes
const MapReCenter = ({ viewScope }: { viewScope: 'PUNE' | 'ALL_INDIA' }) => {
  const map = useMap();
  React.useEffect(() => {
    if (viewScope === 'PUNE') {
      map.flyTo([18.52, 73.87], 9);
    } else {
      map.flyTo([22.5, 80.0], 5);
    }
  }, [viewScope, map]);
  return null;
};

export const PuneDivisionMapPage: React.FC<PuneDivisionMapPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { stations, sections, tasks, blockPlans } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewScope, setViewScope] = useState<'PUNE' | 'ALL_INDIA'>('PUNE');
  const [activeLayers, setActiveLayers] = useState({
    stations: true,
    corridors: true,
    defects: true,
    blocks: true,
  });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Filter stations depending on view scope
  const visibleStations = stations.filter(stn => {
    if (viewScope === 'PUNE') {
      return stn.division === 'PUNE' || stn.division === 'Pune';
    }
    return true; // All India shows everything
  });

  // Filter sections for Pune only
  const visibleSections = sections; // sections only have Pune data

  const toggleLayer = (key: keyof typeof activeLayers) =>
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-rail-bg overflow-hidden flex select-none">
      {/* Map */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer
          center={[18.52, 73.87]}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapReCenter viewScope={viewScope} />

          {/* Basemap – CartoDB Voyager (clean, professional) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />

          {/* Section Polylines */}
          {activeLayers.corridors && visibleSections.map(sec => {
            const fromStn = stations.find(s => s.id === sec.fromStationId);
            const toStn = stations.find(s => s.id === sec.toStationId);
            if (!fromStn || !toStn) return null;

            const isSelected = selectedSection?.id === sec.id;
            const hasDefects = tasks.some(t => t.sectionId === sec.id && t.severity === 'CRITICAL' && t.status !== 'COMPLETED');
            const hasBlock = activeLayers.blocks && blockPlans.some(b => b.sectionId === sec.id && (b.status === 'APPROVED' || b.status === 'PUBLISHED'));
            const isVeryHigh = sec.trafficDensity === 'VERY_HIGH';

            const color = hasBlock ? '#059669' : hasDefects ? '#B91C1C' : isVeryHigh ? '#0369A1' : '#0F766E';

            return (
              <Polyline
                key={sec.id}
                positions={[[fromStn.latitude, fromStn.longitude], [toStn.latitude, toStn.longitude]]}
                pathOptions={{
                  color: isSelected ? '#D97706' : color,
                  weight: isSelected ? 7 : (isVeryHigh ? 5 : 3),
                  opacity: 0.85,
                  dashArray: sec.electrified ? undefined : '6 4',
                }}
                eventHandlers={{ click: () => { setSelectedSection(sec); setSelectedStation(null); } }}
              >
                <LeafletTooltip sticky>
                  <b>{sec.name}</b> · {sec.lengthKm} km · {sec.trafficDensity}
                </LeafletTooltip>
              </Polyline>
            );
          })}

          {/* Critical Defect Markers */}
          {activeLayers.defects && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
              {tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').map(t => {
                const sec = sections.find(s => s.id === t.sectionId);
                if (!sec) return null;
                const fromStn = stations.find(s => s.id === sec.fromStationId);
                const toStn = stations.find(s => s.id === sec.toStationId);
                if (!fromStn || !toStn) return null;
                const lat = (fromStn.latitude + toStn.latitude) / 2 + (Math.random() - 0.5) * 0.01;
                const lng = (fromStn.longitude + toStn.longitude) / 2 + (Math.random() - 0.5) * 0.01;
                return (
                  <Marker key={t.id} position={[lat, lng]} icon={defectIcon}
                    eventHandlers={{ click: () => { setSelectedSection(sec); setSelectedStation(null); } }}>
                    <LeafletTooltip direction="top">
                      <b>⚠ CRITICAL: {t.taskCode}</b><br />
                      <span style={{ fontSize: 11 }}>{t.title.slice(0, 60)}...</span>
                    </LeafletTooltip>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          )}

          {/* Station Markers */}
          {activeLayers.stations && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
              {visibleStations.map(stn => {
                const isAllIndia = stn.division !== 'PUNE' && stn.division !== 'Pune';
                return (
                  <Marker
                    key={stn.id}
                    position={[stn.latitude, stn.longitude]}
                    icon={isAllIndia ? allIndiaStationIcon : (stn.isMajor ? majorStationIcon : minorStationIcon)}
                    eventHandlers={{ click: () => { setSelectedStation(stn); setSelectedSection(null); } }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -8]}>
                      <b>{stn.name} ({stn.code})</b><br />
                      <span style={{ fontSize: 11 }}>{stn.zone} · {stn.division} Div · {stn.tracks} lines</span>
                    </LeafletTooltip>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          )}
        </MapContainer>

        {/* ─── FLOATING TOP TOOLBAR ─── */}
        <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
          {/* Scope Toggle */}
          <div className="flex bg-white/95 backdrop-blur border border-rail-border rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setViewScope('PUNE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewScope === 'PUNE' ? 'bg-rail-teal text-white' : 'text-rail-secondary hover:text-rail-text'
              }`}
            >
              Pune Division
            </button>
            <button
              onClick={() => setViewScope('ALL_INDIA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewScope === 'ALL_INDIA' ? 'bg-rail-teal text-white' : 'text-rail-secondary hover:text-rail-text'
              }`}
            >
              All India
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-muted" />
            <input
              type="text"
              placeholder="Search station, section, task..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur border border-rail-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-rail-text focus:outline-none focus:border-rail-teal shadow-md"
            />
          </div>
        </div>

        {/* ─── LAYER TOGGLES ─── */}
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur border border-rail-border rounded-xl p-3 shadow-lg text-xs space-y-2 min-w-[160px]">
          <div className="font-bold text-rail-text mb-1">Map Layers</div>
          {(['stations', 'corridors', 'defects', 'blocks'] as const).map(layer => (
            <label key={layer} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={activeLayers[layer]}
                onChange={() => toggleLayer(layer)}
                className="accent-rail-teal"
              />
              <span className="capitalize text-rail-secondary">{layer === 'defects' ? 'Critical Defects' : layer === 'blocks' ? 'Approved Blocks' : layer}</span>
            </label>
          ))}
        </div>

        {/* ─── LEGEND ─── */}
        <div className="absolute bottom-8 left-4 z-[400] bg-white/95 backdrop-blur border border-rail-border rounded-xl p-3 shadow-lg text-[11px] space-y-1.5 hidden md:block">
          <div className="font-bold text-xs text-rail-text mb-2">Network Legend</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-5 h-1.5 rounded bg-[#0F766E] inline-block" /> Trunk Corridor</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-5 h-1.5 rounded bg-[#0369A1] inline-block" /> Very High Traffic</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-5 h-1.5 rounded bg-[#B91C1C] inline-block" /> Critical Defect</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-5 h-1.5 rounded bg-[#059669] inline-block" /> Approved Block</div>
          <div className="mt-2 pt-2 border-t border-rail-border font-bold text-xs text-rail-text">Stations</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-4 h-4 rounded-full bg-[#0F766E] border-2 border-white inline-block shadow" /> Major Junction</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-2.5 h-2.5 rounded-full bg-[#0369A1] border-2 border-white inline-block shadow" /> Station</div>
          <div className="flex items-center gap-2 text-rail-secondary"><span className="w-4 h-4 rounded-full bg-[#B91C1C] border-2 border-white inline-block shadow" /> ⚠ Critical Risk</div>
        </div>

        {/* Disclaimer */}
        <div className="absolute bottom-3 right-3 z-[400] px-2.5 py-1 rounded-lg bg-white/80 border border-rail-border text-[10px] text-rail-muted">
          {viewScope === 'PUNE' ? 'Pune Division Demo Geometry' : 'All India — Representative Synthetic Locations'} · Verify before operational use
        </div>
      </div>

      {/* ─── SIDE DRAWER ─── */}
      {(selectedStation || selectedSection) && (
        <div className="w-80 bg-white border-l border-rail-border h-full overflow-y-auto shadow-xl z-[500] flex flex-col">
          <div className="p-4 border-b border-rail-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-rail-teal uppercase tracking-wider font-bold">
              {selectedStation ? 'Station Details' : 'Corridor Section'}
            </span>
            <button onClick={() => { setSelectedStation(null); setSelectedSection(null); }} className="p-1 rounded text-rail-muted hover:text-rail-coral">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex-1">
            {/* Station panel */}
            {selectedStation && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-rail-text">{selectedStation.name}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rail-teal/10 text-rail-teal border border-rail-teal/30">
                      {selectedStation.code}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedStation.zone}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rail-deep/10 text-rail-secondary border border-rail-border">
                      {selectedStation.division} Div
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-rail-bg border border-rail-border p-3 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-rail-muted">Running Lines</span><span className="font-mono font-bold">{selectedStation.tracks}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Route Km</span><span className="font-mono">{selectedStation.routeKm}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Type</span><span className={selectedStation.isMajor ? 'text-rail-teal font-bold' : 'text-rail-secondary'}>{selectedStation.isMajor ? 'Major Junction' : 'Intermediate Station'}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Coordinates</span><span className="font-mono text-rail-secondary">{selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}</span></div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-2">Nearby Tasks</h3>
                  {tasks.filter(t => t.sectionId && sections.find(s => s.id === t.sectionId && (s.fromStationId === selectedStation.id || s.toStationId === selectedStation.id))).slice(0, 3).map(t => (
                    <div key={t.id} className="p-2 rounded-lg bg-rail-bg border border-rail-border mb-1.5 text-xs">
                      <span className="font-mono text-rail-cyan font-bold">{t.taskCode}</span>
                      <p className="text-rail-text truncate mt-0.5">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section panel */}
            {selectedSection && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-rail-text">{selectedSection.name}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rail-teal/10 text-rail-teal border border-rail-teal/30">
                      {selectedSection.code}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${
                      selectedSection.trafficDensity === 'VERY_HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                      selectedSection.trafficDensity === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {selectedSection.trafficDensity}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-rail-bg border border-rail-border p-3 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-rail-muted">Length</span><span className="font-mono font-bold">{selectedSection.lengthKm} km</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Lines</span><span className="font-mono">{selectedSection.lineCount}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Electrified</span><span className={selectedSection.electrified ? 'text-rail-emerald font-bold' : 'text-rail-muted'}>{selectedSection.electrified ? '25kV AC' : 'No'}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Stipulated Window</span><span className="font-mono text-rail-emerald">01:30 – 04:30</span></div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-2">Active Defects</h3>
                  {tasks.filter(t => t.sectionId === selectedSection.id && t.status !== 'COMPLETED').slice(0, 4).map(t => (
                    <div key={t.id} className={`p-2 rounded-lg border mb-1.5 text-xs ${t.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-rail-bg border-rail-border'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-rail-coral">{t.taskCode}</span>
                        <span className="text-[10px] text-rail-teal font-mono">AI: {t.aiPriorityScore}</span>
                      </div>
                      <p className="text-rail-text truncate mt-0.5">{t.title}</p>
                    </div>
                  ))}
                  {tasks.filter(t => t.sectionId === selectedSection.id && t.status !== 'COMPLETED').length === 0 && (
                    <p className="text-xs text-rail-muted italic">No active defects on this section.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-rail-border">
            <button
              onClick={() => onNavigate('/blocks/planning')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow transition-colors"
            >
              <Cpu className="w-4 h-4" />
              Open in Planning Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
