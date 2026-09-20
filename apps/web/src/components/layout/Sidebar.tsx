import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Scan, 
  AlertTriangle, 
  Wrench, 
  BarChart3, 
  History, 
  Settings, 
  PlayCircle,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/policies', label: 'Policy Library', icon: BookOpen },
  { path: '/inspections', label: 'Inspections', icon: Scan },
  { path: '/findings', label: 'Findings', icon: AlertTriangle },
  { path: '/actions', label: 'Corrective Actions', icon: Wrench },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/audit-log', label: 'Audit Trail', icon: History },
  { path: '/settings', label: 'AWS & Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white">
                GROUND<span className="text-cyan-400">TRUTH</span>
              </span>
              <span className="block text-[8px] font-mono text-slate-400 tracking-wider uppercase -mt-0.5">
                Reality Verification
              </span>
            </div>
          </NavLink>
        </div>

        {/* Demo Fast-Track Card */}
        <div className="p-4">
          <NavLink
            to="/demo"
            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/40 transition group"
          >
            <div className="flex items-center space-x-2.5">
              <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-white">Guided Demo Mode</div>
                <div className="text-[10px] text-slate-400">Blocked Emergency Exit</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded">
              3-MIN
            </span>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Participant / Hackathon Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <div className="font-mono text-cyan-400 font-bold uppercase text-[10px] mb-0.5">
            AWS First Commit 2026
          </div>
          <div className="font-semibold text-slate-200 truncate">Pochiraju Kailash</div>
          <div className="text-[10px] text-slate-500">Solo • Team KGP_unknown_Coder_404</div>
        </div>
      </div>
    </aside>
  );
};
