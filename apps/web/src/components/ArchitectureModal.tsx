import React from 'react';
import { X, Cloud, Server, Database, Cpu, Layers, Bell, Shield, Activity, GitCommit } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AWS_SERVICES = [
  { name: 'Amazon Amplify Hosting', category: 'Frontend', desc: 'Continuous deployment of React web app with global CloudFront CDN', icon: Cloud, badge: 'Edge' },
  { name: 'Amazon API Gateway', category: 'API Layer', desc: 'Secure, low-latency REST/HTTP entrypoint with rate-limiting & JWT validation', icon: Server, badge: 'Serverless' },
  { name: 'AWS Lambda', category: 'Compute', desc: 'Node.js 20 serverless microservices executing business logic and orchestrations', icon: Server, badge: 'Zero-Idle' },
  { name: 'AWS Step Functions', category: 'Orchestration', desc: 'Multi-step visual inspection state machine handling AI inference retry and state', icon: Layers, badge: 'Workflow' },
  { name: 'Amazon SageMaker AI', category: 'AI/ML', desc: 'Real-time hosted vision-language inference endpoint evaluating reality vs rules', icon: Cpu, badge: 'Multimodal' },
  { name: 'Amazon S3', category: 'Storage', desc: 'Encrypted object vault for policy PDFs, high-res evidence & remediation photos', icon: Database, badge: 'Presigned' },
  { name: 'Amazon DynamoDB', category: 'Database', desc: 'Single-digit ms latency single-table operational store with GSIs', icon: Database, badge: 'NoSQL' },
  { name: 'Amazon Cognito', category: 'Auth', desc: 'Enterprise user authentication, token verification, and role-based access control', icon: Shield, badge: 'RBAC' },
  { name: 'Amazon EventBridge', category: 'Eventing', desc: 'Domain event bus decoupling inspections, findings, and remediation pipelines', icon: GitCommit, badge: 'Event-Driven' },
  { name: 'Amazon SQS', category: 'Queues', desc: 'FIFO queue with Dead-Letter Queue (DLQ) for asynchronous inspection batching', icon: Layers, badge: 'Async' },
  { name: 'Amazon SNS', category: 'Alerts', desc: 'Push notifications and SMS/Email dispatch for critical severity safety gaps', icon: Bell, badge: 'Real-time' },
  { name: 'Amazon CloudWatch', category: 'Observability', desc: 'Centralized metrics, structured logs, alarms, and latency dashboards', icon: Activity, badge: 'Monitoring' }
];

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <Cloud className="w-4 h-4" />
            <span>AWS SHIP IT CLOUD ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            GroundTruth Production Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Purpose-built AWS serverless workflow: Evidence is stored in S3, Lambda & API Gateway handle the application layer, Step Functions orchestrates analysis, SageMaker AI performs inference, DynamoDB holds operational state, and EventBridge, SQS & SNS manage asynchronous events.
          </p>
        </div>

        {/* Architecture Pipeline Flow Visual */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[750px] gap-2 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 w-28 shrink-0">
              <div className="font-bold">Client / Browser</div>
              <div className="text-[10px] text-slate-400 mt-1">React + Vite</div>
            </div>
            <div className="text-cyan-500 font-bold">→</div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 w-28 shrink-0">
              <div className="font-bold">Amplify / CDN</div>
              <div className="text-[10px] text-slate-400 mt-1">CloudFront</div>
            </div>
            <div className="text-cyan-500 font-bold">→</div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 w-28 shrink-0">
              <div className="font-bold">API Gateway</div>
              <div className="text-[10px] text-slate-400 mt-1">HTTP REST API</div>
            </div>
            <div className="text-cyan-500 font-bold">→</div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 w-28 shrink-0">
              <div className="font-bold">AWS Lambda</div>
              <div className="text-[10px] text-slate-400 mt-1">Node 20 Serverless</div>
            </div>
            <div className="text-cyan-500 font-bold">→</div>
            <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/50 text-cyan-300 w-32 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <div className="font-bold">Step Functions</div>
              <div className="text-[10px] text-slate-400 mt-1">Orchestrator</div>
            </div>
            <div className="text-cyan-500 font-bold">→</div>
            <div className="p-3 rounded-lg bg-purple-950/60 border border-purple-500/50 text-purple-200 w-32 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <div className="font-bold">SageMaker AI</div>
              <div className="text-[10px] text-purple-400 mt-1">Vision Reasoner</div>
            </div>
          </div>
        </div>

        {/* 12 Core Services Grid */}
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider mb-4">
          Integrated AWS Services (12 Meaningful Components)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AWS_SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {svc.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-0.5">{svc.name}</h4>
                <div className="text-[11px] text-cyan-400 font-mono mb-1.5">{svc.category}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{svc.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
          <span>Participant: Pochiraju Kailash Ram Markandeya Sharma (@kailashsharma)</span>
          <span>Team: KGP_unknown_Coder_404 (BFZXQT)</span>
        </div>
      </div>
    </div>
  );
};
