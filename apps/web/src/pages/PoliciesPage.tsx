import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { Policy, Category } from '@groundtruth/shared';
import { useAuth } from '../contexts/AuthContext.js';
import { 
  BookOpen, 
  Search, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ArrowRight,
  Plus,
  Loader2
} from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Safety');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX' | 'TXT'>('PDF');

  useEffect(() => {
    api.getPolicies().then(setPolicies);
  }, []);

  const handleUploadPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsUploading(true);

    const newPolicy = await api.uploadPolicy({
      title,
      description: description || 'Ingested standard operational procedure',
      category,
      fileName: `${title.toLowerCase().replace(/\s+/g, '-')}.${fileFormat.toLowerCase()}`,
      fileFormat,
      actor: user?.name || 'Pochiraju Kailash'
    });

    setPolicies([newPolicy, ...policies]);
    setIsUploading(false);
    setShowUploadModal(false);
    setTitle('');
    setDescription('');
  };

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Policy & SOP Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized repository of safety manuals, maintenance SOPs, and accessibility standards with automated requirement extraction.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Policy Document</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search policies by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {['ALL', 'Safety', 'Accessibility', 'Maintenance', 'Operations'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {policy.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 ml-2">
                      {policy.version}
                    </span>
                  </div>
                </div>

                <span className="flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{policy.status}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {policy.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                {policy.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400 space-x-4">
                <span>Requirements: <strong className="text-slate-200">{policy.requirementsCount}</strong></span>
                <span>Active Gaps: <strong className="text-rose-400">{policy.activeFindingsCount}</strong></span>
              </div>

              <Link
                to={`/policies/${policy.id}`}
                className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono"
              >
                <span>View Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Upload Policy / SOP Document
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Upload PDF, DOCX, or TXT. The Step Functions pipeline will extract and normalize requirements into DynamoDB.
            </p>

            <form onSubmit={handleUploadPolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous Chemical Handling SOP"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of policy scope and compliance targets..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Operations">Operations</option>
                    <option value="Security">Security</option>
                    <option value="Hygiene">Hygiene</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Format</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word DOCX</option>
                    <option value="TXT">Plain Text Checklist</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950 text-center text-xs text-slate-400 cursor-pointer hover:border-cyan-500 transition">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-1.5" />
                <span>Drag & drop source document, or click to browse</span>
                <span className="block text-[10px] text-slate-500 mt-1">S3 encrypted object storage</span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Requirements...</span>
                    </>
                  ) : (
                    <span>Process & Index Policy</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [policy, setPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    const targetId = id || 'pol-emergency-01';
    api.getPolicyById(targetId).then((p) => {
      if (p) setPolicy(p);
    });
  }, [id]);

  if (!policy) {
    return <div className="text-cyan-400 font-mono text-xs">Loading Policy Details...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400 mb-2">
          <span>{policy.category}</span>
          <span>•</span>
          <span>{policy.version}</span>
          <span>•</span>
          <span className="text-emerald-400">{policy.status}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">{policy.title}</h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{policy.description}</p>
      </div>

      {/* Structured Requirements List */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
          Normalized Visual & Procedural Requirements ({policy.requirements?.length || 0})
        </h2>

        <div className="space-y-4">
          {policy.requirements?.map((req) => (
            <div key={req.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {req.sourceSection}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  req.defaultSeverity === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : req.defaultSeverity === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {req.defaultSeverity} SEVERITY
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{req.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "{req.requirementText}"
              </p>

              <div className="pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-500 font-mono block mb-1">Verification Hints:</span>
                <ul className="space-y-1 text-slate-400">
                  {req.verificationHints.map((hint, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
