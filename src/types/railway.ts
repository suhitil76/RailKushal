export type UserRole = 
  | 'CONTROL_OFFICE' 
  | 'ENGINEERING' 
  | 'TRD' 
  | 'S_AND_T' 
  | 'SENIOR_REVIEWER' 
  | 'ADMIN';

export type Department = 'ENGINEERING' | 'TRD' | 'S_AND_T' | 'OPERATING' | 'SAFETY' | 'ALL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  designation: string;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  division: string;
  routeKm: number;
  isMajor: boolean;
  tracks: number;
}

export interface Section {
  id: string;
  code: string;
  name: string;
  fromStationId: string;
  toStationId: string;
  lengthKm: number;
  lineCount: number;
  electrified: boolean;
  trafficDensity: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  coordinates: [number, number][]; // [lat, lng] array
}

export type AssetType = 
  // Engineering
  | 'RAIL' | 'TURNOUT' | 'WELD' | 'SLEEPER' | 'BALLAST' | 'BRIDGE' | 'TRACK_CIRCUIT_INSULATOR'
  // TRD
  | 'OHE_CANTILEVER' | 'MAST' | 'INSULATOR' | 'ISOLATOR' | 'TRACTION_SUBSTATION' | 'FEEDER_WIRE' | 'TOWER_WAGON'
  // S&T
  | 'SIGNAL_ASPECT' | 'POINT_MACHINE' | 'AXLE_COUNTER' | 'RELAY_INTERLOCKING' | 'OFC_CABLE' | 'TRACK_CIRCUIT' | 'LEVEL_CROSSING_GATE';

export interface Asset {
  id: string;
  assetCode: string;
  department: Department;
  assetType: AssetType;
  sectionId: string;
  stationId?: string;
  chainageKm: number;
  conditionScore: number; // 0 (failed) to 100 (pristine)
  installYear: number;
  lastInspectionDate: string;
  availabilityRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE_REQUIRED' | 'CRITICAL_ATTENTION';
}

export type DefectSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type BlockType = 'LINE' | 'POWER' | 'INTEGRATED' | 'SHADOW';
export type WeatherSensitivity = 'NONE' | 'RAIN_SENSITIVE' | 'LIGHTNING_SENSITIVE' | 'WIND_SENSITIVE' | 'HEAT_SENSITIVE';

export interface MaintenanceTask {
  id: string;
  taskCode: string;
  sourceSystem: 'TMS' | 'SMMS' | 'TDMS' | 'MANUAL';
  department: Department;
  assetId: string;
  sectionId: string;
  title: string;
  description: string;
  defectType: string;
  severity: DefectSeverity;
  safetyCriticality: number; // 0-100
  failureProbability: number; // 0-100
  urgency: number; // 0-100
  availabilityImpact: number; // 0-100
  overdueDays: number;
  estimatedDurationMinutes: number;
  setupMinutes: number;
  restorationMinutes: number;
  requiredBlockType: BlockType;
  weatherSensitivity: WeatherSensitivity;
  preferredStartDate: string;
  preferredEndDate: string;
  latestCompletionDate: string;
  dependencyNotes?: string;
  requiredCrew: string;
  requiredEquipment: string;
  status: 'PENDING' | 'REQUEST_SUBMITTED' | 'IN_REVIEW' | 'CLARIFICATION' | 'ACCEPTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED';
  aiPriorityScore: number; // 0-100
  aiPriorityExplanation: string;
  priorityOverride?: {
    originalScore: number;
    overrideScore: number;
    reason: string;
    overriddenBy: string;
    timestamp: string;
  };
  // Department specific
  engDetails?: {
    trackComponent: string;
    defectClassification: string;
    cautionOrderRequired: boolean;
    speedRestrictionKmph?: number;
  };
  trdDetails?: {
    oheSpan: string;
    isolationPoint: string;
    powerBlockType: 'FULL' | 'SECTION' | 'ELEMENTARY';
    tpcPermitRequired: boolean;
  };
  sntDetails?: {
    gearCategory: string;
    interlockingDisconnectionRequired: boolean;
    testingProtocol: string;
    commissioningOfficer: string;
  };
}

export type RequestStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'CLARIFICATION_REQUESTED' 
  | 'ACCEPTED' 
  | 'DECLINED' 
  | 'HOLD' 
  | 'WITHDRAWN';

export interface MaintenanceRequest {
  id: string;
  requestCode: string;
  taskId: string;
  department: Department;
  requestedById: string;
  status: RequestStatus;
  requestedStart: string; // ISO string
  requestedEnd: string;
  requestedDurationMinutes: number;
  reviewerId?: string;
  reviewerDecisionReason?: string;
  clarificationNotes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorridorWindow {
  id: string;
  sectionId: string;
  startTime: string; // e.g., "01:30" or ISO
  endTime: string;   // e.g., "04:30"
  date?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CONDITIONAL' | 'WEATHER_BLOCKED' | 'MAINTENANCE_LOCKED';
  source: 'COA_STIPULATED' | 'RBP_PLANNED' | 'DYNAMIC_WINDOW';
  trainDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  notes: string;
}

export type TrainType = 'EXPRESS' | 'PASSENGER' | 'SUBURBAN' | 'GOODS' | 'MAINTENANCE';

export interface TimetableEntry {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  date: string; // YYYY-MM-DD
  sectionId: string;
  entryTime: string; // HH:mm
  exitTime: string;  // HH:mm
  priority: number; // 1 (Highest, e.g. Vande Bharat/Rajdhani) to 5 (Goods)
  forecastFlag: boolean;
}

export type WeatherWarningLevel = 'GREEN' | 'YELLOW' | 'AMBER' | 'RED';

export interface WeatherForecast {
  id: string;
  timestamp: string; // ISO date
  date: string; // YYYY-MM-DD
  sectionId?: string;
  stationId?: string;
  rainfallProbability: number; // %
  rainfallMm: number; // mm
  thunderstormRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  lightningRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  windSpeedKmph: number;
  temperatureCelsius: number;
  visibilityKm: number;
  warningLevel: WeatherWarningLevel;
  forecastConfidence: number; // %
  source: 'IMD_PUNE' | 'CR_MET_RADAR';
  advisory: string;
}

export type BlockPlanStatus = 'DRAFT' | 'PROPOSED' | 'VALIDATED' | 'APPROVED' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface BlockPlan {
  id: string;
  blockCode: string;
  sectionId: string;
  planType: 'WEEKLY' | 'MONTHLY' | 'EMERGENCY';
  status: BlockPlanStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  blockType: BlockType;
  weatherRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  trainImpactMinutes: number;
  productiveMinutes: number;
  setupMinutes: number;
  restorationMinutes: number;
  assetAvailabilityImpact: number; // % uptime preserved
  taskIds: string[];
  departments: Department[];
  createdById: string;
  approvedById?: string;
  publishedAt?: string;
  isLocked?: boolean;
  actualExecution?: {
    actualStart: string;
    actualEnd: string;
    productiveAchievedMinutes: number;
    completionNotes: string;
    status: 'COMPLETED_FULL' | 'COMPLETED_PARTIAL' | 'ABORTED';
  };
  readinessChecklist: {
    engineeringReady: boolean;
    trdIsolationReady: boolean;
    sntDisconnectionReady: boolean;
    operatingPermitReady: boolean;
  };
}

export interface Notification {
  id: string;
  userId?: string;
  targetRole?: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'CRITICAL';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userRole?: UserRole;
  action: string;
  entityType: 'REQUEST' | 'TASK' | 'BLOCK_PLAN' | 'PRIORITY' | 'SYSTEM' | 'IMPORT' | 'CONFIG';
  entityId: string;
  beforeData?: string;
  afterData?: string;
  reason?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  requestId?: string;
  blockPlanId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  body: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  requestId?: string;
  taskId?: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}
