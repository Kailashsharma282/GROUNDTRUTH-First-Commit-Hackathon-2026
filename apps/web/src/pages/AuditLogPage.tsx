import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { AuditLogEntry } from '@groundtruth/shared';
import { History, Shield, Clock, Search, Filter } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
  }, []);

  const filtered = logs.filter(l =>
    l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.resourceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Immutable Operational Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Chronological, cryptographically verifiable log of policy uploads, SageMaker analyses, actions, and human sign-offs.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <input
          type="text"
          placeholder="Filter audit entries by actor, resource ID, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Timeline List */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-4">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-cyan-400">
                    {log.eventType}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Ref: {log.resourceId}
                  </span>
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {log.description}
                </p>
              </div>

              <div className="sm:text-right shrink-0 font-mono text-[11px] text-slate-400">
                <div className="text-slate-300 font-semibold">{log.actor} ({log.actorRole})</div>
                <div className="text-slate-500 mt-0.5">{new Date(log.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
