import React, { useState } from 'react';
import { CheckCircle, AlertOctagon, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface BeforeAfterViewerProps {
  beforeUrl: string;
  afterUrl: string;
  beforeStatus?: string;
  afterStatus?: string;
  confidence?: number;
  summary?: string;
  notes?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeUrl,
  afterUrl,
  beforeStatus = 'NON_COMPLIANT',
  afterStatus = 'COMPLIANT',
  confidence = 0.97,
  summary = 'Remediation evidence demonstrates full resolution. Egress pathway is 100% unobstructed.',
  notes = 'Visual verification confirms boxes removed to Storage Bay B-12.'
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'slider'>('split');

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Before vs After Remediation Verification
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                {Math.round(confidence * 100)}% Match
              </span>
            </h3>
            <p className="text-xs text-slate-400">SageMaker AI Multi-Image Grounding Comparison</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded transition-all ${
              viewMode === 'split' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1 rounded transition-all ${
              viewMode === 'slider' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Slider
          </button>
        </div>
      </div>

      {/* Visual Image Viewport */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-950/40">
          {/* BEFORE */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> BEFORE REMEDIATION
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                {beforeStatus}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-rose-900/50 aspect-video bg-black group">
              <img
                src={beforeUrl}
                alt="Before condition"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-rose-950/80 backdrop-blur border border-rose-500/40 px-2.5 py-1 rounded text-[11px] font-mono font-bold text-rose-300">
                OBSTRUCTION DETECTED
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> AFTER REMEDIATION
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                {afterStatus}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-emerald-900/50 aspect-video bg-black group">
              <img
                src={afterUrl}
                alt="After condition"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur border border-emerald-500/40 px-2.5 py-1 rounded text-[11px] font-mono font-bold text-emerald-300">
                VERIFIED CLEAR ✓
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Slider Mode */
        <div className="p-6 bg-slate-950/40">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700 bg-black select-none">
            {/* Base Image (After) */}
            <img src={afterUrl} alt="After condition" className="absolute inset-0 w-full h-full object-cover" />

            {/* Clipped Image (Before) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeUrl}
                alt="Before condition"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-3 left-3 bg-rose-950/90 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-rose-300 border border-rose-500/50">
                BEFORE: NON_COMPLIANT
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-emerald-300 border border-emerald-500/50">
              AFTER: COMPLIANT
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize shadow-[0_0_12px_#06b6d4]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-black font-bold text-xs shadow-lg">
                ↔
              </div>
            </div>

            {/* Range Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono mt-2">
            <span>◀ Drag left for Remediation</span>
            <span>Drag right for Original Violation ▶</span>
          </div>
        </div>
      )}

      {/* Verification Conclusion Box */}
      <div className="px-6 py-4 bg-emerald-950/30 border-t border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-emerald-200">
                AI VERIFICATION RESULT: REMEDIATION SATISFIED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {summary} {notes}
            </p>
          </div>
        </div>

        <div className="text-right sm:self-center font-mono text-xs">
          <span className="text-slate-400">Confidence: </span>
          <span className="text-emerald-400 font-bold">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
