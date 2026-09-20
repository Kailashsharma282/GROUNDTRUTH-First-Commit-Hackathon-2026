import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, PlayCircle, Cloud, ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { ArchitectureModal } from '../ArchitectureModal.js';
import { useAuth } from '../../contexts/AuthContext.js';

export const Navbar: React.FC = () => {
  const [showArch, setShowArch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
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

            {/* Middle Desktop Links */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <button
                onClick={() => scrollToSection('problem')}
                className="hover:text-cyan-400 transition"
              >
                Problem
              </button>
              <button
                onClick={() => scrollToSection('solution')}
                className="hover:text-cyan-400 transition"
              >
                Solution
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="hover:text-cyan-400 transition"
              >
                How It Works
              </button>
              <button
                onClick={() => setShowArch(true)}
                className="flex items-center space-x-1.5 hover:text-cyan-400 transition text-cyan-400"
              >
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>AWS Architecture</span>
              </button>
            </div>

            {/* Right CTAs */}
            <div className="hidden sm:flex items-center space-x-3">
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

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-fade-in text-xs font-medium text-slate-200">
            <button
              onClick={() => scrollToSection('problem')}
              className="block w-full text-left py-2 hover:text-cyan-400"
            >
              Problem
            </button>
            <button
              onClick={() => scrollToSection('solution')}
              className="block w-full text-left py-2 hover:text-cyan-400"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="block w-full text-left py-2 hover:text-cyan-400"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowArch(true);
              }}
              className="flex items-center space-x-2 w-full text-left py-2 text-cyan-400"
            >
              <Cloud className="w-4 h-4" />
              <span>AWS Architecture Modal</span>
            </button>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-slate-800 text-cyan-400 font-mono font-bold"
              >
                <PlayCircle className="w-4 h-4" />
                <span>3-Min Live Demo</span>
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Enter Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <ArchitectureModal isOpen={showArch} onClose={() => setShowArch(false)} />
    </>
  );
};
