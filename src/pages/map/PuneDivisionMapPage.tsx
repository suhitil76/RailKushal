import React, { useMemo, useState } from 'react';
import {
  Search, Cpu, X, ZoomIn, ZoomOut, Maximize2, MapPinned, TrainFront
} from 'lucide-react';
import { store } from '../../services/store';
import { Station, Section, MaintenanceTask } from '../../types/railway';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCircleIcon = (color: string, size = 12) =>
  L.divIcon({
    className: 'railway-map-marker',
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.35);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const majorStationIcon = createCircleIcon('#0F766E', 15);
const minorStationIcon = createCircleIcon('#1769AA', 9);
const allIndiaStationIcon = createCircleIcon('#334155', 10);
const defectIcon = L.divIcon({
  className: 'railway-map-marker',
  html: '<div style="background:#B91C1C;width:17px;height:17px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 1px 7px rgba(185,28,28,.45);"></div>',
  iconSize: [17, 17],
  iconAnchor: [8.5, 8.5],
});

interface PuneDivisionMapPageProps {
  onNavigate: (path: string) => void;
}

interface NetworkStation extends Station {
  railwayZone: string;
  headquarters?: boolean;
}

interface NetworkCorridor {
  id: string;
  name: string;
  zone: string;
  from: string;
  to: string;
  traffic: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
}

const INDIA_STATIONS: NetworkStation[] = [
  { id:'ndls',code:'NDLS',name:'New Delhi',latitude:28.6139,longitude:77.2090,zone:'Northern Railway',division:'Delhi',routeKm:0,isMajor:true,tracks:16,railwayZone:'Northern Railway',headquarters:true },
  { id:'amb',code:'UMB',name:'Ambala Cantt',latitude:30.3782,longitude:76.7937,zone:'Northern Railway',division:'Ambala',routeKm:200,isMajor:true,tracks:8,railwayZone:'Northern Railway' },
  { id:'ludh',code:'LDH',name:'Ludhiana',latitude:30.9000,longitude:75.8573,zone:'Northern Railway',division:'Firozpur',routeKm:315,isMajor:true,tracks:8,railwayZone:'Northern Railway' },
  { id:'jammu',code:'JAT',name:'Jammu Tawi',latitude:32.7064,longitude:74.8790,zone:'Northern Railway',division:'Firozpur',routeKm:580,isMajor:true,tracks:6,railwayZone:'Northern Railway' },
  { id:'jaipur',code:'JP',name:'Jaipur',latitude:26.9124,longitude:75.7873,zone:'North Western Railway',division:'Jaipur',routeKm:305,isMajor:true,tracks:8,railwayZone:'North Western Railway',headquarters:true },
  { id:'ahm',code:'ADI',name:'Ahmedabad',latitude:23.0225,longitude:72.5714,zone:'Western Railway',division:'Ahmedabad',routeKm:491,isMajor:true,tracks:12,railwayZone:'Western Railway' },
  { id:'mumbai',code:'CSMT',name:'Mumbai CSMT',latitude:18.9402,longitude:72.8356,zone:'Central Railway',division:'Mumbai',routeKm:0,isMajor:true,tracks:18,railwayZone:'Central Railway',headquarters:true },
  { id:'pune',code:'PUNE',name:'Pune',latitude:18.5289,longitude:73.8744,zone:'Central Railway',division:'Pune',routeKm:192,isMajor:true,tracks:6,railwayZone:'Central Railway' },
  { id:'ngp',code:'NGP',name:'Nagpur',latitude:21.1458,longitude:79.0882,zone:'Central Railway',division:'Nagpur',routeKm:812,isMajor:true,tracks:10,railwayZone:'Central Railway' },
  { id:'bhusawal',code:'BSL',name:'Bhusawal',latitude:21.0468,longitude:75.7819,zone:'Central Railway',division:'Bhusawal',routeKm:421,isMajor:true,tracks:8,railwayZone:'Central Railway' },
  { id:'bhopal',code:'BPL',name:'Bhopal',latitude:23.2599,longitude:77.4126,zone:'West Central Railway',division:'Bhopal',routeKm:0,isMajor:true,tracks:8,railwayZone:'West Central Railway' },
  { id:'jabalpur',code:'JBP',name:'Jabalpur',latitude:23.1815,longitude:79.9864,zone:'West Central Railway',division:'Jabalpur',routeKm:0,isMajor:true,tracks:8,railwayZone:'West Central Railway',headquarters:true },
  { id:'kota',code:'KOTA',name:'Kota',latitude:25.2138,longitude:75.8648,zone:'West Central Railway',division:'Kota',routeKm:0,isMajor:true,tracks:8,railwayZone:'West Central Railway' },
  { id:'agra',code:'AGC',name:'Agra Cantt',latitude:27.1570,longitude:77.9890,zone:'North Central Railway',division:'Agra',routeKm:195,isMajor:true,tracks:8,railwayZone:'North Central Railway' },
  { id:'prayagraj',code:'PRYJ',name:'Prayagraj',latitude:25.4358,longitude:81.8463,zone:'North Central Railway',division:'Prayagraj',routeKm:0,isMajor:true,tracks:10,railwayZone:'North Central Railway',headquarters:true },
  { id:'kanpur',code:'CNB',name:'Kanpur Central',latitude:26.4499,longitude:80.3319,zone:'North Central Railway',division:'Prayagraj',routeKm:440,isMajor:true,tracks:10,railwayZone:'North Central Railway' },
  { id:'lucknow',code:'LKO',name:'Lucknow',latitude:26.8467,longitude:80.9462,zone:'Northern Railway',division:'Lucknow',routeKm:0,isMajor:true,tracks:8,railwayZone:'Northern Railway' },
  { id:'varanasi',code:'BSB',name:'Varanasi',latitude:25.3176,longitude:82.9739,zone:'North Eastern Railway',division:'Varanasi',routeKm:0,isMajor:true,tracks:8,railwayZone:'North Eastern Railway' },
  { id:'gorakhpur',code:'GKP',name:'Gorakhpur',latitude:26.7606,longitude:83.3732,zone:'North Eastern Railway',division:'Lucknow',routeKm:0,isMajor:true,tracks:8,railwayZone:'North Eastern Railway',headquarters:true },
  { id:'patna',code:'PNBE',name:'Patna',latitude:25.5941,longitude:85.1376,zone:'East Central Railway',division:'Danapur',routeKm:0,isMajor:true,tracks:8,railwayZone:'East Central Railway' },
  { id:'hajipur',code:'HJP',name:'Hajipur',latitude:25.6854,longitude:85.2147,zone:'East Central Railway',division:'Sonpur',routeKm:0,isMajor:true,tracks:6,railwayZone:'East Central Railway',headquarters:true },
  { id:'ranchi',code:'RNC',name:'Ranchi',latitude:23.3441,longitude:85.3096,zone:'South Eastern Railway',division:'Ranchi',routeKm:0,isMajor:true,tracks:6,railwayZone:'South Eastern Railway' },
  { id:'kolkata',code:'HWH',name:'Howrah',latitude:22.5958,longitude:88.2636,zone:'Eastern Railway',division:'Howrah',routeKm:0,isMajor:true,tracks:23,railwayZone:'Eastern Railway' },
  { id:'kharagpur',code:'KGP',name:'Kharagpur',latitude:22.3460,longitude:87.2320,zone:'South Eastern Railway',division:'Kharagpur',routeKm:0,isMajor:true,tracks:12,railwayZone:'South Eastern Railway' },
  { id:'bhubaneswar',code:'BBS',name:'Bhubaneswar',latitude:20.2961,longitude:85.8245,zone:'East Coast Railway',division:'Khurda Road',routeKm:0,isMajor:true,tracks:8,railwayZone:'East Coast Railway',headquarters:true },
  { id:'raipur',code:'R',name:'Raipur',latitude:21.2514,longitude:81.6296,zone:'South East Central Railway',division:'Raipur',routeKm:0,isMajor:true,tracks:8,railwayZone:'South East Central Railway' },
  { id:'bilaspur',code:'BSP',name:'Bilaspur',latitude:22.0797,longitude:82.1409,zone:'South East Central Railway',division:'Bilaspur',routeKm:0,isMajor:true,tracks:8,railwayZone:'South East Central Railway',headquarters:true },
  { id:'secunderabad',code:'SC',name:'Secunderabad',latitude:17.4399,longitude:78.4983,zone:'South Central Railway',division:'Secunderabad',routeKm:0,isMajor:true,tracks:10,railwayZone:'South Central Railway',headquarters:true },
  { id:'vijayawada',code:'BZA',name:'Vijayawada',latitude:16.5062,longitude:80.6480,zone:'South Central Railway',division:'Vijayawada',routeKm:0,isMajor:true,tracks:10,railwayZone:'South Central Railway' },
  { id:'visakhapatnam',code:'VSKP',name:'Visakhapatnam',latitude:17.6868,longitude:83.2185,zone:'East Coast Railway',division:'Waltair',routeKm:0,isMajor:true,tracks:8,railwayZone:'East Coast Railway' },
  { id:'goa',code:'MAO',name:'Madgaon',latitude:15.2832,longitude:73.9862,zone:'Konkan Railway',division:'Konkan',routeKm:0,isMajor:true,tracks:4,railwayZone:'Konkan Railway' },
  { id:'hubballi',code:'UBL',name:'Hubballi',latitude:15.3647,longitude:75.1240,zone:'South Western Railway',division:'Hubballi',routeKm:0,isMajor:true,tracks:6,railwayZone:'South Western Railway',headquarters:true },
  { id:'bengaluru',code:'SBC',name:'KSR Bengaluru',latitude:12.9784,longitude:77.5690,zone:'South Western Railway',division:'Bengaluru',routeKm:0,isMajor:true,tracks:10,railwayZone:'South Western Railway' },
  { id:'chennai',code:'MAS',name:'Chennai Central',latitude:13.0827,longitude:80.2707,zone:'Southern Railway',division:'Chennai',routeKm:0,isMajor:true,tracks:17,railwayZone:'Southern Railway',headquarters:true },
  { id:'coimbatore',code:'CBE',name:'Coimbatore',latitude:11.0168,longitude:76.9558,zone:'Southern Railway',division:'Salem',routeKm:0,isMajor:true,tracks:6,railwayZone:'Southern Railway' },
  { id:'kochi',code:'ERS',name:'Ernakulam Jn',latitude:9.9816,longitude:76.2999,zone:'Southern Railway',division:'Thiruvananthapuram',routeKm:0,isMajor:true,tracks:6,railwayZone:'Southern Railway' },
  { id:'madurai',code:'MDU',name:'Madurai',latitude:9.9252,longitude:78.1198,zone:'Southern Railway',division:'Madurai',routeKm:0,isMajor:true,tracks:6,railwayZone:'Southern Railway' },
  { id:'trivandrum',code:'TVC',name:'Thiruvananthapuram',latitude:8.5241,longitude:76.9366,zone:'Southern Railway',division:'Thiruvananthapuram',routeKm:0,isMajor:true,tracks:6,railwayZone:'Southern Railway' },
];

const INDIA_CORRIDORS: NetworkCorridor[] = [
  ['ndls','amb','Northern Railway','VERY_HIGH'],['amb','ludh','Northern Railway','HIGH'],['ludh','jammu','Northern Railway','MEDIUM'],
  ['ndls','jaipur','North Western Railway','HIGH'],['jaipur','ahm','Western Railway','HIGH'],['ahm','mumbai','Western Railway','VERY_HIGH'],
  ['mumbai','pune','Central Railway','VERY_HIGH'],['pune','bhusawal','Central Railway','HIGH'],['bhusawal','ngp','Central Railway','VERY_HIGH'],
  ['mumbai','bhopal','West Central Railway','HIGH'],['bhopal','jabalpur','West Central Railway','HIGH'],['bhopal','kota','West Central Railway','HIGH'],
  ['ndls','agra','North Central Railway','VERY_HIGH'],['agra','kanpur','North Central Railway','VERY_HIGH'],['kanpur','prayagraj','North Central Railway','VERY_HIGH'],
  ['prayagraj','varanasi','East Central Railway','HIGH'],['varanasi','gorakhpur','North Eastern Railway','HIGH'],['prayagraj','patna','East Central Railway','HIGH'],
  ['patna','hajipur','East Central Railway','HIGH'],['hajipur','gorakhpur','North Eastern Railway','MEDIUM'],['patna','kolkata','Eastern Railway','VERY_HIGH'],
  ['kolkata','kharagpur','South Eastern Railway','VERY_HIGH'],['kharagpur','bhubaneswar','East Coast Railway','HIGH'],
  ['bhubaneswar','visakhapatnam','East Coast Railway','HIGH'],['kharagpur','ranchi','South Eastern Railway','HIGH'],
  ['ngp','raipur','South East Central Railway','VERY_HIGH'],['raipur','bilaspur','South East Central Railway','VERY_HIGH'],
  ['bilaspur','bhubaneswar','East Coast Railway','HIGH'],['ngp','secunderabad','South Central Railway','HIGH'],
  ['secunderabad','vijayawada','South Central Railway','VERY_HIGH'],['vijayawada','visakhapatnam','East Coast Railway','HIGH'],
  ['mumbai','goa','Konkan Railway','HIGH'],['goa','hubballi','South Western Railway','HIGH'],['hubballi','bengaluru','South Western Railway','HIGH'],
  ['bengaluru','chennai','Southern Railway','VERY_HIGH'],['chennai','coimbatore','Southern Railway','HIGH'],
  ['coimbatore','kochi','Southern Railway','HIGH'],['kochi','trivandrum','Southern Railway','HIGH'],
  ['coimbatore','madurai','Southern Railway','MEDIUM'],['madurai','trivandrum','Southern Railway','HIGH'],
  ['bengaluru','secunderabad','South Central Railway','HIGH'],['pune','secunderabad','South Central Railway','HIGH'],
].map(([from,to,zone,traffic],i)=>({id:`AI-${i+1}`,name:`${from.toUpperCase()} – ${to.toUpperCase()}`,zone,from,to,traffic:traffic as NetworkCorridor['traffic']}));

const ZONE_COLORS: Record<string,string> = {
  'Northern Railway':'#1769AA',
  'North Western Railway':'#7C3AED',
  'Western Railway':'#C2410C',
  'Central Railway':'#0F766E',
  'West Central Railway':'#B45309',
  'North Central Railway':'#2563EB',
  'North Eastern Railway':'#059669',
  'East Central Railway':'#D97706',
  'Eastern Railway':'#DB2777',
  'South Eastern Railway':'#9333EA',
  'East Coast Railway':'#0284C7',
  'South East Central Railway':'#65A30D',
  'South Central Railway':'#0891B2',
  'Konkan Railway':'#EA580C',
  'South Western Railway':'#16A34A',
  'Southern Railway':'#DC2626',
};

const MapReCenter = ({ viewScope }: { viewScope: 'PUNE' | 'ALL_INDIA' }) => {
  const map = useMap();
  React.useEffect(() => {
    if (viewScope === 'PUNE') map.flyTo([18.52,73.87],9,{duration:.7});
    else map.flyTo([22.5,79.5],5,{duration:.7});
  }, [viewScope,map]);
  return null;
};

const MapControls = () => {
  const map=useMap();
  return (
    <div className="absolute bottom-5 right-4 z-[400] flex flex-col gap-1 bg-white rounded-xl border border-rail-border shadow-lg overflow-hidden">
      <button className="p-2.5 hover:bg-slate-50 text-rail-secondary" onClick={()=>map.zoomIn()} aria-label="Zoom in"><ZoomIn className="w-4 h-4"/></button>
      <button className="p-2.5 hover:bg-slate-50 text-rail-secondary border-t border-rail-border" onClick={()=>map.zoomOut()} aria-label="Zoom out"><ZoomOut className="w-4 h-4"/></button>
      <button className="p-2.5 hover:bg-slate-50 text-rail-secondary border-t border-rail-border" onClick={()=>map.setView([22.5,79.5],5)} aria-label="Reset India view"><Maximize2 className="w-4 h-4"/></button>
    </div>
  );
};

export const PuneDivisionMapPage: React.FC<PuneDivisionMapPageProps> = ({ onNavigate }) => {
  const state=store.getState();
  const {stations,tasks,sections,blockPlans}=state;
  const [searchQuery,setSearchQuery]=useState('');
  const [viewScope,setViewScope]=useState<'PUNE'|'ALL_INDIA'>('ALL_INDIA');
  const [activeLayers,setActiveLayers]=useState({stations:true,corridors:true,defects:true,blocks:true});
  const [selectedStation,setSelectedStation]=useState<Station|null>(null);
  const [selectedSection,setSelectedSection]=useState<Section|null>(null);

  const indiaStations=useMemo(()=>INDIA_STATIONS.filter(s=>!searchQuery.trim() || `${s.name} ${s.code} ${s.railwayZone}`.toLowerCase().includes(searchQuery.toLowerCase())),[searchQuery]);
  const puneStations=stations.filter(s=>(s.division==='PUNE'||s.division==='Pune') && (!searchQuery.trim() || `${s.name} ${s.code}`.toLowerCase().includes(searchQuery.toLowerCase())));
  const visibleStations=viewScope==='ALL_INDIA'?indiaStations:puneStations;
  const visibleSections=viewScope==='PUNE'
    ? sections.filter(s=>!searchQuery.trim() || `${s.name} ${s.code}`.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const toggleLayer=(key:keyof typeof activeLayers)=>setActiveLayers(p=>({...p,[key]:!p[key]}));

  return (
    <div className="relative w-full h-[calc(100vh-60px)] bg-slate-100 overflow-hidden flex select-none">
      <div className="flex-1 h-full relative z-0">
        <MapContainer center={[22.5,79.5]} zoom={5} minZoom={4} maxZoom={12} style={{height:'100%',width:'100%'}} zoomControl={false} preferCanvas>
          <MapReCenter viewScope={viewScope}/>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            opacity={0.72}
            maxZoom={19}
          />
          
          {activeLayers.corridors && viewScope==='ALL_INDIA' && INDIA_CORRIDORS.map(c=>{
            const a=INDIA_STATIONS.find(s=>s.id===c.from),b=INDIA_STATIONS.find(s=>s.id===c.to);
            if(!a||!b)return null;
            const zoneColor=ZONE_COLORS[c.zone]||'#475569';
            return <Polyline key={c.id} positions={[[a.latitude,a.longitude],[b.latitude,b.longitude]]} pathOptions={{color:zoneColor,weight:c.traffic==='VERY_HIGH'?5:c.traffic==='HIGH'?4:3,opacity:.78,lineCap:'round'}}>
              <LeafletTooltip sticky><b>{a.name} – {b.name}</b><br/><span style={{fontSize:11}}>{c.zone} · {c.traffic.replace('_',' ')}</span></LeafletTooltip>
            </Polyline>;
          })}

          {activeLayers.corridors && viewScope==='PUNE' && visibleSections.map(sec=>{
            const from=stations.find(s=>s.id===sec.fromStationId),to=stations.find(s=>s.id===sec.toStationId);
            if(!from||!to)return null;
            const hasDefects=tasks.some(t=>t.sectionId===sec.id&&t.severity==='CRITICAL'&&t.status!=='COMPLETED');
            const hasBlock=activeLayers.blocks&&blockPlans.some(b=>b.sectionId===sec.id&&(b.status==='APPROVED'||b.status==='PUBLISHED'));
            const color=hasBlock?'#059669':hasDefects?'#B91C1C':sec.trafficDensity==='VERY_HIGH'?'#1769AA':'#0F766E';
            return <Polyline key={sec.id} positions={[[from.latitude,from.longitude],[to.latitude,to.longitude]]} pathOptions={{color,weight:hasDefects?6:4,opacity:.85,dashArray:sec.electrified?undefined:'6 4'}} eventHandlers={{click:()=>{setSelectedSection(sec);setSelectedStation(null);}}}>
              <LeafletTooltip sticky><b>{sec.name}</b> · {sec.lengthKm} km</LeafletTooltip>
            </Polyline>;
          })}

          {activeLayers.stations && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={35}>
              {visibleStations.map(stn=>{
                const isIndia=viewScope==='ALL_INDIA';
                return <Marker key={stn.id} position={[stn.latitude,stn.longitude]} icon={isIndia?(stn.isMajor?majorStationIcon:allIndiaStationIcon):(stn.isMajor?majorStationIcon:minorStationIcon)} eventHandlers={{click:()=>{setSelectedStation(stn);setSelectedSection(null);}}}>
                  <LeafletTooltip direction="top" offset={[0,-7]}><b>{stn.name} ({stn.code})</b><br/><span style={{fontSize:11}}>{stn.zone} · {stn.division} Division</span></LeafletTooltip>
                </Marker>;
              })}
            </MarkerClusterGroup>
          )}

          {activeLayers.defects && viewScope==='PUNE' && (
            <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
              {tasks.filter(t=>t.severity==='CRITICAL'&&t.status!=='COMPLETED').map(t=>{
                const sec=sections.find(s=>s.id===t.sectionId); if(!sec)return null;
                const a=stations.find(s=>s.id===sec.fromStationId),b=stations.find(s=>s.id===sec.toStationId); if(!a||!b)return null;
                const lat=(a.latitude+b.latitude)/2,lng=(a.longitude+b.longitude)/2;
                return <Marker key={t.id} position={[lat,lng]} icon={defectIcon} eventHandlers={{click:()=>{setSelectedSection(sec);setSelectedStation(null);}}}>
                  <LeafletTooltip direction="top"><b>CRITICAL · {t.taskCode}</b><br/><span style={{fontSize:11}}>{t.title.slice(0,65)}</span></LeafletTooltip>
                </Marker>;
              })}
            </MarkerClusterGroup>
          )}
          <MapControls/>
        </MapContainer>

        <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
          <div className="flex bg-white border border-rail-border rounded-xl p-1 shadow-lg">
            <button onClick={()=>setViewScope('ALL_INDIA')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewScope==='ALL_INDIA'?'bg-rail-teal text-white':'text-rail-secondary hover:bg-slate-50'}`}>All India</button>
            <button onClick={()=>setViewScope('PUNE')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewScope==='PUNE'?'bg-rail-teal text-white':'text-rail-secondary hover:bg-slate-50'}`}>Pune Division</button>
          </div>
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-muted"/>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={viewScope==='ALL_INDIA'?'Search station, zone, junction...':'Search station, section, task...'} className="w-full bg-white border border-rail-border rounded-xl pl-9 pr-3 py-2 text-xs text-rail-text focus:outline-none focus:border-rail-teal shadow-lg"/>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[400] bg-white border border-rail-border rounded-xl p-3 shadow-lg text-xs space-y-2 min-w-[190px]">
          <div className="font-bold text-rail-text mb-1 flex items-center gap-2"><MapPinned className="w-3.5 h-3.5 text-rail-teal"/> Map Layers</div>
          {(['stations','corridors','defects','blocks'] as const).map(layer=>(
            <label key={layer} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={activeLayers[layer]} onChange={()=>toggleLayer(layer)} className="accent-rail-teal"/>
              <span className="capitalize text-rail-secondary">{layer==='defects'?'Critical Defects':layer==='blocks'?'Approved Blocks':layer}</span>
            </label>
          ))}
        </div>

        {viewScope==='ALL_INDIA' && (
          <div className="absolute bottom-5 left-4 z-[400] bg-white border border-rail-border rounded-xl p-3 shadow-lg max-w-[290px]">
            <div className="font-bold text-xs text-rail-text mb-2 flex items-center gap-2"><TrainFront className="w-3.5 h-3.5 text-rail-teal"/> Indian Railways Network</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
              {Object.entries(ZONE_COLORS).slice(0,10).map(([zone,color])=><div key={zone} className="flex items-center gap-1.5 text-rail-secondary"><span className="w-5 h-1.5 rounded-full" style={{background:color}}/>{zone.replace(' Railway','')}</div>)}
            </div>
            <div className="mt-2 pt-2 border-t border-rail-border text-[10px] text-rail-muted">Schematic network view · representative operational geometry</div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-[400] px-2.5 py-1 rounded-lg bg-white/90 border border-rail-border text-[10px] text-rail-muted">
          {viewScope==='PUNE'?'Pune Division operational geometry':'All India railway network · representative geometry'} · Verify before operational use
        </div>
      </div>

      {(selectedStation||selectedSection) && (
        <div className="w-80 bg-white border-l border-rail-border h-full overflow-y-auto shadow-xl z-[500] flex flex-col">
          <div className="p-4 border-b border-rail-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-rail-teal uppercase tracking-wider font-bold">{selectedStation?'Station Details':'Corridor Section'}</span>
            <button onClick={()=>{setSelectedStation(null);setSelectedSection(null)}} className="p-1 rounded text-rail-muted hover:text-rail-coral"><X className="w-4 h-4"/></button>
          </div>
          <div className="p-4 flex-1">
            {selectedStation && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-rail-text">{selectedStation.name}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rail-teal/10 text-rail-teal border border-rail-teal/30">{selectedStation.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{selectedStation.zone}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-rail-secondary border border-rail-border">{selectedStation.division} Div</span>
                  </div>
                </div>
                <div className="rounded-xl bg-rail-bg border border-rail-border p-3 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-rail-muted">Running Lines</span><span className="font-mono font-bold">{selectedStation.tracks}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Route Km</span><span className="font-mono">{selectedStation.routeKm || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Type</span><span className={selectedStation.isMajor?'text-rail-teal font-bold':'text-rail-secondary'}>{selectedStation.isMajor?'Major Junction':'Station'}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Coordinates</span><span className="font-mono text-rail-secondary">{selectedStation.latitude.toFixed(4)}, {selectedStation.longitude.toFixed(4)}</span></div>
                </div>
                {viewScope==='ALL_INDIA' && 'railwayZone' in selectedStation && (
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs">
                    <p className="font-bold text-blue-900">Railway Zone</p>
                    <p className="text-blue-700 mt-1">{(selectedStation as NetworkStation).railwayZone}</p>
                    <p className="text-blue-600 mt-2">Network view is representative and intended for decision-support demonstration.</p>
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider mb-2">Nearby Tasks</h3>
                  {viewScope==='PUNE' && tasks.filter(t=>t.sectionId&&sections.find(s=>s.id===t.sectionId&&(s.fromStationId===selectedStation.id||s.toStationId===selectedStation.id))).slice(0,3).map(t=>(
                    <div key={t.id} className="p-2 rounded-lg bg-rail-bg border border-rail-border mb-1.5 text-xs"><span className="font-mono text-rail-cyan font-bold">{t.taskCode}</span><p className="text-rail-text truncate mt-0.5">{t.title}</p></div>
                  ))}
                  {viewScope==='ALL_INDIA' && <p className="text-xs text-rail-muted">Switch to Pune Division for detailed task-level overlays.</p>}
                </div>
              </div>
            )}

            {selectedSection && (
              <div className="space-y-4">
                <div><h2 className="text-sm font-bold text-rail-text">{selectedSection.name}</h2><span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rail-teal/10 text-rail-teal border border-rail-teal/30 inline-block mt-1.5">{selectedSection.code}</span></div>
                <div className="rounded-xl bg-rail-bg border border-rail-border p-3 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-rail-muted">Length</span><span className="font-mono font-bold">{selectedSection.lengthKm} km</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Lines</span><span className="font-mono">{selectedSection.lineCount}</span></div>
                  <div className="flex justify-between"><span className="text-rail-muted">Electrified</span><span className="text-rail-emerald font-bold">{selectedSection.electrified?'25kV AC':'No'}</span></div>
                </div>
                <h3 className="text-xs font-bold text-rail-text uppercase tracking-wider">Active Defects</h3>
                {tasks.filter(t=>t.sectionId===selectedSection.id&&t.status!=='COMPLETED').slice(0,4).map(t=><div key={t.id} className="p-2 rounded-lg bg-red-50 border border-red-200 mb-1.5 text-xs"><span className="font-mono font-bold text-rail-coral">{t.taskCode}</span><p className="text-rail-text truncate mt-0.5">{t.title}</p></div>)}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-rail-border">
            <button onClick={()=>onNavigate('/blocks/planning')} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs shadow transition-colors"><Cpu className="w-4 h-4"/>Open in Planning Workspace</button>
          </div>
        </div>
      )}
    </div>
  );
};
