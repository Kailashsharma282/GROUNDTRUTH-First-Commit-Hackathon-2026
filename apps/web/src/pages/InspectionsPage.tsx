import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Finding } from '@groundtruth/shared';
import { Scan, Plus, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const InspectionsPage: React.FC = () => {
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    api.getFindings().then(setFindings);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Field Reality Inspections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audits comparing physical photographic evidence with documented organizational standards.
          </p>
        </div>

        <Link
          to="/inspections/new"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Inspection</span>
        </Link>
      </div>

      {/* Inspections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {findings.map((f) => (
          <div
            key={f.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black relative">
                <img src={f.evidenceUrl} alt={f.title} className="w-full h-full object-cover" />
                <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  f.status === 'VERIFIED'
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/90 text-rose-300 border border-rose-500/40'
                }`}>
                  {f.status === 'VERIFIED' ? 'VERIFIED COMPLIANT' : 'GAP DETECTED'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 font-bold">{f.location}</span>
                <span>{f.category}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">
                {f.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {f.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">
                Ref: {f.id}
              </span>
              <Link
                to={`/findings/${f.id}`}
                className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
