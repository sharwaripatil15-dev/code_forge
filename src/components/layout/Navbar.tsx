'use client';

import React from 'react';
import { StepId } from '@/lib/types';
import { Lightbulb, Search, Network, Swords, Rocket, Key, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  onOpenKeyModal: () => void;
  hasInput: boolean;
}

const STEPS: { id: StepId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'input', label: '1. Idea Input', icon: Lightbulb },
  { id: 'search', label: '2. DeepSearch', icon: Search },
  { id: 'gapmap', label: '3. Gap Map', icon: Network },
  { id: 'devils', label: '4. Devil\'s Advocate', icon: Swords },
  { id: 'blueprint', label: '5. Project HUB', icon: Rocket },
];

export default function Navbar({ currentStep, onSelectStep, onOpenKeyModal, hasInput }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#08080a]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectStep('input')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-xl tracking-tight text-white uppercase">
              <span>IDEA</span>
              <span className="text-brand-500">FORGE</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">Research & Innovation Copilot</p>
          </div>
        </div>

        {/* Spacious Step Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800/90 p-1.5 rounded-2xl shadow-inner">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDisabled = !hasInput && step.id !== 'input';

            return (
              <button
                key={step.id}
                disabled={isDisabled}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                    : isDisabled
                    ? 'text-zinc-600 cursor-not-allowed opacity-50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 transition shadow-sm"
          >
            <Key className="w-4 h-4 text-brand-500" />
            <span className="hidden sm:inline">API Settings</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-xl text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span>iNSIGHTS Track</span>
          </div>
        </div>
      </div>
    </header>
  );
}
