import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { Finding, Category, Severity } from '@groundtruth/shared';
import { RealityGapVisualizer } from '../components/RealityGapVisualizer.js';
import { EvidenceViewer } from '../components/EvidenceViewer.js';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Repeat, 
  GitMerge, 
  Wrench,
  Layers
} from 'lucide-react';

export const FindingsPage: React.FC = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    api.getFindings().then(setFindings);
  }, []);

  const filtered = findings.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Reality Gap Findings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Catalog of physical reality gaps detected by Amazon SageMaker AI vision reasoning.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search findings by location, title, or requirement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                selectedSeverity === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Findings Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                <th className="p-4 font-medium">Finding ID</th>
                <th className="p-4 font-medium">Title & Location</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Confidence</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-cyan-400">{f.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{f.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{f.location}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{f.category}</td>
                  <td className="p-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : f.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {f.severity}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    {Math.round(f.confidence * 100)}%
                  </td>
                  <td className="p-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      f.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/findings/${f.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs border border-slate-700 inline-flex items-center space-x-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const FindingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [finding, setFinding] = useState<Finding | null>(null);

  const [duplicateDismissed, setDuplicateDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      api.getFindingById(id).then((f) => {
        if (f) setFinding(f);
      });
    }
  }, [id]);

  if (!finding) {
    return <div className="text-cyan-400 font-mono text-xs">Loading Finding...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400 mb-1">
            <span>Finding: {finding.id}</span>
            <span>•</span>
            <span>{finding.location}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{finding.title}</h1>
        </div>

        {finding.correctiveActionId && (
          <Link
            to={`/actions/${finding.correctiveActionId}`}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shrink-0 shadow-lg shadow-cyan-500/20"
          >
            <Wrench className="w-4 h-4" />
            <span>Open Corrective Action</span>
          </Link>
        )}
      </div>

      {/* Duplicate Detection Alert (Requirement 27) */}
      {!duplicateDismissed && finding.possibleDuplicates && finding.possibleDuplicates.length > 0 && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-300 font-bold">
              <GitMerge className="w-4 h-4" />
              <span>POSSIBLE DUPLICATE DETECTED ({Math.round(finding.possibleDuplicates[0].similarityScore * 100)}% SIMILARITY)</span>
            </div>
            <span className="text-xs font-mono text-purple-400">
              Matched Ref: {finding.possibleDuplicates[0].findingId}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Similar finding recorded previously at <strong>{finding.possibleDuplicates[0].location}</strong>. Compare findings to avoid redundant work orders.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => navigate(`/findings/${finding.possibleDuplicates![0].findingId}`)}
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold transition"
            >
              Review Match
            </button>
            <button
              onClick={() => setDuplicateDismissed(true)}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
            >
              Keep Separate
            </button>
          </div>
        </div>
      )}

      {/* Recurring Issue Detection Banner (Requirement 28) */}
      {finding.isRecurringIssue && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-xs">
          <Repeat className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-200">
              RECURRING SYSTEMIC ISSUE PATTERN ({finding.location})
            </div>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              {finding.recurringIncidentCount || 5} similar incidents recorded within 30 days. Possible Root Cause: Repeated temporary staging in egress corridor. Recommendation: Install permanent physical buffer barrier.
            </p>
          </div>
        </div>
      )}

      {/* Signature Policy vs Reality Visualizer */}
      <RealityGapVisualizer
        expected={finding.expectedCondition}
        observed={finding.observedCondition}
        gapDetected={finding.status !== 'VERIFIED'}
        confidence={finding.confidence}
        severity={finding.severity}
        sourcePolicy={finding.policyTitle}
      />

      {/* Evidence Viewer with Bounding Boxes */}
      <EvidenceViewer
        imageUrl={finding.evidenceUrl}
        observations={finding.observations}
      />
    </div>
  );
};
