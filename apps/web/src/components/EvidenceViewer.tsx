import React, { useState } from 'react';
import { VisualObservation } from '@groundtruth/shared';
import { Eye, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface EvidenceViewerProps {
  imageUrl: string;
  observations: VisualObservation[];
  title?: string;
  className?: string;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  imageUrl,
  observations,
  title = 'Physical Evidence Visualizer',
  className = ''
}) => {
  const [selectedObsId, setSelectedObsId] = useState<string | null>(observations[0]?.id || null);

  const selectedObservation = observations.find(o => o.id === selectedObsId);

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-800/80 border-b border-slate-700">
        <div className="flex items-center space-x-2.5">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-slate-100">{title}</span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {observations.length} Detections Grounded
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Interactive Canvas Viewport */}
        <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt="Physical Evidence"
            className="w-full h-full object-cover select-none"
          />

          {/* Bounding Box Overlays */}
          {observations.map((obs) => {
            if (!obs.boundingBox) return null;
            const isSelected = obs.id === selectedObsId;
            const { x, y, width, height } = obs.boundingBox;

            return (
              <div
                key={obs.id}
                onClick={() => setSelectedObsId(obs.id)}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? obs.isViolation
                      ? 'border-2 border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                      : 'border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                    : obs.isViolation
                    ? 'border-2 border-rose-500/70 bg-rose-500/10 hover:border-rose-400'
                    : 'border-2 border-slate-400/70 bg-slate-400/10 hover:border-white'
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${width}%`,
                  height: `${height}%`
                }}
              >
                {/* Floating Tag */}
                <div
                  className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md ${
                    obs.isViolation
                      ? 'bg-rose-600 text-white'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  {obs.label} ({Math.round(obs.confidence * 100)}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Observation Explanations */}
        <div className="lg:col-span-4 p-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              AI Grounded Observations
            </h4>

            <div className="space-y-2">
              {observations.map((obs) => {
                const isSelected = obs.id === selectedObsId;
                return (
                  <button
                    key={obs.id}
                    onClick={() => setSelectedObsId(obs.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? obs.isViolation
                          ? 'bg-rose-950/40 border-rose-700/80 text-rose-200'
                          : 'bg-cyan-950/40 border-cyan-700/80 text-cyan-200'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5 truncate">
                        {obs.isViolation ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        {obs.label}
                      </span>
                      <span className="font-mono text-[10px] opacity-80 shrink-0">
                        {Math.round(obs.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300/90 line-clamp-2 leading-relaxed">
                      {obs.evidenceExplanation}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedObservation && (
            <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" /> Evidence Audit Trail
              </div>
              <p>
                Spatial coordinate data and tensor feature maps logged for AWS SageMaker inference validation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
