import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

interface RealityGapVisualizerProps {
  expected: string;
  observed: string;
  gapDetected: boolean;
  confidence?: number;
  severity?: string;
  sourcePolicy?: string;
  sourceSection?: string;
  className?: string;
}

export const RealityGapVisualizer: React.FC<RealityGapVisualizerProps> = ({
  expected,
  observed,
  gapDetected,
  confidence = 0.94,
  severity = 'HIGH',
  sourcePolicy,
  sourceSection,
  className = ''
}) => {
  return (
    <div className={`rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-800/80 border-b border-slate-700/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            GroundTruth Reality Verification Engine
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {sourceSection && (
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Ref: {sourceSection}
            </span>
          )}
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 font-medium">
            AI Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Core Policy vs Reality Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Left: Policy Expected */}
        <div className="md:col-span-5 p-5 rounded-lg bg-slate-950/60 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Policy Requirement (Expected)
            </span>
            {sourcePolicy && (
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {sourcePolicy}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            "{expected}"
          </p>
        </div>

        {/* Center: Comparison Glyph */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          {gapDetected ? (
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 font-mono font-bold text-lg glow-rose">
              ≠
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg glow-emerald">
              =
            </div>
          )}
        </div>

        {/* Right: Real-World Observed */}
        <div className="md:col-span-5 p-5 rounded-lg bg-slate-950/60 border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Physical Evidence (Observed)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              SageMaker AI Vision
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            "{observed}"
          </p>
        </div>
      </div>

      {/* Signature Reality Gap Status Banner */}
      <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 ${
        gapDetected 
          ? 'bg-rose-950/40 border-t border-rose-900/60 text-rose-200' 
          : 'bg-emerald-950/40 border-t border-emerald-900/60 text-emerald-200'
      }`}>
        <div className="flex items-center space-x-3">
          {gapDetected ? (
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-wide">
                {gapDetected ? 'REALITY GAP DETECTED' : 'REALITY MATCHES DOCUMENTED POLICY'}
              </span>
              {gapDetected && (
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-rose-500/30 text-rose-300 border border-rose-500/40">
                  {severity} SEVERITY
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {gapDetected 
                ? 'Physical conditions diverge from policy specifications. Corrective remediation required.' 
                : 'Physical environment complies with all documented requirements.'}
            </p>
          </div>
        </div>

        {gapDetected && (
          <div className="flex items-center space-x-2 font-mono text-xs text-rose-300 bg-rose-900/40 px-3 py-1.5 rounded-lg border border-rose-700/50">
            <span>ACTION REQUIRED</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
