import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { RealityGapVisualizer } from '../components/RealityGapVisualizer.js';
import { EvidenceViewer } from '../components/EvidenceViewer.js';
import { BeforeAfterViewer } from '../components/BeforeAfterViewer.js';
import { AIEngineProgress } from '../components/AIEngineProgress.js';
import { ArchitectureModal } from '../components/ArchitectureModal.js';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  FileText, 
  Cloud,
  Layers,
  RotateCcw
} from 'lucide-react';

const DEMO_STORY = {
  policyTitle: 'Emergency Safety & Egress Standard',
  section: 'Section 4.2 — Egress Pathways',
  requirementTitle: 'Emergency Exit Door Clearance',
  requirementText: 'Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters.',
  location: 'Block B — Floor 2',
  beforeImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  afterImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
};

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);

  // Demo state entities
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [finding, setFinding] = useState<any>(null);
  const [action, setAction] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [humanSignedOff, setHumanSignedOff] = useState<boolean>(false);

  // Trigger Step 3 -> 4: AI SageMaker Analysis
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await api.analyzeInspection({
      policyId: 'pol-emergency-01',
      requirementId: 'req-em-01',
      location: DEMO_STORY.location,
      evidenceUrl: DEMO_STORY.beforeImageUrl,
      fileName: 'blocked-exit-b2.jpg',
      notes: 'Stacked delivery freight blocking door 2B',
      inspectorId: user?.id || 'usr-sarah-02',
      inspectorName: user?.name || 'Sarah Chen'
    });

    setAnalysisResult(result.inspection.analysisResult);
    setFinding(result.finding);
    setAction(result.correctiveAction);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setStep(4);
  };

  // Trigger Step 6 -> 7: Remediation Verification
  const handleVerifyRemediation = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      const result = await api.uploadRemediation({
        actionId: action?.id || 'ACT-2026-089',
        remediationImageUrl: DEMO_STORY.afterImageUrl,
        notes: 'Freight crates relocated to Storage Bay B-12. Corridor 100% unobstructed.',
        actor: user?.name || 'Marcus Vance'
      });

      setVerificationResult(result.verificationResult);
      setIsVerifying(false);
      setStep(7);
    }, 1800);
  };

  // Step 8: Human-In-The-Loop Signoff
  const handleHumanSignoff = async (approved: boolean) => {
    await api.humanConfirm({
      actionId: action?.id || 'ACT-2026-089',
      approved,
      actor: user?.name || 'Elena Rostova',
      actorRole: user?.role || 'MANAGER',
      notes: 'Sign-off confirmed. Photographic evidence meets NFPA and internal egress policy.'
    });

    setHumanSignedOff(true);
    setStep(8);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Top Banner */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
            <Play className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              GROUNDTRUTH LIVE INSPECTION DEMO
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Primary Demo Story
              </span>
            </h1>
            <p className="text-xs text-slate-400">Scenario: Blocked Emergency Exit in Block B — Floor 2</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowArchModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs border border-cyan-500/30 transition"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AWS Architecture</span>
          </button>
          <button
            onClick={() => {
              setStep(1);
              setAnalysisResult(null);
              setFinding(null);
              setAction(null);
              setVerificationResult(null);
              setHumanSignedOff(false);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Stepper Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[750px] text-xs font-mono">
          {[
            { num: 1, label: 'Policy Requirement' },
            { num: 2, label: 'Physical Evidence' },
            { num: 3, label: 'SageMaker AI' },
            { num: 4, label: 'Reality Gap' },
            { num: 5, label: 'Corrective Action' },
            { num: 6, label: 'Remediation Image' },
            { num: 7, label: 'AI Verification' },
            { num: 8, label: 'Human Closure' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num <= step) setStep(s.num);
              }}
              disabled={s.num > step}
              className={`flex items-center space-x-2 transition ${
                s.num === step
                  ? 'text-cyan-400 font-bold'
                  : s.num < step
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  s.num === step
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#06b6d4]'
                    : s.num < step
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {s.num < step ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Demo Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col justify-center">
        {/* STEP 1: Policy Ingestion */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Step 1 of 8</span>
                <h2 className="text-xl font-black text-white mt-0.5">Policy Requirement Loaded</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                Source: Emergency Safety Standard v3.4 PDF
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{DEMO_STORY.section}</span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-snug">
                "{DEMO_STORY.requirementText}"
              </h3>

              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                  Extracted Verification Hints:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Emergency exit door swing radius must remain unobstructed.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Corridor clearance width must measure &gt;= 1.2 meters.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Illuminated emergency exit sign must be active and visible.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Proceed to Evidence Capture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Physical Evidence */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Step 2 of 8</span>
                <h2 className="text-xl font-black text-white mt-0.5">Physical Photographic Evidence</h2>
              </div>
              <span className="text-xs font-mono text-slate-300">
                Location: {DEMO_STORY.location}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              <div className="aspect-video relative bg-black">
                <img
                  src={DEMO_STORY.beforeImageUrl}
                  alt="Blocked emergency exit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded bg-slate-950/80 backdrop-blur border border-slate-700 text-xs font-mono text-slate-300">
                  Uploaded via Pre-signed S3 URL • 2.4 MB JPEG
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Inspector: Sarah Chen (Site Compliance)</span>
                <span>Timestamp: 2026-09-20 10:12:00 UTC</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => {
                  setStep(3);
                  handleStartAnalysis();
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition group"
              >
                <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>RUN SAGE MAKER AI VERIFICATION</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SageMaker Inference Pipeline */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in max-w-2xl mx-auto w-full">
            <AIEngineProgress
              activeProvider="sagemaker"
              onComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {/* STEP 4: Reality Gap Result */}
        {step === 4 && analysisResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">Step 4 of 8 • Finding Created</span>
                <h2 className="text-xl font-black text-white mt-0.5">Reality Gap Detected</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
                {finding?.id || 'FND-2026-089'}
              </span>
            </div>

            {/* Signature Comparison Visualizer */}
            <RealityGapVisualizer
              expected={analysisResult.expectedCondition}
              observed={analysisResult.observedCondition}
              gapDetected={analysisResult.realityGapDetected}
              confidence={analysisResult.confidence}
              severity={analysisResult.severity}
              sourcePolicy={DEMO_STORY.policyTitle}
              sourceSection={DEMO_STORY.section}
            />

            {/* Visual Evidence Viewer with Bounding Regions */}
            <EvidenceViewer
              imageUrl={DEMO_STORY.beforeImageUrl}
              observations={analysisResult.observations}
            />

            {/* Duplicate & Recurring Issue Alert Banner */}
            {finding?.isRecurringIssue && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-200">
                    RECURRING ISSUE PATTERN IDENTIFIED ({DEMO_STORY.location})
                  </div>
                  <div className="text-slate-300 mt-0.5">
                    5 similar egress obstruction findings recorded at this location within 30 days. High semantic overlap (93%) with historical finding FND-2026-042.
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(5)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Generate Corrective Action</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Corrective Action Assignment */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Step 5 of 8</span>
                <h2 className="text-xl font-black text-white mt-0.5">Corrective Action Dispatched</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-slate-700 font-bold">
                {action?.id || 'ACT-2026-089'}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                  Priority: High Severity
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SLA Due: 24 Hours
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Clear Stored Freight Crates from Emergency Exit 2B
              </h3>
              <p className="text-sm text-slate-300">
                Immediately relocate all freight crates to designated Storage Bay B-12 and post floor warning stencil.
              </p>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Assigned To:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">Marcus Vance (Quality Assurance)</div>
                </div>
                <div>
                  <span className="text-slate-500">Target Location:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{DEMO_STORY.location}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(6)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Upload Field Remediation Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Remediation Photo */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Step 6 of 8</span>
                <h2 className="text-xl font-black text-white mt-0.5">Remediation Evidence Captured</h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Remediation Ready
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              <div className="aspect-video relative bg-black">
                <img
                  src={DEMO_STORY.afterImageUrl}
                  alt="Remediated clear exit"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded bg-slate-950/80 backdrop-blur border border-emerald-500/40 text-xs font-mono text-emerald-300">
                  Post-Remediation Photograph • Corridor Cleared
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Field Operator: Marcus Vance</span>
                <span>Notes: All boxes relocated to storage. Pathway clear.</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(5)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleVerifyRemediation}
                disabled={isVerifying}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/25 transition"
              >
                {isVerifying ? (
                  <span>Running AI Multi-Image Comparison...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>VERIFY REMEDIATION WITH SAGE MAKER</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Before / After Verification Engine */}
        {step === 7 && verificationResult && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Step 7 of 8 • AI Verification</span>
                <h2 className="text-xl font-black text-white mt-0.5">Before vs After Comparison Verified</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                COMPLIANT (97% Match)
              </span>
            </div>

            {/* Before vs After Signature Slider Viewer */}
            <BeforeAfterViewer
              beforeUrl={DEMO_STORY.beforeImageUrl}
              afterUrl={DEMO_STORY.afterImageUrl}
              beforeStatus="NON_COMPLIANT"
              afterStatus="COMPLIANT"
              confidence={0.97}
              summary="Remediation evidence demonstrates full resolution. Emergency exit doorway and 1.2m egress pathway are 100% unobstructed."
              notes="Clear passage restored to Emergency Safety Standard v3.4."
            />

            {/* Human-In-The-Loop Signoff Section */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>HUMAN-IN-THE-LOOP CONFIRMATION REQUIRED</span>
              </div>
              <p className="text-xs text-slate-300">
                High-impact safety findings require certified supervisor confirmation before formal audit trail closure.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleHumanSignoff(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                >
                  Reject & Request Rework
                </button>
                <button
                  onClick={() => handleHumanSignoff(true)}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFY & CLOSE FINDING</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Finding Closed & Audit Log Updated */}
        {step === 8 && (
          <div className="space-y-6 animate-fade-in text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-black text-white">
              Finding Successfully Closed & Logged
            </h2>
            <p className="text-slate-300 max-w-lg mx-auto text-sm">
              The full reality verification loop is complete: Policy → Physical Evidence → SageMaker Analysis → Action → Remediation Photo → Before/After AI Check → Human Sign-off → Immutable Audit Trail.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-slate-400">
              <div className="text-emerald-400 font-bold">✓ Audit Trail Entry Added:</div>
              <div>• Resource: {finding?.id || 'FND-2026-089'}</div>
              <div>• Signed off by: {user?.name || 'Elena Rostova'} ({user?.role || 'MANAGER'})</div>
              <div>• Dashboard Compliance Metric Recalculated</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                View Live Dashboard Metrics
              </button>
              <button
                onClick={() => navigate('/audit-log')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition"
              >
                Inspect Audit Trail
              </button>
            </div>
          </div>
        )}
      </main>

      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />
    </div>
  );
};
