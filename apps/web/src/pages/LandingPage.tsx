import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { RealityGapVisualizer } from '../components/RealityGapVisualizer.js';
import { ArchitectureModal } from '../components/ArchitectureModal.js';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Eye, 
  AlertTriangle, 
  Wrench, 
  CheckCircle2, 
  Layers, 
  Cloud, 
  Cpu, 
  BarChart2, 
  PlayCircle 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [showArch, setShowArch] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-rose-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-md shadow-cyan-950">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AWS FIRST COMMIT 2026 • SHIP IT TRACK</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
              Does reality actually <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                match the rules?
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
              Turn policies, SOPs, and operational standards into continuous, evidence-backed reality checks with Amazon SageMaker AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition group"
              >
                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>RUN A LIVE INSPECTION</span>
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center space-x-2 transition"
              >
                <span>EXPLORE DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* Signature Hero Visual: POLICY vs REALITY */}
          <div className="max-w-5xl mx-auto mt-6">
            <RealityGapVisualizer
              expected="Emergency exits and designated egress pathways must remain unobstructed at all times across a minimum width of 1.2 meters."
              observed="Stack of 4 shipping crates and packing materials obstructing ~70% of doorway threshold. Egress width reduced to 0.38 meters."
              gapDetected={true}
              confidence={0.94}
              severity="HIGH"
              sourcePolicy="Emergency Safety Standard v3.4"
              sourceSection="Section 4.2"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              THE REAL-WORLD PROBLEM
            </h2>
            <h3 className="text-3xl font-black text-white">
              Documentation describes what SHOULD happen. <br />
              The physical world is often completely different.
            </h3>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">
              Organizations spend millions drafting safety standards, SOPs, and checklists, but checking compliance still relies on spreadsheets, WhatsApp photos, and scattered paper audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Fragmented Evidence</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Photos lost in chat threads and personal phones with no cryptographic link to policy requirements or locations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Unverified Remediation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Issues marked "resolved" in spreadsheets without physical before-and-after photographic verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Zero Institutional Memory</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                No systemic detection of recurring failure hotspots (e.g. the same emergency exit blocked 5 times in 30 days).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution: The GroundTruth Workflow */}
      <section id="workflow" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              THE GROUNDTRUTH PIPELINE
            </h2>
            <h3 className="text-3xl font-black text-white">
              Turn policies into evidence. Turn gaps into action.
            </h3>
            <p className="text-slate-400 mt-3 text-sm">
              An evidence-driven continuous verification workflow built on Amazon SageMaker AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-3 border border-cyan-500/40">
                1
              </div>
              <h5 className="text-sm font-bold text-white mb-1">Policy Ingestion</h5>
              <p className="text-xs text-slate-400">PDF/DOCX normalized into structured visual rules.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-3 border border-cyan-500/40">
                2
              </div>
              <h5 className="text-sm font-bold text-white mb-1">Evidence Capture</h5>
              <p className="text-xs text-slate-400">Site photos uploaded securely via S3 presigned URLs.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-200 flex flex-col items-center shadow-lg shadow-cyan-950/50">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs mb-3 border border-purple-500/40">
                3
              </div>
              <h5 className="text-sm font-bold text-white mb-1">SageMaker AI</h5>
              <p className="text-xs text-slate-400">Grounded visual reasoning detects reality gaps.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs mb-3 border border-cyan-500/40">
                4
              </div>
              <h5 className="text-sm font-bold text-white mb-1">Action & Fix</h5>
              <p className="text-xs text-slate-400">Corrective actions assigned to field teams.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/40 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs mb-3 border border-emerald-500/40">
                5
              </div>
              <h5 className="text-sm font-bold text-white mb-1">AI Verification</h5>
              <p className="text-xs text-slate-400">Before & after image comparison + human sign-off.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AWS Cloud Architecture Banner */}
      <section className="py-16 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-2">
              <Cloud className="w-4 h-4" />
              <span>Production AWS Architecture</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Built natively for AWS Ship It
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Every AWS component is architecturally intentional: Amplify, API Gateway, Lambda, Step Functions, SageMaker AI, S3, DynamoDB, Cognito, EventBridge, SQS, SNS, and CloudWatch.
            </p>
          </div>

          <button
            onClick={() => setShowArch(true)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-2 shrink-0 transition shadow-lg shadow-cyan-950"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>VIEW 30-SEC AWS ARCHITECTURE</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#070A0F] border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">GROUNDTRUTH</span>
            <span>— Reality Verification Platform</span>
          </div>
          <div className="text-center sm:text-right font-mono text-[11px]">
            <span>First Commit 2026 (Bharat Builds Tour) • Solo Participant: </span>
            <span className="text-slate-300 font-bold">Pochiraju Kailash Ram Markandeya Sharma</span>
            <span> • Team: KGP_unknown_Coder_404 (BFZXQT)</span>
          </div>
        </div>
      </footer>

      <ArchitectureModal isOpen={showArch} onClose={() => setShowArch(false)} />
    </div>
  );
};
