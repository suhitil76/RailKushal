import { 
  User, UserRole, Department, Station, Section, Asset, MaintenanceTask, MaintenanceRequest, 
  CorridorWindow, TimetableEntry, WeatherForecast, BlockPlan, Notification, AuditLog 
} from '../types/railway';
import { 
  SEED_USERS, SEED_STATIONS, SEED_SECTIONS, SEED_ASSETS, SEED_TASKS, 
  SEED_REQUESTS, SEED_TIMETABLE, SEED_CORRIDOR_WINDOWS, SEED_WEATHER, 
  SEED_BLOCK_PLANS, SEED_NOTIFICATIONS, SEED_AUDIT_LOGS 
} from '../data/seedData';
import { PriorityWeights, DEFAULT_AI_WEIGHTS, calculateAIPriority } from './aiPriority';
import { generateAutomatedBlockPlan } from './scheduler';

interface StoreState {
  currentUser: User | null;
  users: User[];
  stations: Station[];
  sections: Section[];
  assets: Asset[];
  tasks: MaintenanceTask[];
  requests: MaintenanceRequest[];
  corridorWindows: CorridorWindow[];
  timetable: TimetableEntry[];
  weather: WeatherForecast[];
  blockPlans: BlockPlan[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  aiWeights: PriorityWeights;
}

const STORAGE_KEY = 'RAILKUSHAL_PUNE_STATE_V1';

class RailKushalStore {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StoreState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentUser: parsed.currentUser || SEED_USERS[0],
          stations: parsed.stations || SEED_STATIONS,
          sections: parsed.sections || SEED_SECTIONS,
          assets: parsed.assets || SEED_ASSETS,
          tasks: parsed.tasks || SEED_TASKS,
          requests: parsed.requests || SEED_REQUESTS,
          corridorWindows: parsed.corridorWindows || SEED_CORRIDOR_WINDOWS,
          timetable: parsed.timetable || SEED_TIMETABLE,
          weather: parsed.weather || SEED_WEATHER,
          blockPlans: parsed.blockPlans || SEED_BLOCK_PLANS,
          notifications: parsed.notifications || SEED_NOTIFICATIONS,
          auditLogs: parsed.auditLogs || SEED_AUDIT_LOGS,
          aiWeights: parsed.aiWeights || DEFAULT_AI_WEIGHTS,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using clean seeds', e);
    }

    return {
      currentUser: SEED_USERS[0], // Control Office default
      users: SEED_USERS,
      stations: SEED_STATIONS,
      sections: SEED_SECTIONS,
      assets: SEED_ASSETS,
      tasks: SEED_TASKS,
      requests: SEED_REQUESTS,
      corridorWindows: SEED_CORRIDOR_WINDOWS,
      timetable: SEED_TIMETABLE,
      weather: SEED_WEATHER,
      blockPlans: SEED_BLOCK_PLANS,
      notifications: SEED_NOTIFICATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      aiWeights: DEFAULT_AI_WEIGHTS,
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // State Getters
  public getState(): StoreState {
    return this.state;
  }

  // Auth & Session
  public setCurrentUser(user: User | null) {
    this.state.currentUser = user;
    if (user) {
      this.logAudit('USER_LOGIN', 'SYSTEM', user.id, undefined, `Role: ${user.role}`, 'Session established');
    }
    this.persist();
  }

  public switchPersona(role: UserRole) {
    const found = this.state.users.find(u => u.role === role);
    if (found) {
      this.setCurrentUser(found);
    }
  }

  public logout() {
    if (this.state.currentUser) {
      this.logAudit('USER_LOGOUT', 'SYSTEM', this.state.currentUser.id, undefined, undefined, 'Session terminated');
    }
    this.state.currentUser = null;
    this.persist();
  }

  // Audit Logger
  public logAudit(
    action: string, 
    entityType: AuditLog['entityType'], 
    entityId: string, 
    before?: string, 
    after?: string, 
    reason?: string
  ) {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.state.currentUser?.id,
      userRole: this.state.currentUser?.role,
      action,
      entityType,
      entityId,
      beforeData: before,
      afterData: after,
      reason,
      createdAt: new Date().toISOString()
    };
    this.state.auditLogs = [newLog, ...this.state.auditLogs];
  }

  // Notification Dispatcher
  public dispatchNotification(
    targetRole: Notification['targetRole'], 
    title: string, 
    message: string, 
    type: Notification['type'] = 'INFO',
    link?: string
  ) {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      targetRole,
      title,
      message,
      type,
      isRead: false,
      link,
      createdAt: new Date().toISOString()
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.persist();
  }

  public markNotificationAsRead(id: string) {
    this.state.notifications = this.state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.persist();
  }

  public markAllNotificationsAsRead() {
    this.state.notifications = this.state.notifications.map(n => ({ ...n, isRead: true }));
    this.persist();
  }

  // Request Management
  public createMaintenanceRequest(
    taskData: Partial<MaintenanceTask>, 
    requestData: {
      requestedStart: string;
      requestedEnd: string;
      requestedDurationMinutes: number;
      isDraft?: boolean;
    }
  ): { task: MaintenanceTask; request: MaintenanceRequest } {
    const user = this.state.currentUser;
    const dept = user?.department === 'ENGINEERING' || user?.department === 'TRD' || user?.department === 'S_AND_T' 
      ? user.department 
      : (taskData.department || 'ENGINEERING');

    const nextTaskId = `task-${dept.toLowerCase().slice(0, 3)}-${Date.now()}`;
    const nextReqId = `req-${Date.now()}`;
    const reqCode = `REQ-${dept.slice(0, 3)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const taskCode = `${dept.slice(0, 3)}-${Math.floor(400 + Math.random() * 500)}`;

    const weather = this.state.weather[0];
    const initialTask: MaintenanceTask = {
      id: nextTaskId,
      taskCode,
      sourceSystem: (taskData.sourceSystem as any) || 'MANUAL',
      department: dept,
      assetId: taskData.assetId || this.state.assets[0].id,
      sectionId: taskData.sectionId || this.state.sections[0].id,
      title: taskData.title || 'New Maintenance Task',
      description: taskData.description || '',
      defectType: taskData.defectType || 'Operational Defect',
      severity: taskData.severity || 'MEDIUM',
      safetyCriticality: taskData.safetyCriticality || 70,
      failureProbability: taskData.failureProbability || 60,
      urgency: taskData.urgency || 65,
      availabilityImpact: taskData.availabilityImpact || 60,
      overdueDays: taskData.overdueDays || 0,
      estimatedDurationMinutes: taskData.estimatedDurationMinutes || 120,
      setupMinutes: taskData.setupMinutes || 15,
      restorationMinutes: taskData.restorationMinutes || 15,
      requiredBlockType: taskData.requiredBlockType || 'LINE',
      weatherSensitivity: taskData.weatherSensitivity || 'NONE',
      preferredStartDate: requestData.requestedStart,
      preferredEndDate: requestData.requestedEnd,
      latestCompletionDate: '2026-09-30T23:59:59Z',
      dependencyNotes: taskData.dependencyNotes,
      requiredCrew: taskData.requiredCrew || 'Division Maintenance Gang (8 staff)',
      requiredEquipment: taskData.requiredEquipment || 'Standard Tools & Gauges',
      status: requestData.isDraft ? 'PENDING' : 'REQUEST_SUBMITTED',
      aiPriorityScore: 75.0,
      aiPriorityExplanation: 'Calculated via explainable model upon intake.',
      engDetails: taskData.engDetails,
      trdDetails: taskData.trdDetails,
      sntDetails: taskData.sntDetails,
    };

    // Calculate AI priority
    const aiExpl = calculateAIPriority(initialTask, weather, this.state.aiWeights);
    initialTask.aiPriorityScore = aiExpl.score;
    initialTask.aiPriorityExplanation = aiExpl.rationale;

    const initialRequest: MaintenanceRequest = {
      id: nextReqId,
      requestCode: reqCode,
      taskId: nextTaskId,
      department: dept,
      requestedById: user?.id || 'user-eng-01',
      status: requestData.isDraft ? 'DRAFT' : 'SUBMITTED',
      requestedStart: requestData.requestedStart,
      requestedEnd: requestData.requestedEnd,
      requestedDurationMinutes: requestData.requestedDurationMinutes,
      submittedAt: requestData.isDraft ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.tasks = [initialTask, ...this.state.tasks];
    this.state.requests = [initialRequest, ...this.state.requests];

    this.logAudit(
      requestData.isDraft ? 'DRAFT_SAVED' : 'REQUEST_SUBMITTED',
      'REQUEST',
      reqCode,
      undefined,
      JSON.stringify(initialRequest),
      `User ${user?.name || 'Officer'} initiated maintenance request`
    );

    if (!requestData.isDraft) {
      this.dispatchNotification(
        'CONTROL_OFFICE',
        `New ${dept} Maintenance Request: ${reqCode}`,
        `Submitted for ${initialTask.title}. AI Priority: ${aiExpl.score} (${aiExpl.riskLabel}).`,
        aiExpl.riskLabel === 'CRITICAL' ? 'CRITICAL' : 'INFO',
        `/requests/${nextReqId}`
      );
    }

    this.persist();
    return { task: initialTask, request: initialRequest };
  }

  public updateRequestStatus(
    requestId: string,
    newStatus: MaintenanceRequest['status'],
    reason?: string,
    clarificationNotes?: string
  ) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return;

    const beforeState = JSON.stringify({ status: req.status });
    const user = this.state.currentUser;

    req.status = newStatus;
    req.reviewerId = user?.id;
    req.reviewerDecisionReason = reason || req.reviewerDecisionReason;
    req.clarificationNotes = clarificationNotes || req.clarificationNotes;
    req.reviewedAt = new Date().toISOString();
    req.updatedAt = new Date().toISOString();

    // Synchronize underlying task status
    const task = this.state.tasks.find(t => t.id === req.taskId);
    if (task) {
      if (newStatus === 'ACCEPTED') task.status = 'ACCEPTED';
      else if (newStatus === 'DECLINED') task.status = 'DECLINED';
      else if (newStatus === 'CLARIFICATION_REQUESTED') task.status = 'CLARIFICATION';
      else if (newStatus === 'SUBMITTED') task.status = 'REQUEST_SUBMITTED';
      else if (newStatus === 'HOLD') task.status = 'IN_REVIEW';
    }

    const afterState = JSON.stringify({ status: newStatus, reason });

    this.logAudit(
      `REQUEST_${newStatus}`,
      'REQUEST',
      req.requestCode,
      beforeState,
      afterState,
      reason || `Status shifted to ${newStatus}`
    );

    // Notify Department
    this.dispatchNotification(
      req.department as any,
      `Request ${req.requestCode} Status: ${newStatus.replace(/_/g, ' ')}`,
      reason ? `Decision Note: ${reason}` : `Request status updated by Control Office.`,
      newStatus === 'ACCEPTED' ? 'SUCCESS' : newStatus === 'DECLINED' ? 'WARNING' : 'INFO',
      `/requests/${req.id}`
    );

    this.persist();
  }

  // Priority Override (Control Office & Admin only)
  public overrideTaskPriority(taskId: string, newScore: number, reason: string) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const originalScore = task.aiPriorityScore;
    const user = this.state.currentUser;

    task.priorityOverride = {
      originalScore,
      overrideScore: newScore,
      reason,
      overriddenBy: user?.name || 'Chief Controller',
      timestamp: new Date().toISOString(),
    };
    task.aiPriorityScore = newScore;

    this.logAudit(
      'AI_PRIORITY_OVERRIDE',
      'PRIORITY',
      task.taskCode,
      JSON.stringify({ score: originalScore }),
      JSON.stringify({ score: newScore, reason }),
      reason
    );

    this.dispatchNotification(
      'CONTROL_OFFICE',
      `Priority Override: ${task.taskCode}`,
      `Score adjusted from ${originalScore} to ${newScore}. Reason: ${reason}`,
      'INFO',
      `/requests`
    );

    this.persist();
  }

  // Block Plan Generation
  public runAIBatchScheduler(targetDate: string = '2026-09-20') {
    const result = generateAutomatedBlockPlan(
      this.state.tasks,
      this.state.sections,
      this.state.corridorWindows,
      this.state.timetable,
      this.state.weather,
      targetDate
    );

    // Append newly proposed blocks (without overwriting locked/approved blocks)
    const existingLocked = this.state.blockPlans.filter(b => b.isLocked || b.status === 'APPROVED' || b.status === 'PUBLISHED');
    this.state.blockPlans = [...existingLocked, ...result.candidateBlocks];

    this.logAudit(
      'PLAN_BATCH_GENERATED',
      'BLOCK_PLAN',
      `BATCH-${targetDate}`,
      undefined,
      JSON.stringify({ blocksGenerated: result.candidateBlocks.length, dovetailEfficiency: result.comparisonWithBaseline.multiDeptDovetailEfficiency }),
      `AI Solver generated ${result.candidateBlocks.length} conflict-free candidate blocks.`
    );

    this.dispatchNotification(
      'CONTROL_OFFICE',
      `AI Schedule Generated for ${targetDate}`,
      `Generated ${result.candidateBlocks.length} coordinated blocks (${result.metrics.integratedBlockCount} Integrated). Efficiency gain: ${result.comparisonWithBaseline.multiDeptDovetailEfficiency}%.`,
      'SUCCESS',
      '/blocks/planning'
    );

    this.persist();
    return result;
  }

  // Block Plan Approval & Publishing
  public approveAndPublishBlockPlan(planId: string) {
    const plan = this.state.blockPlans.find(b => b.id === planId);
    if (!plan) return;

    const user = this.state.currentUser;
    plan.status = 'PUBLISHED';
    plan.isLocked = true;
    plan.approvedById = user?.id;
    plan.publishedAt = new Date().toISOString();

    // Mark tasks as SCHEDULED
    plan.taskIds.forEach(tid => {
      const task = this.state.tasks.find(t => t.id === tid);
      if (task) task.status = 'SCHEDULED';
    });

    this.logAudit(
      'PLAN_APPROVED_AND_PUBLISHED',
      'BLOCK_PLAN',
      plan.blockCode,
      undefined,
      JSON.stringify({ status: 'PUBLISHED', approvedBy: user?.name }),
      'Formally published to Central Railway Operating Control.'
    );

    this.dispatchNotification(
      'ALL',
      `Maintenance Block Published: ${plan.blockCode}`,
      `Section ${plan.sectionId} on ${plan.date} (${plan.startTime} - ${plan.endTime}). Departments: ${plan.departments.join(', ')}.`,
      'SUCCESS',
      '/blocks/weekly'
    );

    this.persist();
  }

  // Department Readiness Check
  public toggleReadiness(planId: string, deptKey: 'engineeringReady' | 'trdIsolationReady' | 'sntDisconnectionReady' | 'operatingPermitReady') {
    const plan = this.state.blockPlans.find(b => b.id === planId);
    if (!plan) return;

    plan.readinessChecklist[deptKey] = !plan.readinessChecklist[deptKey];
    this.logAudit(
      'READINESS_TOGGLED',
      'BLOCK_PLAN',
      plan.blockCode,
      undefined,
      JSON.stringify(plan.readinessChecklist),
      `${deptKey} confirmation updated by ${this.state.currentUser?.name}`
    );
    this.persist();
  }

  // Reset Demo Database
  public resetToDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      currentUser: SEED_USERS[0],
      users: SEED_USERS,
      stations: SEED_STATIONS,
      sections: SEED_SECTIONS,
      assets: SEED_ASSETS,
      tasks: SEED_TASKS,
      requests: SEED_REQUESTS,
      corridorWindows: SEED_CORRIDOR_WINDOWS,
      timetable: SEED_TIMETABLE,
      weather: SEED_WEATHER,
      blockPlans: SEED_BLOCK_PLANS,
      notifications: SEED_NOTIFICATIONS,
      auditLogs: SEED_AUDIT_LOGS,
      aiWeights: DEFAULT_AI_WEIGHTS,
    };
    this.logAudit('DEMO_DATA_RESET', 'SYSTEM', 'DATABASE', undefined, undefined, 'Full demo reset to initial seed values.');
    this.persist();
  }

  // Update AI Configuration
  public updateAIWeights(newWeights: PriorityWeights) {
    this.state.aiWeights = newWeights;
    // Re-evaluate task scores
    this.state.tasks.forEach(t => {
      if (!t.priorityOverride) {
        const expl = calculateAIPriority(t, this.state.weather[0], newWeights);
        t.aiPriorityScore = expl.score;
        t.aiPriorityExplanation = expl.rationale;
      }
    });
    this.logAudit('AI_WEIGHTS_UPDATED', 'CONFIG', 'AI_ENGINE', undefined, JSON.stringify(newWeights), 'Admin adjusted AI prioritization criteria.');
    this.persist();
  }
}

export const store = new RailKushalStore();
