import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, PlayCircle, Cloud, ArrowRight, LayoutDashboard } from 'lucide-react';
import { ArchitectureModal } from '../ArchitectureModal.js';
import { useAuth } from '../../contexts/AuthContext.js';

export const Navbar: React.FC = () => {
  const [showArch, setShowArch] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  GROUND<span className="text-cyan-400">TRUTH</span>
                </span>
                <span className="block text-[9px] font-mono text-slate-400 tracking-wider uppercase -mt-1">
                  AI Reality Verification
                </span>
              </div>
            </Link>

            {/* Middle Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <Link to="/#problem" className="hover:text-cyan-400 transition">Problem</Link>
              <Link to="/#solution" className="hover:text-cyan-400 transition">Solution</Link>
              <Link to="/#workflow" className="hover:text-cyan-400 transition">How It Works</Link>
              <button
                onClick={() => setShowArch(true)}
                className="flex items-center space-x-1.5 hover:text-cyan-400 transition"
              >
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>AWS Architecture</span>
              </button>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center space-x-3">
              <Link
                to="/demo"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30 transition"
              >
                <PlayCircle className="w-4 h-4" />
                <span>3-Min Live Demo</span>
              </Link>

              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Enter App</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ArchitectureModal isOpen={showArch} onClose={() => setShowArch(false)} />
    </>
  );
};
