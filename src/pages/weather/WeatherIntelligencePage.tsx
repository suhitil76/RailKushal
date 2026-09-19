import React, { useState } from 'react';
import { 
  CloudSun, CloudRain, CloudLightning, Wind, Thermometer, 
  AlertTriangle, ShieldCheck, CheckCircle2, Info, ArrowRight, Shield 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { store } from '../../services/store';

interface WeatherIntelligencePageProps {
  onNavigate: (path: string) => void;
}

export const WeatherIntelligencePage: React.FC<WeatherIntelligencePageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const { weather, tasks, sections } = state;
  const currentWeather = weather[0];

  const [selectedDay, setSelectedDay] = useState<string>(weather[0].date);
  const activeForecast = weather.find(w => w.date === selectedDay) || weather[0];

  // 7-day precipitation chart data
  const precipData = weather.slice(0, 7).map(w => ({
    date: w.date.slice(5),
    rainfallMm: w.rainfallMm,
    windKmph: w.windSpeedKmph,
    warning: w.warningLevel
  }));

  // Tasks affected by weather
  const weatherGatedTasks = tasks.filter(t => t.weatherSensitivity !== 'NONE').slice(0, 6);

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#F4B942]/20 border border-[#F4B942]/40 text-[#F4B942] text-[10px] font-bold uppercase tracking-wider font-mono">
              IMD Pune Doppler Radar Integration
            </span>
            <span className="text-xs text-[#A7C1D4]">14-Day Microclimate Gating</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Pune Division Meteorological Intelligence &amp; Gating
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Automated weather gating for 25kV OHE power blocks, Bhor Ghat track tamping, and flashover prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#34D399] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Live Met Feed (CR Met Radar Sim)
          </span>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] flex items-center gap-3">
          <CloudRain className="w-8 h-8 text-[#38BDF8]" />
          <div>
            <span className="text-[11px] text-[#6E8AA3] uppercase font-semibold">Precipitation Intensity</span>
            <div className="text-xl font-black text-[#E6F4F1] font-mono">{activeForecast.rainfallMm} mm/hr</div>
            <p className="text-[10px] text-[#A7C1D4]">{activeForecast.rainfallProbability}% Probability</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] flex items-center gap-3">
          <CloudLightning className="w-8 h-8 text-[#F4B942]" />
          <div>
            <span className="text-[11px] text-[#6E8AA3] uppercase font-semibold">Lightning Hazard</span>
            <div className="text-xl font-black text-[#F4B942] font-mono">{activeForecast.lightningRisk}</div>
            <p className="text-[10px] text-[#A7C1D4]">OHE Tower Gating Active</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] flex items-center gap-3">
          <Wind className="w-8 h-8 text-[#20C6B7]" />
          <div>
            <span className="text-[11px] text-[#6E8AA3] uppercase font-semibold">Wind Velocity</span>
            <div className="text-xl font-black text-[#20C6B7] font-mono">{activeForecast.windSpeedKmph} km/h</div>
            <p className="text-[10px] text-[#34D399]">Within Platform Limits (&lt;35)</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1F33] border border-[#244B6A] flex items-center gap-3">
          <Thermometer className="w-8 h-8 text-[#F05252]" />
          <div>
            <span className="text-[11px] text-[#6E8AA3] uppercase font-semibold">Ambient Temperature</span>
            <div className="text-xl font-black text-[#E6F4F1] font-mono">{activeForecast.temperatureCelsius}°C</div>
            <p className="text-[10px] text-[#A7C1D4]">Rail Temp: ~{activeForecast.temperatureCelsius + 12}°C</p>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Cards Carousel */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">7-Day Corridor Weather Outlook</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.slice(0, 7).map(w => {
            const isSelected = selectedDay === w.date;
            return (
              <div
                key={w.date}
                onClick={() => setSelectedDay(w.date)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#163B5C] border-[#20C6B7] shadow-lg shadow-cyan-950/40' 
                    : 'bg-[#0B1F33] border-[#244B6A] hover:bg-[#102A43]'
                }`}
              >
                <span className="font-mono text-xs font-bold text-[#E6F4F1] block">{w.date.slice(5)}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                  w.warningLevel === 'AMBER' ? 'bg-[#F97316]/20 text-[#F97316]' :
                  w.warningLevel === 'YELLOW' ? 'bg-[#F4B942]/20 text-[#F4B942]' : 'bg-[#34D399]/20 text-[#34D399]'
                }`}>
                  {w.warningLevel} ALERT
                </span>

                <div className="mt-3 text-xs font-mono font-bold text-[#38BDF8]">
                  {w.rainfallMm} mm
                </div>
                <div className="text-[10px] text-[#A7C1D4] mt-0.5">
                  ⚡ {w.lightningRisk}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Rainfall & Wind Trends (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-3">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider">
            7-Day Precipitation &amp; Wind Velocity Forecast
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precipData}>
                <XAxis dataKey="date" stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <YAxis stroke="#6E8AA3" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071626', borderColor: '#244B6A', fontSize: '11px' }} />
                <Bar dataKey="rainfallMm" fill="#38BDF8" name="Rainfall (mm/hr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Sensitivity Rules & Affected Work (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1F33] border border-[#244B6A] space-y-4">
          <h3 className="text-xs font-bold text-[#E6F4F1] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F4B942]" />
            Weather-Restricted Maintenance Tasks
          </h3>

          <div className="space-y-2.5">
            {weatherGatedTasks.map(t => (
              <div key={t.id} className="p-3 rounded-xl bg-[#071626] border border-[#244B6A] text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="font-mono font-bold text-[#38BDF8]">{t.taskCode}</span>
                  <span className="text-[#F97316] font-semibold text-[10px]">{t.weatherSensitivity.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-[#E6F4F1] truncate mt-1">{t.title}</p>
                <div className="mt-2 text-[10px] text-[#A7C1D4] flex justify-between">
                  <span>Dept: {t.department}</span>
                  <span className="text-[#34D399]">AI Suggestion: Reschedule if Rain &gt; 40mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
