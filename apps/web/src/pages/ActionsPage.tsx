import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { CorrectiveAction, ActionStatus } from '@groundtruth/shared';
import { BeforeAfterViewer } from '../components/BeforeAfterViewer.js';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  Wrench, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Sparkles, 
  ShieldCheck,
  AlertOctagon,
  Loader2
} from 'lucide-react';

export const ActionsPage: React.FC = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getActions().then(setActions);
  }, []);

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Corrective Actions & Remediation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Work orders dispatched to resolve reality gaps with before/after AI verification and human supervisor sign-off.
        </p>
      </div>

      {/* Actions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                <th className="p-4 font-medium">Action ID</th>
                <th className="p-4 font-medium">Task & Location</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-cyan-400">{a.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{a.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{a.location}</div>
                  </td>
                  <td className="p-4 text-slate-300">{a.ownerName}</td>
                  <td className="p-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.priority === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : a.priority === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {a.priority}
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      a.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : a.status === 'READY_FOR_VERIFICATION'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/actions/${a.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs border border-slate-700 inline-flex items-center space-x-1"
                    >
                      <span>Manage</span>
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

export const ActionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [action, setAction] = useState<CorrectiveAction | null>(null);

  // Remediation states
  const [remediationUrl, setRemediationUrl] = useState<string>(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  );
  const [notes, setNotes] = useState<string>('Corridor fully cleared to Storage Bay B-12.');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      api.getActionById(id).then((a) => {
        if (a) setAction(a);
      });
    }
  }, [id]);

  if (!action) {
    return <div className="text-cyan-400 font-mono text-xs">Loading Action...</div>;
  }

  const handleRunVerification = async () => {
    setIsVerifying(true);
    const result = await api.uploadRemediation({
      actionId: action.id,
      remediationImageUrl: remediationUrl,
      notes,
      actor: user?.name || 'Marcus Vance'
    });
    setAction(result.action);
    setIsVerifying(false);
  };

  const handleHumanSignoff = async (approved: boolean) => {
    const result = await api.humanConfirm({
      actionId: action.id,
      approved,
      actor: user?.name || 'Elena Rostova',
      actorRole: user?.role || 'MANAGER',
      notes: approved ? 'Supervisor confirmed compliant.' : 'Rework required.'
    });
    setAction(result.action);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400 mb-1">
            <span>Action: {action.id}</span>
            <span>•</span>
            <span>{action.location}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{action.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Assigned to: {action.ownerName}</p>
        </div>

        <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
          action.status === 'VERIFIED'
            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
        }`}>
          {action.status}
        </span>
      </div>

      {/* Before / After Verification Engine Component */}
      {action.verificationResult ? (
        <div className="space-y-6">
          <BeforeAfterViewer
            beforeUrl={action.beforeEvidenceUrl}
            afterUrl={action.remediationEvidence?.url || remediationUrl}
            beforeStatus={action.verificationResult.beforeStatus}
            afterStatus={action.verificationResult.afterStatus}
            confidence={action.verificationResult.verificationConfidence}
            summary={action.verificationResult.summary}
            notes={action.verificationResult.notes}
          />

          {/* Human-In-The-Loop Signoff (Requirement 26) */}
          {action.status !== 'VERIFIED' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>HUMAN-IN-THE-LOOP SUPERVISOR CONFIRMATION</span>
              </div>
              <p className="text-xs text-slate-300">
                SageMaker AI has verified the physical remediation. Confirm supervisor sign-off to formally close the finding and update the organizational audit log.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => handleHumanSignoff(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-slate-300 text-xs font-semibold"
                >
                  Reject & Request Rework
                </button>
                <button
                  onClick={() => handleHumanSignoff(true)}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFY & CLOSE FINDING</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Remediation Upload Form */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Submit Physical Remediation Photographic Evidence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Remediation Evidence Image URL (S3)
                </label>
                <input
                  type="text"
                  value={remediationUrl}
                  onChange={(e) => setRemediationUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Remediation Work Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running SageMaker AI Multi-Image Reasoner...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>TRIGGER SAGE MAKER AI VERIFICATION</span>
                  </>
                )}
              </button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
              <img src={remediationUrl} alt="Remediation preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
