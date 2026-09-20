import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Database, Cloud } from 'lucide-react';

interface AIEngineProgressProps {
  onComplete?: () => void;
  activeProvider?: 'sagemaker' | 'demo';
}

const WORKFLOW_STEPS = [
  { id: 'upload', title: 'Uploading photographic evidence to Amazon S3...', icon: Cloud },
  { id: 'req', title: 'Fetching normalized requirement & verification hints...', icon: Database },
  { id: 'sagemaker', title: 'Invoking Amazon SageMaker AI inference endpoint...', icon: Cpu },
  { id: 'vision', title: 'Analyzing visual evidence & generating bounding boxes...', icon: Sparkles },
  { id: 'compare', title: 'Comparing Documented Expected vs Observed reality...', icon: CheckCircle2 },
  { id: 'finding', title: 'Building structured reality gap finding & action items...', icon: Database },
  { id: 'audit', title: 'Recording immutable event to DynamoDB audit log...', icon: CheckCircle2 }
];

export const AIEngineProgress: React.FC<AIEngineProgressProps> = ({ 
  onComplete,
  activeProvider = 'sagemaker' 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < WORKFLOW_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="rounded-xl border border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 glow-cyan">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              GROUNDTRUTH REALITY VERIFICATION ENGINE
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                AWS {activeProvider.toUpperCase()} PIPELINE
              </span>
            </h3>
            <p className="text-xs text-slate-400">Step Functions Orchestrated Multimodal Analysis</p>
          </div>
        </div>

        <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Step {currentStepIndex + 1} of {WORKFLOW_STEPS.length}</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all text-xs font-medium ${
                isDone
                  ? 'bg-slate-950/60 border-emerald-900/50 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/40 border-cyan-600/80 text-cyan-200 shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/20 border-slate-800/60 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span>{step.title}</span>
              </div>

              <span className="font-mono text-[10px]">
                {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING...' : 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-5 pt-3 border-t border-slate-800">
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / WORKFLOW_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
