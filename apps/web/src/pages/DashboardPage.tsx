import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { DashboardMetrics } from '@groundtruth/shared';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Repeat, 
  Percent, 
  HelpCircle,
  TrendingUp, 
  ArrowUpRight, 
  Scan, 
  PlayCircle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    api.getDashboardMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-cyan-400 font-mono text-sm">
        Loading GroundTruth Dashboard Metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Reality Verification Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Continuous operational compliance across documented safety, maintenance, and facility standards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/demo"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs border border-cyan-500/30 transition shadow-md"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Interactive Demo</span>
          </Link>
          <Link
            to="/inspections/new"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
          >
            <Scan className="w-4 h-4" />
            <span>New Inspection</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reality Compliance */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Reality Compliance
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {metrics.realityComplianceRate}%
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2% vs last 7 days</span>
          </div>
        </div>

        {/* Open Findings */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Open Findings
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {metrics.openFindingsCount}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Active reality deviations tracked
          </div>
        </div>

        {/* Critical Findings */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Critical Findings
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400 mt-3">
            {metrics.criticalFindingsCount}
          </div>
          <div className="text-xs text-rose-400/90 font-medium mt-2">
            Requires 24-hr expedited SLA
          </div>
        </div>

        {/* Verified Fixes */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Verified Fixes
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {metrics.verifiedFixesCount}
          </div>
          <div className="text-xs text-cyan-400 font-medium mt-2">
            AI + Human verified closures
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-500">Avg Resolution Time:</span>
          <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{metrics.averageResolutionHours} Hours</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">Recurring Violations:</span>
          <div className="text-amber-400 font-bold mt-0.5 flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5" />
            <span>{metrics.recurringViolationCount} Hotspots</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500">Verification Rate:</span>
          <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>{metrics.verificationRate}%</span>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-1 text-slate-500">
            <span>Reality Gap Score:</span>
            <button 
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-slate-400 hover:text-slate-200"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
          <div className="text-rose-400 font-bold mt-0.5">
            {metrics.realityGapScore}% Unresolved
          </div>

          {showTooltip && (
            <div className="absolute right-0 top-8 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-[11px] font-sans text-slate-300 z-30">
              Demo metric calculated from inspection outcomes weighted by severity. It is an operational metric, not a universal compliance standard.
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Reality Compliance Over Time</h3>
              <p className="text-xs text-slate-400">Measured daily vs 90% target SLA</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
              Last 7 Days
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.complianceTrend}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="complianceRate" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" name="Actual Compliance" />
                <Area type="monotone" dataKey="targetRate" stroke="#64748b" strokeDasharray="3 3" fillOpacity={0} name="Target SLA (90%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Severity Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Active open & in-progress findings</p>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.severityDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {metrics.severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2 pt-3 border-t border-slate-800">
            {metrics.severityDistribution.map((item) => (
              <div key={item.severity} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.severity}:</span>
                <span className="text-white font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Findings by Category & Problem Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">Findings by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Safety, Maintenance, Operations, Accessibility</p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.findingsByCategory}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Total Findings" />
                <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} name="Critical" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Problem Locations Table */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-1">High-Risk Facility Locations</h3>
          <p className="text-xs text-slate-400 mb-4">Locations with recurring gaps and active findings</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Open Gaps</th>
                  <th className="pb-2 font-medium">Total Audits</th>
                  <th className="pb-2 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.topLocations.map((loc) => (
                  <tr key={loc.location} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 font-semibold text-slate-200">{loc.location}</td>
                    <td className="py-2.5 font-mono text-rose-400">{loc.openGaps}</td>
                    <td className="py-2.5 font-mono text-slate-400">{loc.totalInspections}</td>
                    <td className="py-2.5 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        loc.risk === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : loc.risk === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {loc.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
