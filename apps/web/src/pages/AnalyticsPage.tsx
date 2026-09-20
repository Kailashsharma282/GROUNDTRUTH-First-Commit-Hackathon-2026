import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { DashboardMetrics, LocationMemory } from '@groundtruth/shared';
import { 
  BarChart3, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Repeat, 
  ShieldAlert, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [locations, setLocations] = useState<LocationMemory[]>([]);

  useEffect(() => {
    api.getDashboardMetrics().then(setMetrics);
    api.getLocations().then(setLocations);
  }, []);

  if (!metrics) {
    return <div className="text-cyan-400 font-mono text-xs">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Executive Compliance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Longitudinal metrics, resolution times, recurring issue patterns, and institutional facility memory.
        </p>
      </div>

      {/* Resolution Time by Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Mean Time to Remediate (Hours)</h3>
              <p className="text-xs text-slate-400">By policy category domain</p>
            </div>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.resolutionTimeByCategory}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Hours to Resolve" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Incident Memory (Requirement 30) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Institutional Incident Memory</h3>
                <p className="text-xs text-slate-400">What keeps going wrong at each location?</p>
              </div>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>

            <div className="space-y-3">
              {locations.slice(0, 3).map((loc) => (
                <div key={loc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {loc.name}
                    </span>
                    <span className="font-mono text-rose-400">Risk Score: {loc.riskScore}/100</span>
                  </div>
                  <div className="text-slate-400 flex items-center justify-between text-[11px] font-mono">
                    <span>Total Audits: {loc.totalInspections}</span>
                    <span>Last Incident: {loc.lastIncidentDaysAgo} days ago</span>
                  </div>
                  {loc.recurringViolations.length > 0 && (
                    <div className="mt-2 text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/60 inline-block">
                      Recurring: {loc.recurringViolations.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
