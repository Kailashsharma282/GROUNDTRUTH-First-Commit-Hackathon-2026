import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { Policy, PolicyRequirement, LocationMemory } from '@groundtruth/shared';
import { AIEngineProgress } from '../components/AIEngineProgress.js';
import { RealityGapVisualizer } from '../components/RealityGapVisualizer.js';
import { EvidenceViewer } from '../components/EvidenceViewer.js';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  Scan, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Cpu, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const NewInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [requirements, setRequirements] = useState<PolicyRequirement[]>([]);
  const [locations, setLocations] = useState<LocationMemory[]>([]);

  // Selection states
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('pol-emergency-01');
  const [selectedReqId, setSelectedReqId] = useState<string>('req-em-01');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80');
  const [locationName, setLocationName] = useState<string>('Block B — Floor 2');
  const [notes, setNotes] = useState<string>('Observed obstruction in exit corridor');

  // Analysis result states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [createdFinding, setCreatedFinding] = useState<any>(null);

  useEffect(() => {
    api.getPolicies().then(setPolicies);
    api.getRequirements().then(setRequirements);
    api.getLocations().then(setLocations);
  }, []);

  const activePolicy = policies.find(p => p.id === selectedPolicyId);
  const filteredRequirements = requirements.filter(r => r.policyId === selectedPolicyId);
  const activeRequirement = requirements.find(r => r.id === selectedReqId) || filteredRequirements[0];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await api.analyzeInspection({
      policyId: selectedPolicyId,
      requirementId: selectedReqId,
      location: locationName,
      evidenceUrl,
      fileName: 'inspection-evidence.jpg',
      notes,
      inspectorId: user?.id || 'usr-sarah-02',
      inspectorName: user?.name || 'Sarah Chen'
    });

    setAnalysisResult(result.inspection.analysisResult);
    setCreatedFinding(result.finding);
  };

  const handleAnalysisCompleted = () => {
    setIsAnalyzing(false);
    setStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-cyan-400" />
            <span>New Reality Verification Inspection</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            5-Step Guided Inspection Wizard: Policy → Requirement → Evidence → Location → SageMaker Analysis
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
          Step {step} of 5
        </span>
      </div>

      {/* STEP 1: Select Policy */}
      {step === 1 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Step 1: Select Source Policy / SOP Standard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPolicyId(p.id);
                  const firstReq = requirements.find(r => r.policyId === p.id);
                  if (firstReq) setSelectedReqId(firstReq.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPolicyId === p.id
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm mb-1 text-white">
                  <span>{p.title}</span>
                  <span className="text-xs font-mono text-cyan-400">{p.category}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2"
            >
              <span>Next: Select Requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Requirement */}
      {step === 2 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Step 2: Select Documented Requirement to Verify
          </h2>

          <div className="space-y-3">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReqId(req.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedReqId === req.id
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-400 font-bold">{req.title}</span>
                  <span className="text-slate-500">{req.sourceSection}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">"{req.requirementText}"</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2"
            >
              <span>Next: Add Physical Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Add Evidence */}
      {step === 3 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Step 3: Capture / Upload Photographic Evidence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-300">Select Preset or Upload Photo</label>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEvidenceUrl('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80')}
                  className={`w-full p-2.5 rounded-lg text-left border ${
                    evidenceUrl.includes('1586528116311') ? 'bg-cyan-950 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Blocked Emergency Exit Photo (High Obstruction)
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80')}
                  className={`w-full p-2.5 rounded-lg text-left border ${
                    evidenceUrl.includes('1621905251189') ? 'bg-cyan-950 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Electrical Switchgear Panel Photo (Conductive Ladder)
                </button>
                <button
                  type="button"
                  onClick={() => setEvidenceUrl('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80')}
                  className={`w-full p-2.5 rounded-lg text-left border ${
                    evidenceUrl.includes('1513694203232') ? 'bg-cyan-950 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Accessibility Ramp Photo (Missing Handrail)
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Inspector Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional context for SageMaker multimodal prompt..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
              <img src={evidenceUrl} alt="Inspection Evidence" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2"
            >
              <span>Next: Set Location & Trigger AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Location & Trigger Analysis */}
      {step === 4 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h2 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Step 4: Facility Location & Analysis Trigger
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Facility Location *</label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.building})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
              <div>• Policy: {activePolicy?.title}</div>
              <div>• Requirement: {activeRequirement?.title}</div>
              <div>• Inspector: {user?.name || 'Sarah Chen'}</div>
            </div>
          </div>

          {isAnalyzing ? (
            <AIEngineProgress onComplete={handleAnalysisCompleted} />
          ) : (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleStartAnalysis}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition"
              >
                <Cpu className="w-4 h-4" />
                <span>START SAGE MAKER AI ANALYSIS</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Analysis Findings Output */}
      {step === 5 && analysisResult && (
        <div className="space-y-6">
          <RealityGapVisualizer
            expected={analysisResult.expectedCondition}
            observed={analysisResult.observedCondition}
            gapDetected={analysisResult.realityGapDetected}
            confidence={analysisResult.confidence}
            severity={analysisResult.severity}
            sourcePolicy={activePolicy?.title}
            sourceSection={activeRequirement?.sourceSection}
          />

          <EvidenceViewer
            imageUrl={evidenceUrl}
            observations={analysisResult.observations}
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate('/findings')}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              View in Findings Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
