import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { ArchitectureModal } from '../ArchitectureModal.js';
import { api } from '../../services/api.js';
import { 
  Cloud, 
  Cpu, 
  User, 
  ChevronDown, 
  Bell, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, personas, switchPersona, logout } = useAuth();
  const [showArch, setShowArch] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'sagemaker' | 'demo'>(api.getAIProvider());

  const handleProviderToggle = async (provider: 'sagemaker' | 'demo') => {
    setActiveProvider(provider);
    await api.setAIProvider(provider);
  };

  return (
    <>
      <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left Status Badges */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowArch(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-400 font-mono font-medium border border-cyan-500/30 transition"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AWS Ship It Stack</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* AI Provider Indicator with Notice Badge */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-500 px-2">AI:</span>
            <button
              onClick={() => handleProviderToggle('sagemaker')}
              className={`px-2 py-0.5 rounded transition ${
                activeProvider === 'sagemaker'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SageMaker AI
            </button>
            <button
              onClick={() => handleProviderToggle('demo')}
              className={`px-2 py-0.5 rounded transition ${
                activeProvider === 'demo'
                  ? 'bg-amber-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo Mode
            </button>
          </div>

          {activeProvider === 'demo' && (
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
              Demo inference mode (Deterministic)
            </span>
          )}
        </div>

        {/* Right Controls: Persona Switcher & Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs transition"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-[10px] border border-cyan-500/40">
                {user?.name.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-100 text-xs">{user?.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 -mt-0.5">{user?.role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Persona Dropdown Menu */}
            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Demo Persona (Cognito Roles)
                </div>
                <div className="py-1 space-y-1">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                        user?.id === p.id
                          ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.department}</div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                        {p.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-1 mt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ArchitectureModal isOpen={showArch} onClose={() => setShowArch(false)} />
    </>
  );
};
