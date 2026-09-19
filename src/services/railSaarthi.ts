import { store } from './store';

export interface RailSaarthiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  deepLinks?: { label: string; url: string }[];
  contextData?: any;
}

export function queryRailSaarthi(query: string, currentPage: string = '/'): RailSaarthiMessage {
  const q = query.toLowerCase().trim();
  const state = store.getState();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. "Which critical tasks are pending?"
  if (q.includes('critical task') || q.includes('pending task') || q.includes('critical defect')) {
    const criticalTasks = state.tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').slice(0, 5);
    const links = criticalTasks.map(t => ({ label: `${t.taskCode} (${t.title.slice(0, 30)}...)`, url: `/tasks` }));
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `There are **${criticalTasks.length} urgent critical maintenance tasks** awaiting execution across Pune Division:\n\n` +
        criticalTasks.map(t => `• **${t.taskCode}** [${t.department}]: ${t.title} (AI Score: **${t.aiPriorityScore}**, Overdue: **${t.overdueDays}d**)`).join('\n') +
        `\n\nImmediate integrated corridor blocks are recommended during night hours.`,
      deepLinks: links
    };
  }

  // 2. "Why is ENG-104 high priority?"
  if (q.includes('eng-104') || (q.includes('why') && q.includes('priority') && q.includes('104'))) {
    const task = state.tasks.find(t => t.taskCode === 'ENG-104') || state.tasks[0];
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### AI Prioritization Breakdown for ${task.taskCode}:\n` +
        `• **Composite Priority Score**: **${task.aiPriorityScore}/100** (CRITICAL)\n` +
        `• **Safety Criticality (30% weight)**: **${task.safetyCriticality}/100** — Confirmed IMR rail flaw with high derailment hazard.\n` +
        `• **Failure Probability (20% weight)**: **${task.failureProbability}/100** — Heavy suburban axle-load fatigue.\n` +
        `• **Overdue Escalation (10% weight)**: **${task.overdueDays} days overdue** (adds urgent penalty).\n` +
        `• **Availability Impact (15% weight)**: **${task.availabilityImpact}/100** — Located on high-density Chinchwad–Talegaon trunk line.\n\n` +
        `**Co-scheduling Recommendation**: Bundle with **TRD-207** (OHE Insulator) and **SNT-305** (Axle Counter) for a unified 180-min Integrated Block.`,
      deepLinks: [
        { label: 'View Request in Inbox', url: '/requests' },
        { label: 'Inspect in Planning Workspace', url: '/blocks/planning' }
      ]
    };
  }

  // 3. "Which tasks can be bundled on Chinchwad–Talegaon?"
  if (q.includes('bundle') || q.includes('chinchwad') || q.includes('talegaon')) {
    const matched = state.tasks.filter(t => 
      (t.sectionId === 'sec-pmp-cch' || t.sectionId === 'sec-cch-akrd' || t.sectionId === 'sec-grwd-tgn') &&
      t.status !== 'COMPLETED'
    ).slice(0, 4);

    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Multi-Department Bundling Opportunity (Chinchwad–Talegaon Corridor):\n` +
        `The AI Scheduler has identified **${matched.length} co-located maintenance requirements** eligible for a single Integrated Block:\n\n` +
        matched.map(t => `• **${t.taskCode}** [${t.department}]: ${t.title} (${t.estimatedDurationMinutes} mins)`).join('\n') +
        `\n\n**Operational Benefit**: Doing these in a single coordinated window saves **140 minutes of train disruption** and reduces speed restrictions from 3 separate days down to 1 window.`,
      deepLinks: [{ label: 'Generate Integrated Block', url: '/blocks/planning' }]
    };
  }

  // 4. "Which blocks are affected by rain tomorrow?"
  if (q.includes('rain') || q.includes('weather') || q.includes('monsoon')) {
    const rainForecast = state.weather.find(w => w.rainfallMm > 20) || state.weather[2];
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Weather Advisory: Pune Division Maintenance Outlook\n` +
        `• **IMD Warning Status**: **${rainForecast.warningLevel} ALERT** on ${rainForecast.date}\n` +
        `• **Precipitation**: **${rainForecast.rainfallMm} mm/hr** with **${rainForecast.lightningRisk}** lightning risk.\n` +
        `• **Operational Impact**: High lightning risk strictly prohibits elevated OHE tower-wagon power blocks. Heavy rain restricts track tamping and deep screening.\n` +
        `• **Recommended Action**: Reschedule outdoor TRD power blocks to non-storm windows; divert crews to sheltered relay room inspections.`,
      deepLinks: [{ label: 'Open Weather Intelligence', url: '/weather' }]
    };
  }

  // 5. "What requests are waiting for Control Office review?"
  if (q.includes('waiting') || q.includes('review') || q.includes('inbox')) {
    const pendingReqs = state.requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW');
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `Currently, there are **${pendingReqs.length} maintenance requests** awaiting Control Office decision:\n\n` +
        pendingReqs.slice(0, 5).map(r => `• **${r.requestCode}** [${r.department}]: Duration ${r.requestedDurationMinutes} mins, Status: \`${r.status}\``).join('\n') +
        `\n\nControl planners can Accept, Decline, Hold, or Return for Clarification with mandatory operational audit logging.`,
      deepLinks: [{ label: 'Open Request Review Inbox', url: '/requests' }]
    };
  }

  // 6. "Which section has the highest risk?"
  if (q.includes('highest risk') || q.includes('risk section') || q.includes('dangerous')) {
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### High-Risk Corridor Analysis:\n` +
        `• **Top Risk Section**: **Pimpri–Chinchwad (PMP-CCH)** and **Chinchwad–Akurdi (CCH-AKRD)**\n` +
        `• **Traffic Density**: VERY HIGH (suburban local trains + Deccan Queen + freight rakes)\n` +
        `• **Active Defects**: 4 critical / high defects (Track geometry wear, OHE insulator hotspot, Axle counter dropouts)\n` +
        `• **Cumulative Risk Index**: **88.4 / 100**\n\n` +
        `Priority attention is recommended for the 01:30 - 04:30 nocturnal window.`,
      deepLinks: [{ label: 'Inspect Section on Pune Map', url: '/map' }]
    };
  }

  // 7. "What is the recommended weekly plan?"
  if (q.includes('weekly plan') || q.includes('recommend') || q.includes('plan')) {
    const proposed = state.blockPlans.filter(b => b.planType === 'WEEKLY' && (b.status === 'PROPOSED' || b.status === 'VALIDATED'));
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `The AI Solver has synthesized **${proposed.length} candidate weekly maintenance blocks**:\n\n` +
        proposed.slice(0, 4).map(b => `• **${b.blockCode}** [${b.blockType}]: Section ${b.sectionId} on ${b.date} (${b.startTime} - ${b.endTime}) - ${b.departments.join(' + ')}`).join('\n') +
        `\n\n**Key Metric**: **95.8%** projected asset availability with **38.4% reduction** in manual baseline downtime.`,
      deepLinks: [{ label: 'Open Weekly Plan', url: '/blocks/weekly' }]
    };
  }

  // 8. "Which department has the highest backlog?"
  if (q.includes('backlog') || q.includes('department')) {
    const engCount = state.tasks.filter(t => t.department === 'ENGINEERING' && t.status !== 'COMPLETED').length;
    const trdCount = state.tasks.filter(t => t.department === 'TRD' && t.status !== 'COMPLETED').length;
    const sntCount = state.tasks.filter(t => t.department === 'S_AND_T' && t.status !== 'COMPLETED').length;

    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Departmental Maintenance Backlog Status:\n` +
        `• **Engineering (Permanent Way)**: **${engCount} active tasks** (highest backlog due to track geometry & rail renewals)\n` +
        `• **TRD (Traction Distribution)**: **${trdCount} active tasks** (OHE insulator replacements & cantilever adjustments)\n` +
        `• **S&T (Signals & Telecom)**: **${sntCount} active tasks** (Axle counters, cable insulation, point machines)\n\n` +
        `Integrated rolling blocks are essential to clear Engineering and TRD backlogs concurrently.`,
      deepLinks: [{ label: 'View Asset & Task Register', url: '/tasks' }]
    };
  }

  // 9. "How does weather affect TRD tasks?"
  if (q.includes('trd') && (q.includes('weather') || q.includes('affect'))) {
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### Weather Constraints on TRD (Overhead Equipment) Work:\n` +
        `1. **Lightning / Thunderstorm**: Safety protocols strictly forbid ladder climbing and cantilever contact during lightning hazard (flashover and induced voltage risks).\n` +
        `2. **High Wind Speed (>35 km/h)**: Tower wagon elevated platform operations are suspended due to bucket sway.\n` +
        `3. **Heavy Rain**: Moisture on wet isolator blades complicates isolation gap insulation tests.\n\n` +
        `RailKushal automatically scans 14-day IMD forecasts and flags weather-gated TRD tasks for rescheduling.`,
      deepLinks: [{ label: 'Review Weather Intelligence', url: '/weather' }]
    };
  }

  // 10. "What does an integrated block mean?"
  if (q.includes('integrated block') || q.includes('what is') || q.includes('concept')) {
    return {
      id: `rs-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: `### What is an Integrated Block on Indian Railways?\n` +
        `An **Integrated Block** is a synchronized maintenance corridor where **multiple departments** (Civil Engineering, TRD/Electrical, and S&T) execute work **simultaneously in the same track section**.\n\n` +
        `**Why it matters for Problem Statement 26027**:\n` +
        `• Under conventional siloed planning, Engineering, TRD, and S&T take 3 separate blocks, disrupting train operations 3 times.\n` +
        `• In RailKushal, AI automatically bundles compatible tasks into a single window with shared setup, power isolation, and track protection, cutting total track downtime by over **35%**.`,
      deepLinks: [{ label: 'Compare in What-If Simulator', url: '/simulator' }]
    };
  }

  // Fallback general guidance
  return {
    id: `rs-${Date.now()}`,
    sender: 'assistant',
    timestamp,
    text: `I am **RailSaarthi**, your AI operational planning copilot for Pune Division. I can analyze tasks, timetable occupancy, corridor windows, and IMD weather constraints.\n\n` +
      `Try asking:\n` +
      `• *"Which critical tasks are pending?"*\n` +
      `• *"Why is ENG-104 high priority?"*\n` +
      `• *"Which tasks can be bundled on Chinchwad–Talegaon?"*\n` +
      `• *"Which blocks are affected by rain tomorrow?"*\n` +
      `• *"What does an integrated block mean?"*`,
    deepLinks: [
      { label: 'Control Dashboard', url: '/' },
      { label: 'Pune Division Map', url: '/map' },
      { label: 'Block Planning Workspace', url: '/blocks/planning' }
    ]
  };
}
