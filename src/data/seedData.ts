import { 
  User, Station, Section, Asset, MaintenanceTask, MaintenanceRequest, 
  CorridorWindow, TimetableEntry, WeatherForecast, BlockPlan, Notification, AuditLog 
} from '../types/railway';

// ==========================================
// 1. DEMO USERS (6 PERSONAS)
// ==========================================
export const SEED_USERS: User[] = [
  {
    id: 'user-ctrl-01',
    name: 'Rajesh Sharma',
    email: 'control@railkushal.demo',
    role: 'CONTROL_OFFICE',
    department: 'OPERATING',
    designation: 'Chief Train Controller (Planning), Pune Division',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-eng-01',
    name: 'Vikas Deshmukh',
    email: 'engineering@railkushal.demo',
    role: 'ENGINEERING',
    department: 'ENGINEERING',
    designation: 'Senior Section Engineer (Permanent Way), Chinchwad',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-trd-01',
    name: 'Amitabh Sen',
    email: 'trd@railkushal.demo',
    role: 'TRD',
    department: 'TRD',
    designation: 'Divisional Electrical Engineer (TRD), Pune',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-snt-01',
    name: 'Pooja Kulkarni',
    email: 'signals@railkushal.demo',
    role: 'S_AND_T',
    department: 'S_AND_T',
    designation: 'Senior Section Engineer (Signalling & Telecom)',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-rev-01',
    name: 'Dr. Anand Verma',
    email: 'reviewer@railkushal.demo',
    role: 'SENIOR_REVIEWER',
    department: 'OPERATING',
    designation: 'Additional Divisional Railway Manager (ADRM), Pune',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-adm-01',
    name: 'Sunita Patil',
    email: 'admin@railkushal.demo',
    role: 'ADMIN',
    department: 'SAFETY',
    designation: 'Principal Systems Administrator, CRIS/Central Railway',
    active: true,
    createdAt: '2026-01-15T08:00:00Z'
  }
];

// ==========================================
// 2. 28 PUNE DIVISION STATIONS
// ==========================================
export const SEED_STATIONS: Station[] = [
  { id: 'stn-pune', code: 'PUNE', name: 'Pune Junction', latitude: 18.5289, longitude: 73.8744, division: 'Pune', routeKm: 0.0, isMajor: true, tracks: 6 },
  { id: 'stn-svjr', code: 'SVJR', name: 'Shivajinagar', latitude: 18.5323, longitude: 73.8517, division: 'Pune', routeKm: 2.5, isMajor: true, tracks: 4 },
  { id: 'stn-kk', code: 'KK', name: 'Khadki', latitude: 18.5636, longitude: 73.8347, division: 'Pune', routeKm: 6.2, isMajor: false, tracks: 4 },
  { id: 'stn-dapd', code: 'DAPD', name: 'Dapodi', latitude: 18.5794, longitude: 73.8242, division: 'Pune', routeKm: 8.1, isMajor: false, tracks: 3 },
  { id: 'stn-kswd', code: 'KSWD', name: 'Kasarwadi', latitude: 18.5991, longitude: 73.8164, division: 'Pune', routeKm: 11.4, isMajor: false, tracks: 3 },
  { id: 'stn-pmp', code: 'PMP', name: 'Pimpri', latitude: 18.6234, longitude: 73.8012, division: 'Pune', routeKm: 14.2, isMajor: true, tracks: 4 },
  { id: 'stn-cch', code: 'CCH', name: 'Chinchwad', latitude: 18.6367, longitude: 73.7885, division: 'Pune', routeKm: 16.5, isMajor: true, tracks: 4 },
  { id: 'stn-akrd', code: 'AKRD', name: 'Akurdi', latitude: 18.6521, longitude: 73.7663, division: 'Pune', routeKm: 19.8, isMajor: false, tracks: 3 },
  { id: 'stn-dehr', code: 'DEHR', name: 'Dehu Road', latitude: 18.6806, longitude: 73.7314, division: 'Pune', routeKm: 24.6, isMajor: true, tracks: 4 },
  { id: 'stn-bgwi', code: 'BGWI', name: 'Begdewadi', latitude: 18.7011, longitude: 73.7122, division: 'Pune', routeKm: 28.0, isMajor: false, tracks: 2 },
  { id: 'stn-grwd', code: 'GRWD', name: 'Ghorawadi', latitude: 18.7153, longitude: 73.6961, division: 'Pune', routeKm: 31.2, isMajor: false, tracks: 2 },
  { id: 'stn-tgn', code: 'TGN', name: 'Talegaon', latitude: 18.7308, longitude: 73.6769, division: 'Pune', routeKm: 34.1, isMajor: true, tracks: 4 },
  { id: 'stn-vdn', code: 'VDN', name: 'Vadgaon', latitude: 18.7492, longitude: 73.6492, division: 'Pune', routeKm: 38.0, isMajor: false, tracks: 2 },
  { id: 'stn-knhe', code: 'KNHE', name: 'Kanhe', latitude: 18.7617, longitude: 73.6183, division: 'Pune', routeKm: 42.4, isMajor: false, tracks: 2 },
  { id: 'stn-kmst', code: 'KMST', name: 'Kamshet', latitude: 18.7594, longitude: 73.5619, division: 'Pune', routeKm: 47.6, isMajor: false, tracks: 3 },
  { id: 'stn-mvl', code: 'MVL', name: 'Malavli', latitude: 18.7497, longitude: 73.4739, division: 'Pune', routeKm: 55.8, isMajor: false, tracks: 3 },
  { id: 'stn-lnl', code: 'LNL', name: 'Lonavala', latitude: 18.7519, longitude: 73.4074, division: 'Pune', routeKm: 63.7, isMajor: true, tracks: 5 },
  // Daund Corridor
  { id: 'stn-hdp', code: 'HDP', name: 'Hadapsar', latitude: 18.5133, longitude: 73.9292, division: 'Pune', routeKm: 6.0, isMajor: true, tracks: 4 },
  { id: 'stn-gpr', code: 'GPR', name: 'Ghorpuri', latitude: 18.5217, longitude: 73.8967, division: 'Pune', routeKm: 2.8, isMajor: false, tracks: 3 },
  { id: 'stn-uri', code: 'URI', name: 'Uruli', latitude: 18.4789, longitude: 74.1283, division: 'Pune', routeKm: 29.0, isMajor: false, tracks: 3 },
  { id: 'stn-dd', code: 'DD', name: 'Daund Junction', latitude: 18.4658, longitude: 74.5828, division: 'Pune', routeKm: 76.0, isMajor: true, tracks: 6 },
  // Miraj/Kolhapur Corridor
  { id: 'stn-jjr', code: 'JJR', name: 'Jejuri', latitude: 18.2789, longitude: 74.1561, division: 'Pune', routeKm: 58.0, isMajor: false, tracks: 3 },
  { id: 'stn-str', code: 'STR', name: 'Satara', latitude: 17.6805, longitude: 74.0183, division: 'Pune', routeKm: 145.0, isMajor: true, tracks: 4 },
  { id: 'stn-krg', code: 'KRG', name: 'Karad', latitude: 17.2894, longitude: 74.2008, division: 'Pune', routeKm: 204.0, isMajor: true, tracks: 3 },
  { id: 'stn-sli', code: 'SLI', name: 'Sangli', latitude: 16.8524, longitude: 74.5815, division: 'Pune', routeKm: 272.0, isMajor: true, tracks: 3 },
  { id: 'stn-mrj', code: 'MRJ', name: 'Miraj Junction', latitude: 16.8281, longitude: 74.6469, division: 'Pune', routeKm: 280.0, isMajor: true, tracks: 5 },
  { id: 'stn-kop', code: 'KOP', name: 'Chhatrapati Shahu Maharaj Terminus (Kolhapur)', latitude: 16.6956, longitude: 74.2317, division: 'Pune', routeKm: 327.0, isMajor: true, tracks: 4 },
  // Baramati Branch
  { id: 'stn-bma', code: 'BMA', name: 'Baramati', latitude: 18.1517, longitude: 74.5772, division: 'Pune', routeKm: 118.0, isMajor: true, tracks: 3 },
];

// ==========================================
// 3. 21 CONNECTED SECTIONS
// ==========================================
export const SEED_SECTIONS: Section[] = [
  // Pune - Lonavala Trunk Corridor
  {
    id: 'sec-pune-svjr',
    code: 'PUNE-SVJR',
    name: 'Pune–Shivajinagar',
    fromStationId: 'stn-pune',
    toStationId: 'stn-svjr',
    lengthKm: 2.5,
    lineCount: 4,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.5289, 73.8744], [18.5305, 73.8630], [18.5323, 73.8517]]
  },
  {
    id: 'sec-svjr-kk',
    code: 'SVJR-KK',
    name: 'Shivajinagar–Khadki',
    fromStationId: 'stn-svjr',
    toStationId: 'stn-kk',
    lengthKm: 3.7,
    lineCount: 4,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.5323, 73.8517], [18.5480, 73.8430], [18.5636, 73.8347]]
  },
  {
    id: 'sec-kk-dapd',
    code: 'KK-DAPD',
    name: 'Khadki–Dapodi',
    fromStationId: 'stn-kk',
    toStationId: 'stn-dapd',
    lengthKm: 1.9,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.5636, 73.8347], [18.5715, 73.8295], [18.5794, 73.8242]]
  },
  {
    id: 'sec-dapd-kswd',
    code: 'DAPD-KSWD',
    name: 'Dapodi–Kasarwadi',
    fromStationId: 'stn-dapd',
    toStationId: 'stn-kswd',
    lengthKm: 3.3,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.5794, 73.8242], [18.5892, 73.8203], [18.5991, 73.8164]]
  },
  {
    id: 'sec-kswd-pmp',
    code: 'KSWD-PMP',
    name: 'Kasarwadi–Pimpri',
    fromStationId: 'stn-kswd',
    toStationId: 'stn-pmp',
    lengthKm: 2.8,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.5991, 73.8164], [18.6112, 73.8088], [18.6234, 73.8012]]
  },
  {
    id: 'sec-pmp-cch',
    code: 'PMP-CCH',
    name: 'Pimpri–Chinchwad',
    fromStationId: 'stn-pmp',
    toStationId: 'stn-cch',
    lengthKm: 2.3,
    lineCount: 4,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.6234, 73.8012], [18.6300, 73.7948], [18.6367, 73.7885]]
  },
  {
    id: 'sec-cch-akrd',
    code: 'CCH-AKRD',
    name: 'Chinchwad–Akurdi',
    fromStationId: 'stn-cch',
    toStationId: 'stn-akrd',
    lengthKm: 3.3,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.6367, 73.7885], [18.6444, 73.7774], [18.6521, 73.7663]]
  },
  {
    id: 'sec-akrd-dehr',
    code: 'AKRD-DEHR',
    name: 'Akurdi–Dehu Road',
    fromStationId: 'stn-akrd',
    toStationId: 'stn-dehr',
    lengthKm: 4.8,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.6521, 73.7663], [18.6663, 73.7488], [18.6806, 73.7314]]
  },
  {
    id: 'sec-dehr-bgwi',
    code: 'DEHR-BGWI',
    name: 'Dehu Road–Begdewadi',
    fromStationId: 'stn-dehr',
    toStationId: 'stn-bgwi',
    lengthKm: 3.4,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.6806, 73.7314], [18.6908, 73.7218], [18.7011, 73.7122]]
  },
  {
    id: 'sec-bgwi-grwd',
    code: 'BGWI-GRWD',
    name: 'Begdewadi–Ghorawadi',
    fromStationId: 'stn-bgwi',
    toStationId: 'stn-grwd',
    lengthKm: 3.2,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.7011, 73.7122], [18.7082, 73.7041], [18.7153, 73.6961]]
  },
  {
    id: 'sec-grwd-tgn',
    code: 'GRWD-TGN',
    name: 'Ghorawadi–Talegaon',
    fromStationId: 'stn-grwd',
    toStationId: 'stn-tgn',
    lengthKm: 2.9,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.7153, 73.6961], [18.7230, 73.6865], [18.7308, 73.6769]]
  },
  {
    id: 'sec-tgn-vdn',
    code: 'TGN-VDN',
    name: 'Talegaon–Vadgaon',
    fromStationId: 'stn-tgn',
    toStationId: 'stn-vdn',
    lengthKm: 3.9,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.7308, 73.6769], [18.7400, 73.6630], [18.7492, 73.6492]]
  },
  {
    id: 'sec-vdn-knhe',
    code: 'VDN-KNHE',
    name: 'Vadgaon–Kanhe',
    fromStationId: 'stn-vdn',
    toStationId: 'stn-knhe',
    lengthKm: 4.4,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.7492, 73.6492], [18.7554, 73.6337], [18.7617, 73.6183]]
  },
  {
    id: 'sec-knhe-kmst',
    code: 'KNHE-KMST',
    name: 'Kanhe–Kamshet',
    fromStationId: 'stn-knhe',
    toStationId: 'stn-kmst',
    lengthKm: 5.2,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.7617, 73.6183], [18.7605, 73.5901], [18.7594, 73.5619]]
  },
  {
    id: 'sec-kmst-mvl',
    code: 'KMST-MVL',
    name: 'Kamshet–Malavli',
    fromStationId: 'stn-kmst',
    toStationId: 'stn-mvl',
    lengthKm: 8.2,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.7594, 73.5619], [18.7545, 73.5179], [18.7497, 73.4739]]
  },
  {
    id: 'sec-mvl-lnl',
    code: 'MVL-LNL',
    name: 'Malavli–Lonavala',
    fromStationId: 'stn-mvl',
    toStationId: 'stn-lnl',
    lengthKm: 7.9,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.7497, 73.4739], [18.7508, 73.4406], [18.7519, 73.4074]]
  },
  // Pune - Daund Corridor
  {
    id: 'sec-pune-hdp',
    code: 'PUNE-HDP',
    name: 'Pune–Hadapsar',
    fromStationId: 'stn-pune',
    toStationId: 'stn-hdp',
    lengthKm: 6.0,
    lineCount: 3,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.5289, 73.8744], [18.5211, 73.9018], [18.5133, 73.9292]]
  },
  {
    id: 'sec-hdp-uri',
    code: 'HDP-URI',
    name: 'Hadapsar–Uruli',
    fromStationId: 'stn-hdp',
    toStationId: 'stn-uri',
    lengthKm: 23.0,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'HIGH',
    coordinates: [[18.5133, 73.9292], [18.4961, 74.0287], [18.4789, 74.1283]]
  },
  {
    id: 'sec-uri-dd',
    code: 'URI-DD',
    name: 'Uruli–Daund',
    fromStationId: 'stn-uri',
    toStationId: 'stn-dd',
    lengthKm: 47.0,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'VERY_HIGH',
    coordinates: [[18.4789, 74.1283], [18.4723, 74.3555], [18.4658, 74.5828]]
  },
  // Pune - Satara - Miraj Corridor
  {
    id: 'sec-pune-jjr',
    code: 'PUNE-JJR',
    name: 'Pune–Jejuri',
    fromStationId: 'stn-pune',
    toStationId: 'stn-jjr',
    lengthKm: 58.0,
    lineCount: 2,
    electrified: true,
    trafficDensity: 'MEDIUM',
    coordinates: [[18.5289, 73.8744], [18.4041, 74.0152], [18.2789, 74.1561]]
  },
  {
    id: 'sec-jjr-str',
    code: 'JJR-STR',
    name: 'Jejuri–Satara',
    fromStationId: 'stn-jjr',
    toStationId: 'stn-str',
    lengthKm: 87.0,
    lineCount: 1,
    electrified: true,
    trafficDensity: 'MEDIUM',
    coordinates: [[18.2789, 74.1561], [17.9797, 74.0872], [17.6805, 74.0183]]
  }
];

// ==========================================
// 4. 75+ ASSETS
// ==========================================
export const SEED_ASSETS: Asset[] = [
  // Engineering Assets (Track, Points, Welds, Bridges)
  { id: 'ast-eng-001', assetCode: 'TRK-PMP-CCH-DN-KM15', department: 'ENGINEERING', assetType: 'RAIL', sectionId: 'sec-pmp-cch', chainageKm: 15.2, conditionScore: 48, installYear: 2017, lastInspectionDate: '2026-08-10', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-eng-002', assetCode: 'PNT-CCH-102B', department: 'ENGINEERING', assetType: 'TURNOUT', sectionId: 'sec-cch-akrd', stationId: 'stn-cch', chainageKm: 16.8, conditionScore: 54, installYear: 2019, lastInspectionDate: '2026-08-25', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-eng-003', assetCode: 'WLD-SVJR-KK-UP-KM4', department: 'ENGINEERING', assetType: 'WELD', sectionId: 'sec-svjr-kk', chainageKm: 4.1, conditionScore: 62, installYear: 2020, lastInspectionDate: '2026-09-02', availabilityRisk: 'MEDIUM', status: 'DEGRADED' },
  { id: 'ast-eng-004', assetCode: 'SLP-GRWD-TGN-DN-KM32', department: 'ENGINEERING', assetType: 'SLEEPER', sectionId: 'sec-grwd-tgn', chainageKm: 32.4, conditionScore: 58, installYear: 2016, lastInspectionDate: '2026-08-14', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-eng-005', assetCode: 'BLS-KMST-MVL-KM51', department: 'ENGINEERING', assetType: 'BALLAST', sectionId: 'sec-kmst-mvl', chainageKm: 51.0, conditionScore: 42, installYear: 2015, lastInspectionDate: '2026-07-30', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-eng-006', assetCode: 'BRG-PUNE-HDP-BR24', department: 'ENGINEERING', assetType: 'BRIDGE', sectionId: 'sec-pune-hdp', chainageKm: 3.8, conditionScore: 71, installYear: 2011, lastInspectionDate: '2026-09-05', availabilityRisk: 'MEDIUM', status: 'OPERATIONAL' },
  { id: 'ast-eng-007', assetCode: 'TRK-DEHR-BGWI-UP-KM26', department: 'ENGINEERING', assetType: 'RAIL', sectionId: 'sec-dehr-bgwi', chainageKm: 26.2, conditionScore: 65, installYear: 2018, lastInspectionDate: '2026-08-18', availabilityRisk: 'MEDIUM', status: 'DEGRADED' },
  { id: 'ast-eng-008', assetCode: 'PNT-TGN-204A', department: 'ENGINEERING', assetType: 'TURNOUT', sectionId: 'sec-grwd-tgn', stationId: 'stn-tgn', chainageKm: 34.0, conditionScore: 51, installYear: 2017, lastInspectionDate: '2026-08-28', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-eng-009', assetCode: 'TRK-MVL-LNL-UP-KM60', department: 'ENGINEERING', assetType: 'RAIL', sectionId: 'sec-mvl-lnl', chainageKm: 60.5, conditionScore: 39, installYear: 2014, lastInspectionDate: '2026-07-22', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-eng-010', assetCode: 'WLD-HDP-URI-DN-KM14', department: 'ENGINEERING', assetType: 'WELD', sectionId: 'sec-hdp-uri', chainageKm: 14.7, conditionScore: 68, installYear: 2021, lastInspectionDate: '2026-09-01', availabilityRisk: 'LOW', status: 'OPERATIONAL' },
  // TRD Assets (OHE, Masts, Insulators, Isolators, TSS)
  { id: 'ast-trd-001', assetCode: 'OHE-CCH-TGN-SPAN-88', department: 'TRD', assetType: 'OHE_CANTILEVER', sectionId: 'sec-cch-akrd', chainageKm: 17.4, conditionScore: 44, installYear: 2016, lastInspectionDate: '2026-08-04', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-trd-002', assetCode: 'INS-TGN-VDN-MAST-14', department: 'TRD', assetType: 'INSULATOR', sectionId: 'sec-tgn-vdn', chainageKm: 35.8, conditionScore: 52, installYear: 2018, lastInspectionDate: '2026-08-21', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-trd-003', assetCode: 'ISO-TGN-SUBSTN-SW3', department: 'TRD', assetType: 'ISOLATOR', sectionId: 'sec-grwd-tgn', stationId: 'stn-tgn', chainageKm: 34.2, conditionScore: 59, installYear: 2017, lastInspectionDate: '2026-08-15', availabilityRisk: 'MEDIUM', status: 'DEGRADED' },
  { id: 'ast-trd-004', assetCode: 'TSS-LNL-25KV-SUB1', department: 'TRD', assetType: 'TRACTION_SUBSTATION', sectionId: 'sec-mvl-lnl', stationId: 'stn-lnl', chainageKm: 63.5, conditionScore: 78, installYear: 2019, lastInspectionDate: '2026-09-08', availabilityRisk: 'LOW', status: 'OPERATIONAL' },
  { id: 'ast-trd-005', assetCode: 'MST-SVJR-KK-UP-MST22', department: 'TRD', assetType: 'MAST', sectionId: 'sec-svjr-kk', chainageKm: 4.8, conditionScore: 49, installYear: 2013, lastInspectionDate: '2026-07-19', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-trd-006', assetCode: 'OHE-KK-DAPD-FEEDER-2', department: 'TRD', assetType: 'FEEDER_WIRE', sectionId: 'sec-kk-dapd', chainageKm: 7.3, conditionScore: 61, installYear: 2020, lastInspectionDate: '2026-08-29', availabilityRisk: 'MEDIUM', status: 'DEGRADED' },
  { id: 'ast-trd-007', assetCode: 'INS-PMP-CCH-ISL-9', department: 'TRD', assetType: 'INSULATOR', sectionId: 'sec-pmp-cch', chainageKm: 15.6, conditionScore: 47, installYear: 2015, lastInspectionDate: '2026-08-01', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-trd-008', assetCode: 'TWR-WGN-PUNE-01', department: 'TRD', assetType: 'TOWER_WAGON', sectionId: 'sec-pune-svjr', stationId: 'stn-pune', chainageKm: 1.0, conditionScore: 85, installYear: 2022, lastInspectionDate: '2026-09-12', availabilityRisk: 'LOW', status: 'OPERATIONAL' },
  // S&T Assets (Signals, Axle Counters, Point Machines, Interlocking)
  { id: 'ast-snt-001', assetCode: 'AXC-CCH-AKRD-DP-03', department: 'S_AND_T', assetType: 'AXLE_COUNTER', sectionId: 'sec-cch-akrd', chainageKm: 18.1, conditionScore: 46, installYear: 2019, lastInspectionDate: '2026-08-05', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-snt-002', assetCode: 'SIG-SVJR-S14-HOME', department: 'S_AND_T', assetType: 'SIGNAL_ASPECT', sectionId: 'sec-pune-svjr', stationId: 'stn-svjr', chainageKm: 2.3, conditionScore: 63, installYear: 2021, lastInspectionDate: '2026-09-03', availabilityRisk: 'MEDIUM', status: 'DEGRADED' },
  { id: 'ast-snt-003', assetCode: 'PNT-MCH-TGN-110A', department: 'S_AND_T', assetType: 'POINT_MACHINE', sectionId: 'sec-grwd-tgn', stationId: 'stn-tgn', chainageKm: 33.8, conditionScore: 50, installYear: 2017, lastInspectionDate: '2026-08-19', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-snt-004', assetCode: 'CBL-SVJR-KK-OFC-KM5', department: 'S_AND_T', assetType: 'OFC_CABLE', sectionId: 'sec-svjr-kk', chainageKm: 5.1, conditionScore: 41, installYear: 2015, lastInspectionDate: '2026-07-28', availabilityRisk: 'CRITICAL', status: 'CRITICAL_ATTENTION' },
  { id: 'ast-snt-005', assetCode: 'RLY-CCH-INT-ROOM-1', department: 'S_AND_T', assetType: 'RELAY_INTERLOCKING', sectionId: 'sec-pmp-cch', stationId: 'stn-cch', chainageKm: 16.5, conditionScore: 72, installYear: 2020, lastInspectionDate: '2026-09-06', availabilityRisk: 'LOW', status: 'OPERATIONAL' },
  { id: 'ast-snt-006', assetCode: 'LCG-DEHR-KM23-GATE', department: 'S_AND_T', assetType: 'LEVEL_CROSSING_GATE', sectionId: 'sec-akrd-dehr', chainageKm: 23.2, conditionScore: 55, installYear: 2016, lastInspectionDate: '2026-08-22', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' },
  { id: 'ast-snt-007', assetCode: 'AXC-KMST-MVL-DP-08', department: 'S_AND_T', assetType: 'AXLE_COUNTER', sectionId: 'sec-kmst-mvl', chainageKm: 52.3, conditionScore: 53, installYear: 2018, lastInspectionDate: '2026-08-16', availabilityRisk: 'HIGH', status: 'MAINTENANCE_REQUIRED' }
];

// Generate additional realistic assets across sections to surpass 75 total assets
const ADDITIONAL_ASSET_TYPES = [
  { type: 'RAIL' as const, dept: 'ENGINEERING' as const, prefix: 'TRK' },
  { type: 'TURNOUT' as const, dept: 'ENGINEERING' as const, prefix: 'PNT' },
  { type: 'WELD' as const, dept: 'ENGINEERING' as const, prefix: 'WLD' },
  { type: 'SLEEPER' as const, dept: 'ENGINEERING' as const, prefix: 'SLP' },
  { type: 'OHE_CANTILEVER' as const, dept: 'TRD' as const, prefix: 'OHE' },
  { type: 'INSULATOR' as const, dept: 'TRD' as const, prefix: 'INS' },
  { type: 'ISOLATOR' as const, dept: 'TRD' as const, prefix: 'ISO' },
  { type: 'MAST' as const, dept: 'TRD' as const, prefix: 'MST' },
  { type: 'AXLE_COUNTER' as const, dept: 'S_AND_T' as const, prefix: 'AXC' },
  { type: 'SIGNAL_ASPECT' as const, dept: 'S_AND_T' as const, prefix: 'SIG' },
  { type: 'POINT_MACHINE' as const, dept: 'S_AND_T' as const, prefix: 'PM' },
  { type: 'OFC_CABLE' as const, dept: 'S_AND_T' as const, prefix: 'CBL' }
];

SEED_SECTIONS.forEach((sec, sIdx) => {
  ADDITIONAL_ASSET_TYPES.forEach((at, aIdx) => {
    const assetId = `ast-${at.dept.toLowerCase().slice(0, 3)}-extra-${sIdx}-${aIdx}`;
    if (!SEED_ASSETS.some(a => a.id === assetId) && SEED_ASSETS.length < 85) {
      const cond = 40 + ((sIdx * 7 + aIdx * 13) % 55);
      SEED_ASSETS.push({
        id: assetId,
        assetCode: `${at.prefix}-${sec.code}-KM${Math.round(sec.lengthKm * ((aIdx + 1) / 13) * 10) / 10}`,
        department: at.dept,
        assetType: at.type,
        sectionId: sec.id,
        chainageKm: Math.round(sec.lengthKm * ((aIdx + 1) / 13) * 10) / 10,
        conditionScore: cond,
        installYear: 2012 + (sIdx % 10),
        lastInspectionDate: `2026-08-${10 + (aIdx % 18)}`,
        availabilityRisk: cond < 50 ? 'CRITICAL' : cond < 65 ? 'HIGH' : cond < 80 ? 'MEDIUM' : 'LOW',
        status: cond < 50 ? 'CRITICAL_ATTENTION' : cond < 65 ? 'MAINTENANCE_REQUIRED' : 'OPERATIONAL'
      });
    }
  });
});

// ==========================================
// 5. MAINTENANCE TASKS (150+ realistic tasks)
// ==========================================
export const SEED_TASKS: MaintenanceTask[] = [
  {
    id: 'task-eng-104',
    taskCode: 'ENG-104',
    sourceSystem: 'TMS',
    department: 'ENGINEERING',
    assetId: 'ast-eng-001',
    sectionId: 'sec-pmp-cch',
    title: 'Critical overdue track geometry & rail defect near Chinchwad–Talegaon corridor',
    description: 'Ultrasonic Flaw Detection (USFD) confirmed IMR (Immediate Removal) rail fracture risk on Down line Km 15.2. Gauge variation of +7mm with severe vertical wear. Track tamping machine and rail replacement gang mobilized.',
    defectType: 'IMR Rail Defect & Gauge Spread',
    severity: 'CRITICAL',
    safetyCriticality: 96,
    failureProbability: 88,
    urgency: 92,
    availabilityImpact: 85,
    overdueDays: 9,
    estimatedDurationMinutes: 180,
    setupMinutes: 25,
    restorationMinutes: 20,
    requiredBlockType: 'INTEGRATED',
    weatherSensitivity: 'RAIN_SENSITIVE',
    preferredStartDate: '2026-09-20T01:30:00Z',
    preferredEndDate: '2026-09-20T05:00:00Z',
    latestCompletionDate: '2026-09-22T23:59:59Z',
    dependencyNotes: 'Requires OHE power isolation if rail crane is deployed. Compatible with TRD-207 and SNT-305 bundling.',
    requiredCrew: 'P-Way Gang No. 4 (18 men) + USFD Team',
    requiredEquipment: 'DUOMATIC Track Tamping Machine + Rail Tensor + Rail Flash Butt Welder',
    status: 'IN_REVIEW',
    aiPriorityScore: 91.5,
    aiPriorityExplanation: 'High safety hazard (96/100) and overdue by 9 days. High failure probability on prime suburban corridor warrants immediate night integrated block.',
    engDetails: {
      trackComponent: '60kg 90UTS Continuous Welded Rail',
      defectClassification: 'IMR (Immediate Removal)',
      cautionOrderRequired: true,
      speedRestrictionKmph: 30
    }
  },
  {
    id: 'task-eng-121',
    taskCode: 'ENG-121',
    sourceSystem: 'TMS',
    department: 'ENGINEERING',
    assetId: 'ast-eng-002',
    sectionId: 'sec-cch-akrd',
    title: 'Points and crossing inspection & tongue rail replacement near Pimpri–Chinchwad',
    description: 'Turnout 102B switch rail burring and cracked stretcher bar identified during quarterly joint engineering inspection.',
    defectType: 'Turnout Switch Defect',
    severity: 'HIGH',
    safetyCriticality: 82,
    failureProbability: 74,
    urgency: 78,
    availabilityImpact: 80,
    overdueDays: 5,
    estimatedDurationMinutes: 150,
    setupMinutes: 20,
    restorationMinutes: 15,
    requiredBlockType: 'INTEGRATED',
    weatherSensitivity: 'NONE',
    preferredStartDate: '2026-09-20T02:00:00Z',
    preferredEndDate: '2026-09-20T04:45:00Z',
    latestCompletionDate: '2026-09-23T23:59:59Z',
    dependencyNotes: 'Requires S&T Point Machine disconnection simultaneously.',
    requiredCrew: 'P-Way Special Turnout Squad (12 men)',
    requiredEquipment: 'Portable Point Grinder + Mechanical Jacks',
    status: 'REQUEST_SUBMITTED',
    aiPriorityScore: 78.6,
    aiPriorityExplanation: 'Turnout switch defect impacts crossover moves into Chinchwad yard. Bundling with S&T Point Machine check recommended.',
    engDetails: {
      trackComponent: '1:12 PSC Turnout 60kg Curved Switch',
      defectClassification: 'Major Switch Wear',
      cautionOrderRequired: true,
      speedRestrictionKmph: 45
    }
  },
  {
    id: 'task-trd-207',
    taskCode: 'TRD-207',
    sourceSystem: 'TDMS',
    department: 'TRD',
    assetId: 'ast-trd-001',
    sectionId: 'sec-cch-akrd',
    title: 'OHE inspection & 25kV composite insulator replacement on Chinchwad–Talegaon',
    description: 'Thermo-vision scanning detected hotspot (94°C) on cantilever span 88 insulator clamp. Severe pollution deposit risk near industrial belt.',
    defectType: 'Thermal Hotspot & Insulator Flashover Risk',
    severity: 'CRITICAL',
    safetyCriticality: 92,
    failureProbability: 85,
    urgency: 88,
    availabilityImpact: 90,
    overdueDays: 7,
    estimatedDurationMinutes: 160,
    setupMinutes: 20,
    restorationMinutes: 15,
    requiredBlockType: 'POWER',
    weatherSensitivity: 'LIGHTNING_SENSITIVE',
    preferredStartDate: '2026-09-20T01:30:00Z',
    preferredEndDate: '2026-09-20T04:30:00Z',
    latestCompletionDate: '2026-09-22T23:59:59Z',
    dependencyNotes: 'Requires elementary section isolation CCH-TGN. Perfect candidate for shadow block with ENG-104.',
    requiredCrew: 'TRD OHE Depot Chinchwad (10 linesmen)',
    requiredEquipment: 'Self-Propelled 4-Wheeler Tower Wagon RU-8821 + Earth Rods',
    status: 'IN_REVIEW',
    aiPriorityScore: 89.2,
    aiPriorityExplanation: 'Flashover risk causes sudden tripping of 25kV substation. Ideal companion for integrated corridor block on Chinchwad–Akurdi.',
    trdDetails: {
      oheSpan: 'Span 88/12 to 88/16 Down Line',
      isolationPoint: 'Isolator ISO-CCH-14 & ISO-TGN-02',
      powerBlockType: 'SECTION',
      tpcPermitRequired: true
    }
  },
  {
    id: 'task-trd-218',
    taskCode: 'TRD-218',
    sourceSystem: 'TDMS',
    department: 'TRD',
    assetId: 'ast-trd-003',
    sectionId: 'sec-grwd-tgn',
    title: 'Isolator preventive maintenance & contact alignment near Talegaon yard',
    description: 'Annual scheduled maintenance of 25kV motorised gang-operated isolator switch SW3. Interlock calibration and auxiliary contact greasing.',
    defectType: 'Scheduled OHE Isolator Overhaul',
    severity: 'MEDIUM',
    safetyCriticality: 65,
    failureProbability: 55,
    urgency: 60,
    availabilityImpact: 70,
    overdueDays: 2,
    estimatedDurationMinutes: 120,
    setupMinutes: 15,
    restorationMinutes: 15,
    requiredBlockType: 'POWER',
    weatherSensitivity: 'LIGHTNING_SENSITIVE',
    preferredStartDate: '2026-09-21T01:45:00Z',
    preferredEndDate: '2026-09-21T04:00:00Z',
    latestCompletionDate: '2026-09-25T23:59:59Z',
    dependencyNotes: 'Power block required on Talegaon siding lines.',
    requiredCrew: 'TRD Maintenance Gang (6 men)',
    requiredEquipment: 'Tower Wagon Ladder Trolley + High Voltage Probe',
    status: 'ACCEPTED',
    aiPriorityScore: 63.8,
    aiPriorityExplanation: 'Routine preventive schedule with medium impact. Can be assigned to non-peak corridor window.',
    trdDetails: {
      oheSpan: 'Yard Mast Y-12 to Y-18',
      isolationPoint: 'Substation Feeder F-04',
      powerBlockType: 'ELEMENTARY',
      tpcPermitRequired: true
    }
  },
  {
    id: 'task-snt-305',
    taskCode: 'SNT-305',
    sourceSystem: 'SMMS',
    department: 'S_AND_T',
    assetId: 'ast-snt-001',
    sectionId: 'sec-cch-akrd',
    title: 'Dual Axle Counter detection head tuning & track clamp renewal near Chinchwad–Akurdi',
    description: 'Intermittent count dropouts logged in SMMS error logs under high humidity. Wheel detection sensor DP-03 requires recalibration and cable screening.',
    defectType: 'Axle Counter Intermittent Fault',
    severity: 'HIGH',
    safetyCriticality: 88,
    failureProbability: 79,
    urgency: 84,
    availabilityImpact: 85,
    overdueDays: 6,
    estimatedDurationMinutes: 120,
    setupMinutes: 15,
    restorationMinutes: 20,
    requiredBlockType: 'LINE',
    weatherSensitivity: 'RAIN_SENSITIVE',
    preferredStartDate: '2026-09-20T02:00:00Z',
    preferredEndDate: '2026-09-20T04:30:00Z',
    latestCompletionDate: '2026-09-23T23:59:59Z',
    dependencyNotes: 'Requires signal disconnection memo and joint testing with Control before restoring auto-signalling.',
    requiredCrew: 'S&T Signal Gang No. 2 (6 technicians)',
    requiredEquipment: 'High-Frequency Digital Oscilloscope + Axle Counter Calibrator Kit',
    status: 'IN_REVIEW',
    aiPriorityScore: 84.4,
    aiPriorityExplanation: 'Axle counter failure forces manual paper authority (T/A 912), adding 20+ minutes delay per train. Bundling with ENG-104 highly beneficial.',
    sntDetails: {
      gearCategory: 'Dual Detection Axle Counter (DAC)',
      interlockingDisconnectionRequired: true,
      testingProtocol: 'Joint Wheel Simulation Test 10-Pass Protocol',
      commissioningOfficer: 'SSE/Signal/Chinchwad'
    }
  },
  {
    id: 'task-snt-319',
    taskCode: 'SNT-319',
    sourceSystem: 'SMMS',
    department: 'S_AND_T',
    assetId: 'ast-snt-004',
    sectionId: 'sec-svjr-kk',
    title: 'Signalling copper/OFC cable insulation degradation inspection near Shivajinagar–Khadki',
    description: 'Megger testing revealed low insulation resistance (0.8 Megohm vs standard 10 Megohm) on 24-core signalling cable feeding Shivajinagar Home signals.',
    defectType: 'Cable Insulation Drop & Earth Fault',
    severity: 'CRITICAL',
    safetyCriticality: 94,
    failureProbability: 82,
    urgency: 90,
    availabilityImpact: 88,
    overdueDays: 8,
    estimatedDurationMinutes: 180,
    setupMinutes: 25,
    restorationMinutes: 25,
    requiredBlockType: 'INTEGRATED',
    weatherSensitivity: 'RAIN_SENSITIVE',
    preferredStartDate: '2026-09-21T01:30:00Z',
    preferredEndDate: '2026-09-21T04:45:00Z',
    latestCompletionDate: '2026-09-23T23:59:59Z',
    dependencyNotes: 'Emergency cable jointing. Disconnection of Shivajinagar Down Auto signals required.',
    requiredCrew: 'Telecom & Signal Cable Splicing Unit (8 technicians)',
    requiredEquipment: 'OTDR Meter + Cable Fault Locator + Heat Shrink Jointing Kit',
    status: 'IN_REVIEW',
    aiPriorityScore: 89.8,
    aiPriorityExplanation: 'Immediate threat of red-aspect signal failures right outside Pune Jn approach. Severe bottleneck hazard.',
    sntDetails: {
      gearCategory: '24-Core Signalling Armoured Cable',
      interlockingDisconnectionRequired: true,
      testingProtocol: '500V Megger Insulation & Loop Resistance Verification',
      commissioningOfficer: 'ASTE/Pune'
    }
  }
];

// Generate 150+ realistic tasks dynamically across sections and departments
const TASK_TEMPLATES = [
  // Engineering templates
  { dept: 'ENGINEERING' as const, title: 'Ballast deep screening and track tamping', defect: 'Ballast Clogging & Poor Drainage', severity: 'HIGH' as const, block: 'INTEGRATED' as const, dur: 210, weather: 'RAIN_SENSITIVE' as const },
  { dept: 'ENGINEERING' as const, title: 'Ultrasonic flaw detection and rail weld replacement', defect: 'Defective Weld (DFWO)', severity: 'CRITICAL' as const, block: 'LINE' as const, dur: 150, weather: 'NONE' as const },
  { dept: 'ENGINEERING' as const, title: 'Track geometry alignment on high-speed curve', defect: 'Cross Level Variation', severity: 'MEDIUM' as const, block: 'LINE' as const, dur: 140, weather: 'NONE' as const },
  { dept: 'ENGINEERING' as const, title: 'Pre-stressed concrete sleeper renewal and fastening replacement', defect: 'Fatigued Rubber Pads & Broken Insulators', severity: 'MEDIUM' as const, block: 'LINE' as const, dur: 160, weather: 'NONE' as const },
  { dept: 'ENGINEERING' as const, title: 'Major girder bridge expansion joint inspection', defect: 'Rocker Bearing Friction & Bed Block Crack', severity: 'HIGH' as const, block: 'INTEGRATED' as const, dur: 180, weather: 'WIND_SENSITIVE' as const },
  // TRD templates
  { dept: 'TRD' as const, title: 'OHE contact wire wear measurement and dropper adjustment', defect: 'Excessive Contact Wire Wear (>30%)', severity: 'HIGH' as const, block: 'POWER' as const, dur: 150, weather: 'LIGHTNING_SENSITIVE' as const },
  { dept: 'TRD' as const, title: 'Section insulator replacement and height-stagger regulation', defect: 'Chipped Ceramic Insulator Core', severity: 'CRITICAL' as const, block: 'POWER' as const, dur: 160, weather: 'LIGHTNING_SENSITIVE' as const },
  { dept: 'TRD' as const, title: 'Mast bonding and earth resistance testing', defect: 'Severed Earth Bond Wire', severity: 'MEDIUM' as const, block: 'POWER' as const, dur: 110, weather: 'RAIN_SENSITIVE' as const },
  { dept: 'TRD' as const, title: 'Tree trimming along 25kV traction line clearance zone', defect: 'Foliage Encroaching Electrical Clearance', severity: 'MEDIUM' as const, block: 'POWER' as const, dur: 120, weather: 'WIND_SENSITIVE' as const },
  { dept: 'TRD' as const, title: 'Traction substation breaker maintenance and oil testing', defect: 'SF6 Gas Pressure Alarm & Dielectric Breakdown', severity: 'CRITICAL' as const, block: 'POWER' as const, dur: 190, weather: 'LIGHTNING_SENSITIVE' as const },
  // S&T templates
  { dept: 'S_AND_T' as const, title: 'Electric point machine overhaul and friction clutch setting', defect: 'Point Machine Detection Gap > 3.5mm', severity: 'HIGH' as const, block: 'LINE' as const, dur: 130, weather: 'NONE' as const },
  { dept: 'S_AND_T' as const, title: 'LED signal aspect voltage stabilization and current regulator testing', defect: 'Aspect Illuminance Degradation', severity: 'LOW' as const, block: 'SHADOW' as const, dur: 90, weather: 'NONE' as const },
  { dept: 'S_AND_T' as const, title: 'Solid State Interlocking (SSI) card diagnostic and standby changeover test', defect: 'VDU Redundant Communication Failure', severity: 'HIGH' as const, block: 'LINE' as const, dur: 120, weather: 'NONE' as const },
  { dept: 'S_AND_T' as const, title: 'Track circuit bonding and relay pick-up voltage calibration', defect: 'Rust Film Induced False Occupancy', severity: 'MEDIUM' as const, block: 'LINE' as const, dur: 110, weather: 'RAIN_SENSITIVE' as const },
  { dept: 'S_AND_T' as const, title: 'Level crossing boom barrier interlocking and sensor testing', defect: 'Barrier Closing Time Latch Lag', severity: 'HIGH' as const, block: 'LINE' as const, dur: 100, weather: 'NONE' as const }
];

let taskCounter = 10;
SEED_SECTIONS.forEach((sec, sIdx) => {
  TASK_TEMPLATES.forEach((tmpl, tIdx) => {
    taskCounter++;
    const taskId = `task-${tmpl.dept.toLowerCase().slice(0, 3)}-${taskCounter}`;
    const code = `${tmpl.dept.slice(0, 3)}-${taskCounter}`;
    const matchedAsset = SEED_ASSETS.find(a => a.sectionId === sec.id && a.department === tmpl.dept) || SEED_ASSETS[0];
    
    // Vary scores realistically
    const safety = tmpl.severity === 'CRITICAL' ? 88 + (taskCounter % 11) : tmpl.severity === 'HIGH' ? 72 + (taskCounter % 15) : 50 + (taskCounter % 20);
    const failureProb = 45 + ((sIdx * 9 + tIdx * 7) % 50);
    const urgency = 40 + ((sIdx * 11 + tIdx * 13) % 55);
    const availImpact = 45 + ((sIdx * 13 + tIdx * 5) % 50);
    const overdue = (taskCounter % 7 === 0) ? 6 + (taskCounter % 9) : (taskCounter % 4 === 0) ? 1 + (taskCounter % 4) : 0;
    const weatherExp = tmpl.weather !== 'NONE' ? 65 : 20;

    const aiScore = Math.round((0.30 * safety + 0.20 * failureProb + 0.15 * urgency + 0.15 * availImpact + 0.10 * (overdue > 0 ? Math.min(100, overdue * 12) : 20) + 0.10 * weatherExp) * 10) / 10;
    
    const statuses: MaintenanceTask['status'][] = ['PENDING', 'REQUEST_SUBMITTED', 'IN_REVIEW', 'ACCEPTED', 'SCHEDULED', 'COMPLETED'];
    const assignedStatus = statuses[taskCounter % statuses.length];

    SEED_TASKS.push({
      id: taskId,
      taskCode: code,
      sourceSystem: tmpl.dept === 'ENGINEERING' ? 'TMS' : tmpl.dept === 'TRD' ? 'TDMS' : 'SMMS',
      department: tmpl.dept,
      assetId: matchedAsset.id,
      sectionId: sec.id,
      title: `${tmpl.title} (${sec.code})`,
      description: `${tmpl.defect} detected on ${sec.name} during routine corridor monitoring. Requires coordinated departmental execution.`,
      defectType: tmpl.defect,
      severity: tmpl.severity,
      safetyCriticality: safety,
      failureProbability: failureProb,
      urgency: urgency,
      availabilityImpact: availImpact,
      overdueDays: overdue,
      estimatedDurationMinutes: tmpl.dur,
      setupMinutes: 20,
      restorationMinutes: 15,
      requiredBlockType: tmpl.block,
      weatherSensitivity: tmpl.weather,
      preferredStartDate: `2026-09-${20 + (sIdx % 6)}T01:30:00Z`,
      preferredEndDate: `2026-09-${20 + (sIdx % 6)}T05:00:00Z`,
      latestCompletionDate: `2026-09-${26 + (sIdx % 4)}T23:59:59Z`,
      requiredCrew: `${tmpl.dept} Maintenance Unit ${sIdx + 1} (8 staff)`,
      requiredEquipment: tmpl.dept === 'TRD' ? 'Tower Wagon + Earth Sets' : tmpl.dept === 'ENGINEERING' ? 'Tamping Machine + Hydraulic Jacks' : 'Digital Signal Calibrator Kit',
      status: assignedStatus,
      aiPriorityScore: aiScore,
      aiPriorityExplanation: `Computed AI score ${aiScore}/100. Safety Criticality weighted at 30% (${safety}), Failure probability (${failureProb}). Overdue penalty: ${overdue} days.`
    });
  });
});

// ==========================================
// 6. 60+ MAINTENANCE REQUESTS
// ==========================================
export const SEED_REQUESTS: MaintenanceRequest[] = [];

// Seed deliberate initial requests
const INITIAL_REQUEST_SEEDS = [
  { taskId: 'task-eng-104', reqCode: 'REQ-ENG-2026-089', dept: 'ENGINEERING' as const, status: 'UNDER_REVIEW' as const, start: '2026-09-20T01:30:00Z', end: '2026-09-20T05:00:00Z', dur: 210 },
  { taskId: 'task-eng-121', reqCode: 'REQ-ENG-2026-094', dept: 'ENGINEERING' as const, status: 'SUBMITTED' as const, start: '2026-09-20T02:00:00Z', end: '2026-09-20T04:45:00Z', dur: 165 },
  { taskId: 'task-trd-207', reqCode: 'REQ-TRD-2026-042', dept: 'TRD' as const, status: 'UNDER_REVIEW' as const, start: '2026-09-20T01:30:00Z', end: '2026-09-20T04:30:00Z', dur: 180 },
  { taskId: 'task-trd-218', reqCode: 'REQ-TRD-2026-048', dept: 'TRD' as const, status: 'ACCEPTED' as const, start: '2026-09-21T01:45:00Z', end: '2026-09-21T04:00:00Z', dur: 135, reason: 'Approved for night window in coordination with Talegaon yard controller.' },
  { taskId: 'task-snt-305', reqCode: 'REQ-SNT-2026-056', dept: 'S_AND_T' as const, status: 'UNDER_REVIEW' as const, start: '2026-09-20T02:00:00Z', end: '2026-09-20T04:30:00Z', dur: 150 },
  { taskId: 'task-snt-319', reqCode: 'REQ-SNT-2026-061', dept: 'S_AND_T' as const, status: 'CLARIFICATION_REQUESTED' as const, start: '2026-09-21T01:30:00Z', end: '2026-09-21T04:45:00Z', dur: 195, clar: 'Please confirm whether backup cable route is available during disconnection.' }
];

INITIAL_REQUEST_SEEDS.forEach((s, idx) => {
  SEED_REQUESTS.push({
    id: `req-${idx + 1}`,
    requestCode: s.reqCode,
    taskId: s.taskId,
    department: s.dept,
    requestedById: s.dept === 'ENGINEERING' ? 'user-eng-01' : s.dept === 'TRD' ? 'user-trd-01' : 'user-snt-01',
    status: s.status,
    requestedStart: s.start,
    requestedEnd: s.end,
    requestedDurationMinutes: s.dur,
    reviewerId: s.status === 'ACCEPTED' || s.status === 'CLARIFICATION_REQUESTED' ? 'user-ctrl-01' : undefined,
    reviewerDecisionReason: s.reason,
    clarificationNotes: s.clar,
    submittedAt: '2026-09-18T14:30:00Z',
    reviewedAt: s.status !== 'SUBMITTED' && s.status !== 'UNDER_REVIEW' ? '2026-09-19T09:15:00Z' : undefined,
    createdAt: '2026-09-18T12:00:00Z',
    updatedAt: '2026-09-19T09:15:00Z'
  });
});

// Generate remaining to reach 65 requests
const REQUEST_STATUSES: MaintenanceRequest['status'][] = ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED', 'HOLD', 'DRAFT', 'CLARIFICATION_REQUESTED'];
SEED_TASKS.slice(6, 68).forEach((task, idx) => {
  const reqNum = 100 + idx;
  const status = REQUEST_STATUSES[idx % REQUEST_STATUSES.length];
  SEED_REQUESTS.push({
    id: `req-gen-${idx + 7}`,
    requestCode: `REQ-${task.department.slice(0, 3)}-2026-${reqNum}`,
    taskId: task.id,
    department: task.department,
    requestedById: task.department === 'ENGINEERING' ? 'user-eng-01' : task.department === 'TRD' ? 'user-trd-01' : 'user-snt-01',
    status: status,
    requestedStart: task.preferredStartDate,
    requestedEnd: task.preferredEndDate,
    requestedDurationMinutes: task.estimatedDurationMinutes + task.setupMinutes + task.restorationMinutes,
    reviewerId: status === 'ACCEPTED' || status === 'DECLINED' ? 'user-ctrl-01' : undefined,
    reviewerDecisionReason: status === 'DECLINED' ? 'Severe conflict with Up Goods rake congestion. Resubmit for Wednesday corridor.' : status === 'ACCEPTED' ? 'Feasible within stipulated corridor window.' : undefined,
    submittedAt: `2026-09-${17 + (idx % 3)}T10:00:00Z`,
    reviewedAt: status === 'ACCEPTED' || status === 'DECLINED' ? '2026-09-19T11:00:00Z' : undefined,
    createdAt: `2026-09-${16 + (idx % 3)}T14:00:00Z`,
    updatedAt: `2026-09-19T11:00:00Z`
  });
});

// ==========================================
// 7. TRAIN TIMETABLE (7 days, 25+ trains/day)
// ==========================================
export const SEED_TIMETABLE: TimetableEntry[] = [];

const CORE_TRAINS = [
  { num: '22226', name: 'Solapur–Mumbai CSMT Vande Bharat Express', type: 'EXPRESS' as const, prio: 1, entry: '09:20', exit: '10:05' },
  { num: '12124', name: 'Pune–CSMT Deccan Queen Express', type: 'EXPRESS' as const, prio: 1, entry: '07:15', exit: '08:12' },
  { num: '12126', name: 'Pune–CSMT Pragati Express', type: 'EXPRESS' as const, prio: 1, entry: '07:50', exit: '08:45' },
  { num: '12128', name: 'Pune–CSMT Intercity Express', type: 'EXPRESS' as const, prio: 2, entry: '17:55', exit: '18:50' },
  { num: '11008', name: 'Pune–CSMT Sinhagad Express', type: 'EXPRESS' as const, prio: 2, entry: '06:05', exit: '07:05' },
  { num: '11030', name: 'Kolhapur–Pune Koyna Express', type: 'EXPRESS' as const, prio: 2, entry: '15:45', exit: '16:40' },
  { num: '12157', name: 'Pune–Solapur Hutatma Express', type: 'EXPRESS' as const, prio: 2, entry: '18:00', exit: '18:50' },
  { num: '12025', name: 'Pune–Secunderabad Shatabdi Express', type: 'EXPRESS' as const, prio: 1, entry: '06:00', exit: '06:45' },
  // Locals
  { num: '99804', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '04:45', exit: '06:05' },
  { num: '99806', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '05:45', exit: '07:05' },
  { num: '99808', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '06:30', exit: '07:50' },
  { num: '99810', name: 'Pune–Talegaon Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '08:50', exit: '09:40' },
  { num: '99814', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '11:15', exit: '12:35' },
  { num: '99818', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '15:00', exit: '16:20' },
  { num: '99822', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '17:15', exit: '18:35' },
  { num: '99826', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '19:05', exit: '20:25' },
  { num: '99830', name: 'Pune–Lonavala Suburban Local', type: 'SUBURBAN' as const, prio: 3, entry: '21:00', exit: '22:20' },
  { num: '99834', name: 'Pune–Lonavala Night Local', type: 'SUBURBAN' as const, prio: 3, entry: '23:10', exit: '00:30' },
  // Passengers & Expresses
  { num: '51421', name: 'Pune–Nizamabad Passenger', type: 'PASSENGER' as const, prio: 4, entry: '14:25', exit: '15:15' },
  { num: '51401', name: 'Pune–Baramati Passenger', type: 'PASSENGER' as const, prio: 4, entry: '05:30', exit: '07:15' },
  { num: '51410', name: 'Kolhapur–Pune Passenger', type: 'PASSENGER' as const, prio: 4, entry: '11:30', exit: '12:45' },
  // Freight / Goods
  { num: 'G-CONTR-01', name: 'JNPT–Chinchwad Container Freight', type: 'GOODS' as const, prio: 5, entry: '00:30', exit: '01:25' },
  { num: 'G-COAL-04', name: 'Daund–Lonavala Thermal Coal Rake', type: 'GOODS' as const, prio: 5, entry: '02:00', exit: '03:15' },
  { num: 'G-AUTO-02', name: 'Automobile Express (Talegaon Siding)', type: 'GOODS' as const, prio: 5, entry: '23:30', exit: '00:45' },
  { num: 'G-BOXN-08', name: 'Miraj–Pune Steel Coil Freight', type: 'GOODS' as const, prio: 5, entry: '13:00', exit: '14:15' },
  // Maintenance Tower Wagon
  { num: 'M-TW-901', name: 'TRD Emergency Tower Wagon Patrol', type: 'MAINTENANCE' as const, prio: 2, entry: '01:45', exit: '04:15' }
];

// Replicate across 7 days (Sept 19 to Sept 25, 2026)
for (let day = 19; day <= 25; day++) {
  const dateStr = `2026-09-${day}`;
  CORE_TRAINS.forEach((tr, tIdx) => {
    // Select relevant section based on route
    const secId = (tIdx % 3 === 0) ? 'sec-pmp-cch' : (tIdx % 3 === 1) ? 'sec-cch-akrd' : 'sec-grwd-tgn';
    SEED_TIMETABLE.push({
      id: `tt-${day}-${tr.num}`,
      trainNumber: tr.num,
      trainName: tr.name,
      trainType: tr.type,
      date: dateStr,
      sectionId: secId,
      entryTime: tr.entry,
      exitTime: tr.exit,
      priority: tr.prio,
      forecastFlag: day > 21
    });
  });
}

// ==========================================
// 8. 50+ CORRIDOR WINDOWS
// ==========================================
export const SEED_CORRIDOR_WINDOWS: CorridorWindow[] = [];

SEED_SECTIONS.slice(0, 16).forEach((sec, sIdx) => {
  // Window 1: Night stipulated maintenance corridor (01:30 - 04:30)
  SEED_CORRIDOR_WINDOWS.push({
    id: `cw-night-${sec.id}`,
    sectionId: sec.id,
    startTime: '01:30',
    endTime: '04:30',
    status: sIdx === 5 ? 'OCCUPIED' : sIdx === 14 ? 'WEATHER_BLOCKED' : 'AVAILABLE',
    source: 'COA_STIPULATED',
    trainDensity: 'LOW',
    notes: 'Primary nocturnal multi-department maintenance corridor.'
  });

  // Window 2: Mid-day traffic lull (11:30 - 13:45)
  SEED_CORRIDOR_WINDOWS.push({
    id: `cw-midday-${sec.id}`,
    sectionId: sec.id,
    startTime: '11:45',
    endTime: '13:30',
    status: sIdx % 3 === 0 ? 'CONDITIONAL' : 'AVAILABLE',
    source: 'RBP_PLANNED',
    trainDensity: 'MEDIUM',
    notes: 'Secondary daylight window. Suburban frequency reduced to 45-min headways.'
  });

  // Window 3: Early morning freight interval (04:45 - 06:15)
  SEED_CORRIDOR_WINDOWS.push({
    id: `cw-morning-${sec.id}`,
    sectionId: sec.id,
    startTime: '04:45',
    endTime: '06:00',
    status: 'CONDITIONAL',
    source: 'DYNAMIC_WINDOW',
    trainDensity: 'MEDIUM',
    notes: 'Subject to timely clearance of Up Container freight.'
  });

  // Window 4: Afternoon maintenance (14:30 - 16:00)
  if (sIdx % 2 === 0) {
    SEED_CORRIDOR_WINDOWS.push({
      id: `cw-afternoon-${sec.id}`,
      sectionId: sec.id,
      startTime: '14:30',
      endTime: '16:00',
      status: 'AVAILABLE',
      source: 'RBP_PLANNED',
      trainDensity: 'LOW',
      notes: 'Available for shadow/power block without affecting mail/express trains.'
    });
  }
});

// ==========================================
// 9. 14 DAYS WEATHER FORECAST
// ==========================================
export const SEED_WEATHER: WeatherForecast[] = [];

for (let day = 18; day <= 31; day++) {
  const dateStr = `2026-09-${day}`;
  // Heavy rain on Sept 22-23 simulating Western Ghats monsoon burst
  const isMonsoonSpike = day === 22 || day === 23;
  const isModerateRain = day === 20 || day === 24;

  const rainMm = isMonsoonSpike ? 68.5 : isModerateRain ? 22.0 : (day % 4) * 3.5;
  const rainProb = isMonsoonSpike ? 95 : isModerateRain ? 65 : 20 + (day % 30);
  const warnLevel = isMonsoonSpike ? 'AMBER' as const : isModerateRain ? 'YELLOW' as const : 'GREEN' as const;
  const thunRisk = isMonsoonSpike ? 'HIGH' as const : 'LOW' as const;
  const lightRisk = isMonsoonSpike ? 'SEVERE' as const : isModerateRain ? 'MODERATE' as const : 'LOW' as const;

  SEED_WEATHER.push({
    id: `wf-${dateStr}-pune`,
    timestamp: `${dateStr}T06:00:00Z`,
    date: dateStr,
    sectionId: 'sec-pmp-cch',
    stationId: 'stn-pune',
    rainfallProbability: rainProb,
    rainfallMm: rainMm,
    thunderstormRisk: thunRisk,
    lightningRisk: lightRisk,
    windSpeedKmph: isMonsoonSpike ? 42 : 18,
    temperatureCelsius: isMonsoonSpike ? 24 : 29,
    visibilityKm: isMonsoonSpike ? 3.2 : 8.5,
    warningLevel: warnLevel,
    forecastConfidence: 88,
    source: 'IMD_PUNE',
    advisory: isMonsoonSpike 
      ? 'IMD Pune Warning: Heavy downpour & thunderstorm active over Bhor Ghat & Pune-Lonavala belt. Power block operations on elevated OHE restricted. Avoid deep screening.'
      : 'Normal weather. Safe for all scheduled line and power blocks.'
  });
}

// ==========================================
// 10. 20 HISTORICAL & 12 CANDIDATE BLOCKS
// ==========================================
export const SEED_BLOCK_PLANS: BlockPlan[] = [
  // Candidate / Proposed blocks (Current Week)
  {
    id: 'blk-curr-01',
    blockCode: 'BLK-PUNE-2026-W38-01',
    sectionId: 'sec-pmp-cch',
    planType: 'WEEKLY',
    status: 'PROPOSED',
    date: '2026-09-20',
    startTime: '01:30',
    endTime: '04:30',
    blockType: 'INTEGRATED',
    weatherRisk: 'LOW',
    trainImpactMinutes: 0,
    productiveMinutes: 155,
    setupMinutes: 15,
    restorationMinutes: 10,
    assetAvailabilityImpact: 94.2,
    taskIds: ['task-eng-104', 'task-trd-207', 'task-snt-305'],
    departments: ['ENGINEERING', 'TRD', 'S_AND_T'],
    createdById: 'user-ctrl-01',
    isLocked: false,
    readinessChecklist: {
      engineeringReady: true,
      trdIsolationReady: true,
      sntDisconnectionReady: true,
      operatingPermitReady: false
    }
  },
  {
    id: 'blk-curr-02',
    blockCode: 'BLK-PUNE-2026-W38-02',
    sectionId: 'sec-svjr-kk',
    planType: 'WEEKLY',
    status: 'APPROVED',
    date: '2026-09-21',
    startTime: '01:45',
    endTime: '04:15',
    blockType: 'INTEGRATED',
    weatherRisk: 'LOW',
    trainImpactMinutes: 10,
    productiveMinutes: 130,
    setupMinutes: 10,
    restorationMinutes: 10,
    assetAvailabilityImpact: 91.0,
    taskIds: ['task-snt-319'],
    departments: ['S_AND_T'],
    createdById: 'user-ctrl-01',
    approvedById: 'user-ctrl-01',
    isLocked: true,
    readinessChecklist: {
      engineeringReady: false,
      trdIsolationReady: false,
      sntDisconnectionReady: true,
      operatingPermitReady: true
    }
  },
  {
    id: 'blk-curr-03',
    blockCode: 'BLK-PUNE-2026-W38-03',
    sectionId: 'sec-cch-akrd',
    planType: 'WEEKLY',
    status: 'VALIDATED',
    date: '2026-09-20',
    startTime: '11:45',
    endTime: '13:30',
    blockType: 'LINE',
    weatherRisk: 'LOW',
    trainImpactMinutes: 15,
    productiveMinutes: 85,
    setupMinutes: 10,
    restorationMinutes: 10,
    assetAvailabilityImpact: 88.5,
    taskIds: ['task-eng-121'],
    departments: ['ENGINEERING'],
    createdById: 'user-ctrl-01',
    isLocked: false,
    readinessChecklist: {
      engineeringReady: true,
      trdIsolationReady: false,
      sntDisconnectionReady: false,
      operatingPermitReady: false
    }
  },
  {
    id: 'blk-curr-04',
    blockCode: 'BLK-PUNE-2026-W38-04',
    sectionId: 'sec-grwd-tgn',
    planType: 'WEEKLY',
    status: 'PROPOSED',
    date: '2026-09-21',
    startTime: '01:45',
    endTime: '04:00',
    blockType: 'POWER',
    weatherRisk: 'LOW',
    trainImpactMinutes: 0,
    productiveMinutes: 110,
    setupMinutes: 15,
    restorationMinutes: 10,
    assetAvailabilityImpact: 92.0,
    taskIds: ['task-trd-218'],
    departments: ['TRD'],
    createdById: 'user-ctrl-01',
    isLocked: false,
    readinessChecklist: {
      engineeringReady: false,
      trdIsolationReady: true,
      sntDisconnectionReady: false,
      operatingPermitReady: false
    }
  }
];

// Add additional proposed/validated candidate blocks
for (let c = 5; c <= 12; c++) {
  const sec = SEED_SECTIONS[c % SEED_SECTIONS.length];
  SEED_BLOCK_PLANS.push({
    id: `blk-curr-0${c}`,
    blockCode: `BLK-PUNE-2026-W38-0${c}`,
    sectionId: sec.id,
    planType: 'WEEKLY',
    status: c % 2 === 0 ? 'PROPOSED' : 'VALIDATED',
    date: `2026-09-${20 + (c % 5)}`,
    startTime: '02:00',
    endTime: '04:30',
    blockType: c % 3 === 0 ? 'INTEGRATED' : c % 2 === 0 ? 'POWER' : 'LINE',
    weatherRisk: c === 7 || c === 8 ? 'HIGH' : 'LOW',
    trainImpactMinutes: c % 3 === 0 ? 0 : 10,
    productiveMinutes: 125,
    setupMinutes: 15,
    restorationMinutes: 10,
    assetAvailabilityImpact: 93.0,
    taskIds: [`task-eng-${100 + c}`],
    departments: ['ENGINEERING'],
    createdById: 'user-ctrl-01',
    isLocked: false,
    readinessChecklist: {
      engineeringReady: true,
      trdIsolationReady: false,
      sntDisconnectionReady: false,
      operatingPermitReady: false
    }
  });
}

// 20 Historical Completed Blocks
for (let h = 1; h <= 20; h++) {
  const day = 1 + (h % 17);
  const sec = SEED_SECTIONS[h % SEED_SECTIONS.length];
  SEED_BLOCK_PLANS.push({
    id: `blk-hist-${h}`,
    blockCode: `BLK-PUNE-2026-HIST-${100 + h}`,
    sectionId: sec.id,
    planType: 'WEEKLY',
    status: 'COMPLETED',
    date: `2026-09-${day < 10 ? '0' + day : day}`,
    startTime: '01:30',
    endTime: '04:30',
    blockType: h % 2 === 0 ? 'INTEGRATED' : 'LINE',
    weatherRisk: 'LOW',
    trainImpactMinutes: 0,
    productiveMinutes: 160,
    setupMinutes: 10,
    restorationMinutes: 10,
    assetAvailabilityImpact: 96.5,
    taskIds: [],
    departments: h % 2 === 0 ? ['ENGINEERING', 'TRD'] : ['ENGINEERING'],
    createdById: 'user-ctrl-01',
    approvedById: 'user-ctrl-01',
    publishedAt: `2026-09-${day}T05:00:00Z`,
    actualExecution: {
      actualStart: '01:32',
      actualEnd: '04:28',
      productiveAchievedMinutes: 156,
      completionNotes: 'Work executed safely without incident. Track certified fit for 110 kmph.',
      status: 'COMPLETED_FULL'
    },
    readinessChecklist: {
      engineeringReady: true,
      trdIsolationReady: true,
      sntDisconnectionReady: true,
      operatingPermitReady: true
    }
  });
}

// ==========================================
// 11. 40 NOTIFICATIONS
// ==========================================
export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-01',
    targetRole: 'CONTROL_OFFICE',
    title: 'High Priority Task Submitted',
    message: 'ENG-104 (IMR Rail Defect on Chinchwad–Talegaon) submitted by SSE/P-Way with AI Priority 91.5.',
    type: 'CRITICAL',
    isRead: false,
    link: '/requests/req-1',
    createdAt: '2026-09-19T10:15:00Z'
  },
  {
    id: 'notif-02',
    targetRole: 'ENGINEERING',
    title: 'Clarification Required on Request REQ-ENG-2026-089',
    message: 'Control Office requested confirmation on tamping machine crew availability.',
    type: 'WARNING',
    isRead: false,
    link: '/requests/req-1',
    createdAt: '2026-09-19T09:30:00Z'
  },
  {
    id: 'notif-03',
    targetRole: 'CONTROL_OFFICE',
    title: 'Multi-Department Bundling Opportunity',
    message: 'AI Optimizer identified compatible tasks ENG-104, TRD-207, and SNT-305 for Integrated Block on Chinchwad–Akurdi corridor.',
    type: 'SUCCESS',
    isRead: false,
    link: '/blocks/planning',
    createdAt: '2026-09-19T09:00:00Z'
  },
  {
    id: 'notif-04',
    targetRole: 'ALL',
    title: 'IMD Monsoon Alert (Yellow/Amber Warning)',
    message: 'Heavy rainfall predicted over Pune–Lonavala section on Sept 22-23. Review weather-sensitive blocks.',
    type: 'WARNING',
    isRead: false,
    link: '/weather',
    createdAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'notif-05',
    targetRole: 'TRD',
    title: 'Power Block Approved',
    message: 'Request REQ-TRD-2026-048 approved for Talegaon isolator maintenance on Sept 21 (01:45 - 04:00).',
    type: 'SUCCESS',
    isRead: true,
    link: '/requests/req-4',
    createdAt: '2026-09-19T07:45:00Z'
  }
];

// Generate notifications up to 42
for (let n = 6; n <= 42; n++) {
  const roles: (Notification['targetRole'])[] = ['CONTROL_OFFICE', 'ENGINEERING', 'TRD', 'S_AND_T', 'SENIOR_REVIEWER'];
  const types: Notification['type'][] = ['INFO', 'WARNING', 'SUCCESS', 'CRITICAL'];
  SEED_NOTIFICATIONS.push({
    id: `notif-${n < 10 ? '0' + n : n}`,
    targetRole: roles[n % roles.length],
    title: `Operational Notice #${n}: Corridor Telemetry Update`,
    message: `Section ${SEED_SECTIONS[n % SEED_SECTIONS.length].name} track inspection log synchronized from TMS/COA.`,
    type: types[n % types.length],
    isRead: n > 15,
    link: '/map',
    createdAt: `2026-09-${15 + (n % 4)}T${10 + (n % 12)}:00:00Z`
  });
}

// ==========================================
// 12. 150 AUDIT LOG ENTRIES
// ==========================================
export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    userId: 'user-ctrl-01',
    userRole: 'CONTROL_OFFICE',
    action: 'REQUEST_ACCEPTED',
    entityType: 'REQUEST',
    entityId: 'REQ-TRD-2026-048',
    beforeData: '{"status":"UNDER_REVIEW"}',
    afterData: '{"status":"ACCEPTED"}',
    reason: 'Complies with stipulated night window; zero impact on Express timetable.',
    createdAt: '2026-09-19T09:15:00Z'
  },
  {
    id: 'audit-002',
    userId: 'user-ctrl-01',
    userRole: 'CONTROL_OFFICE',
    action: 'CLARIFICATION_REQUESTED',
    entityType: 'REQUEST',
    entityId: 'REQ-SNT-2026-061',
    beforeData: '{"status":"SUBMITTED"}',
    afterData: '{"status":"CLARIFICATION_REQUESTED"}',
    reason: 'Verify backup cable standby circuit prior to Shivajinagar Home signal disconnection.',
    createdAt: '2026-09-19T09:05:00Z'
  },
  {
    id: 'audit-003',
    userId: 'user-ctrl-01',
    userRole: 'CONTROL_OFFICE',
    action: 'AI_PRIORITY_OVERRIDE',
    entityType: 'PRIORITY',
    entityId: 'ENG-104',
    beforeData: '{"aiPriorityScore": 89.2}',
    afterData: '{"aiPriorityScore": 91.5}',
    reason: 'ADRM safety caution order raised for Chinchwad yard approach track geometry.',
    createdAt: '2026-09-19T08:45:00Z'
  },
  {
    id: 'audit-004',
    userId: 'user-ctrl-01',
    userRole: 'CONTROL_OFFICE',
    action: 'PLAN_GENERATED',
    entityType: 'BLOCK_PLAN',
    entityId: 'BLK-PUNE-2026-W38-01',
    beforeData: '{}',
    afterData: '{"tasks":["ENG-104","TRD-207","SNT-305"],"blockType":"INTEGRATED"}',
    reason: 'Automated AI bundling solver dovetailed 3 departmental requests into a single 180-minute window.',
    createdAt: '2026-09-19T08:30:00Z'
  },
  {
    id: 'audit-005',
    userId: 'user-eng-01',
    userRole: 'ENGINEERING',
    action: 'REQUEST_SUBMITTED',
    entityType: 'REQUEST',
    entityId: 'REQ-ENG-2026-089',
    beforeData: '{"status":"DRAFT"}',
    afterData: '{"status":"SUBMITTED"}',
    reason: 'Critical IMR rail flaw requires urgent weekend night block.',
    createdAt: '2026-09-18T14:30:00Z'
  }
];

// Generate entries up to 155
const AUDIT_ACTIONS = ['REQUEST_SUBMITTED', 'REQUEST_REVIEWED', 'REQUEST_ACCEPTED', 'BLOCK_SCHEDULED', 'PLAN_VALIDATED', 'DATA_SYNCED', 'READINESS_CONFIRMED', 'SYSTEM_HEALTH_CHECK'];
for (let a = 6; a <= 155; a++) {
  const act = AUDIT_ACTIONS[a % AUDIT_ACTIONS.length];
  SEED_AUDIT_LOGS.push({
    id: `audit-${a < 10 ? '00' + a : a < 100 ? '0' + a : a}`,
    userId: a % 3 === 0 ? 'user-ctrl-01' : a % 3 === 1 ? 'user-eng-01' : 'user-trd-01',
    userRole: a % 3 === 0 ? 'CONTROL_OFFICE' : a % 3 === 1 ? 'ENGINEERING' : 'TRD',
    action: act,
    entityType: a % 2 === 0 ? 'REQUEST' : 'BLOCK_PLAN',
    entityId: `ENT-PUNE-${1000 + a}`,
    reason: `Automated operational trail verified for transaction #${a}.`,
    createdAt: `2026-09-${12 + (a % 7)}T${(a % 23).toString().padStart(2, '0')}:${(a % 59).toString().padStart(2, '0')}:00Z`
  });
}
