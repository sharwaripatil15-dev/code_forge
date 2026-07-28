'use client';

import React from 'react';
import { StepId } from '@/lib/types';
import { Lightbulb, Search, Network, Swords, Rocket, Key, Layers } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectStep('input')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-lg tracking-tight text-white uppercase">
              <span>IDEA</span>
              <span className="text-brand-500">FORGE</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Research & Innovation Copilot</p>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800/90 p-1 rounded-2xl">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isDisabled = !hasInput && step.id !== 'input';

            return (
              <button
                key={step.id}
                disabled={isDisabled}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : isDisabled
                    ? 'text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition"
            title="Configure API Keys"
          >
            <Key className="w-3.5 h-3.5 text-brand-500" />
            <span className="hidden sm:inline font-medium">API Keys</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-xl text-xs font-semibold transition"
          >
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span>Live Hackathon MVP</span>
          </a>
        </div>
      </div>
    </header>
  );
}
