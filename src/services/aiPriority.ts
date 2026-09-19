import { MaintenanceTask, WeatherForecast } from '../types/railway';

export interface PriorityWeights {
  safetyCriticality: number;      // default 0.30
  failureProbability: number;     // default 0.20
  urgency: number;                // default 0.15
  availabilityImpact: number;     // default 0.15
  overdueRisk: number;            // default 0.10
  weatherExposure: number;        // default 0.10
}

export const DEFAULT_AI_WEIGHTS: PriorityWeights = {
  safetyCriticality: 0.30,
  failureProbability: 0.20,
  urgency: 0.15,
  availabilityImpact: 0.15,
  overdueRisk: 0.10,
  weatherExposure: 0.10,
};

export interface AIExplanationBreakdown {
  score: number;
  riskLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  planningHorizon: 'Immediate' | 'This Week' | 'This Month' | 'Monitor';
  components: {
    safety: number;
    failureProb: number;
    urgency: number;
    availability: number;
    overdue: number;
    weather: number;
  };
  rationale: string;
  weatherAdjustment: string;
  recommendedWindow: string;
}

export function calculateAIPriority(
  task: MaintenanceTask,
  weather?: WeatherForecast,
  weights: PriorityWeights = DEFAULT_AI_WEIGHTS
): AIExplanationBreakdown {
  // Normalize each metric to 0-100
  const normSafety = Math.min(100, Math.max(0, task.safetyCriticality));
  const normFailure = Math.min(100, Math.max(0, task.failureProbability));
  const normUrgency = Math.min(100, Math.max(0, task.urgency));
  const normAvail = Math.min(100, Math.max(0, task.availabilityImpact));
  
  // Overdue risk: each overdue day adds 15 points, capped at 100
  const normOverdue = Math.min(100, Math.max(0, task.overdueDays * 15));

  // Weather exposure calculation
  let normWeather = 20; // baseline ambient weather
  let weatherNote = 'Normal atmospheric conditions; no adverse weather penalty applied.';
  
  if (weather) {
    if (task.weatherSensitivity === 'RAIN_SENSITIVE' && weather.rainfallMm > 25) {
      normWeather = 85;
      weatherNote = `High monsoon rainfall (${weather.rainfallMm} mm/hr) increases track instability risk; block urgently recommended before heavy downpour.`;
    } else if (task.weatherSensitivity === 'LIGHTNING_SENSITIVE' && (weather.lightningRisk === 'HIGH' || weather.lightningRisk === 'SEVERE')) {
      normWeather = 90;
      weatherNote = 'Severe lightning hazard logged; OHE isolation and mast work require strict weather gating.';
    } else if (task.weatherSensitivity === 'WIND_SENSITIVE' && weather.windSpeedKmph > 35) {
      normWeather = 75;
      weatherNote = `Gusty winds (${weather.windSpeedKmph} km/h) restrict elevated tower wagon cantilever work.`;
    } else if (task.weatherSensitivity === 'HEAT_SENSITIVE' && weather.temperatureCelsius > 38) {
      normWeather = 70;
      weatherNote = 'Elevated ambient rail temperature triggers de-stressing urgency.';
    }
  }

  // Weighted sum
  const rawScore = 
    (normSafety * weights.safetyCriticality) +
    (normFailure * weights.failureProbability) +
    (normUrgency * weights.urgency) +
    (normAvail * weights.availabilityImpact) +
    (normOverdue * weights.overdueRisk) +
    (normWeather * weights.weatherExposure);

  const finalScore = Math.round(rawScore * 10) / 10;

  let riskLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let planningHorizon: 'Immediate' | 'This Week' | 'This Month' | 'Monitor' = 'Monitor';

  if (finalScore >= 85) {
    riskLabel = 'CRITICAL';
    planningHorizon = 'Immediate';
  } else if (finalScore >= 70) {
    riskLabel = 'HIGH';
    planningHorizon = 'This Week';
  } else if (finalScore >= 50) {
    riskLabel = 'MEDIUM';
    planningHorizon = 'This Month';
  } else {
    riskLabel = 'LOW';
    planningHorizon = 'Monitor';
  }

  // Construct natural language explainability
  let rationale = `Asset availability risk is rated ${riskLabel} (${finalScore}/100). `;
  if (normSafety >= 85) {
    rationale += `Safety criticality is paramount at ${normSafety}/100 under Indian Railway Safety Code. `;
  }
  if (task.overdueDays > 0) {
    rationale += `Task is overdue by ${task.overdueDays} day(s), triggering an elevated priority escalator. `;
  }
  if (normAvail >= 75) {
    rationale += `Significant train throughput impact if unscheduled breakdown occurs on this corridor. `;
  }

  const recommendedWindow = finalScore >= 80 
    ? 'Night stipulated corridor (01:30 - 04:30) within 24-48 hours'
    : 'Midday traffic lull (11:45 - 13:30) or weekend scheduled rolling block';

  return {
    score: finalScore,
    riskLabel,
    planningHorizon,
    components: {
      safety: Math.round(normSafety * weights.safetyCriticality * 10) / 10,
      failureProb: Math.round(normFailure * weights.failureProbability * 10) / 10,
      urgency: Math.round(normUrgency * weights.urgency * 10) / 10,
      availability: Math.round(normAvail * weights.availabilityImpact * 10) / 10,
      overdue: Math.round(normOverdue * weights.overdueRisk * 10) / 10,
      weather: Math.round(normWeather * weights.weatherExposure * 10) / 10,
    },
    rationale,
    weatherAdjustment: weatherNote,
    recommendedWindow
  };
}
