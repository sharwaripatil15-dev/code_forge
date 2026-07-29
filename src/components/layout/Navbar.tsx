'use client';

import React from 'react';
import { StepId } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Lightbulb, Search, Network, Swords, Rocket, Key, Layers, Check, Command, Sun, Palette, type LucideIcon } from 'lucide-react';

interface NavbarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  onOpenKeyModal: () => void;
  onOpenCommandPalette: () => void;
  hasInput: boolean;
  activeTheme?: string;
  onToggleTheme?: () => void;
}

const STEP_ORDER: StepId[] = ['input', 'search', 'gapmap', 'devils', 'blueprint', 'mentor'];

const STEPS: { id: StepId; label: string; icon: LucideIcon }[] = [
  { id: 'input', label: '1. Idea Input', icon: Lightbulb },
  { id: 'search', label: '2. DeepSearch', icon: Search },
  { id: 'gapmap', label: '3. Gap Map', icon: Network },
  { id: 'devils', label: "4. Devil's Advocate", icon: Swords },
  { id: 'blueprint', label: '5. Project HUB', icon: Rocket },
];


export default function Navbar({ currentStep, onSelectStep, onOpenKeyModal, hasInput }: NavbarProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-quenched-steel/20 bg-forge-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Split-Brain Anvil Forge Concept */}
        <div 
          onClick={() => onSelectStep('input')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectStep('input')}
        >
          <div className="w-10 h-10 rounded-blueprint bg-gradient-to-br from-brand-ember via-amber-molten to-quenched-steel flex items-center justify-center text-white shadow-md shadow-brand-ember/20 group-hover:scale-105 transition-transform border border-brand-ember/40 shrink-0">
            <Layers className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-display font-bold text-xl tracking-tight text-forge-white uppercase leading-none">
              <span>IDEA</span>
              <span className="text-brand-ember">FORGE</span>
            </div>
            <p className="text-[10px] font-mono text-quenched-steel-light font-bold tracking-wider uppercase whitespace-nowrap mt-1">
              Research. Build. Impact.
            </p>
          </div>
        </div>

        {/* Schematic 5-Step Navigation Bar */}
        <nav className="hidden lg:flex items-center bg-forge-surface/80 border border-quenched-steel/25 p-1.5 rounded-blueprint shadow-inner">
          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const stepIndex = STEP_ORDER.indexOf(step.id);
              const isCompleted = stepIndex < currentIndex;
              const isCurrent = stepIndex === currentIndex;
              const isDisabled = !hasInput && step.id !== 'input';

              return (
                <button
                  key={step.id}
                  disabled={isDisabled}
                  onClick={() => onSelectStep(step.id)}
                  className={`h-9 px-3.5 inline-flex items-center justify-center gap-2 rounded-lg text-xs font-mono font-bold transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-brand-ember group ${
                    isCurrent
                      ? 'bg-brand-ember text-white shadow-md shadow-brand-ember/25 border border-brand-ember/50'
                      : isCompleted
                      ? 'bg-quenched-steel/20 text-quenched-steel-light border border-quenched-steel/30 hover:bg-quenched-steel/30 hover:text-forge-white'
                      : isDisabled
                      ? 'text-zinc-600 border border-transparent cursor-not-allowed opacity-40'
                      : 'text-zinc-400 border border-transparent hover:text-forge-white hover:bg-forge-surface-light'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-quenched-steel-light group-hover:text-forge-white'}`} strokeWidth={2} />
                  )}
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Thin Vertical Rule Divider between Stepper & Utility Controls */}
          <div className="h-5 w-px bg-quenched-steel/30 mx-2.5 shrink-0" />

          {/* Command K Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="h-9 px-3 inline-flex items-center gap-2 rounded-lg bg-forge-surface-light border border-quenched-steel/30 text-xs font-mono text-zinc-300 hover:text-white hover:border-brand-ember/50 transition"
          >
            <Command className="w-3.5 h-3.5 text-brand-ember" />
            <span className="font-bold">Cmd+K</span>
          </button>

          {/* Theme Switcher Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-forge-surface-light border border-quenched-steel/30 text-xs font-mono text-zinc-300 hover:text-white hover:border-brand-ember/50 transition"
              title="Toggle Theme (Forge Dark / Steel Blueprint / Cyberpunk)"
            >
              <Palette className="w-3.5 h-3.5 text-amber-molten" />
              <span className="capitalize text-[11px] font-bold">{activeTheme || 'Forge'}</span>
            </button>
          )}

          {/* Utility Action inside Stepper Bar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenKeyModal}
            leftIcon={<Key className="w-3.5 h-3.5 text-brand-ember" strokeWidth={2} />}
            className="h-9 px-3 text-xs font-mono text-quenched-steel-light hover:text-forge-white"
          >
            API Keys
          </Button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCommandPalette}
            className="lg:hidden p-2 rounded-lg bg-forge-surface border border-quenched-steel/30 text-brand-ember"
          >
            <Command className="w-4 h-4" />
          </button>

          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenKeyModal}
              leftIcon={<Key className="w-3.5 h-3.5 text-brand-ember" strokeWidth={2} />}
            >
              <span className="font-mono text-xs">API Keys</span>
            </Button>
          </div>

          <Badge variant="quenched" pulse className="hidden sm:inline-flex">
            iNSIGHTS Track
          </Badge>
        </div>
      </div>
    </header>
  );
}
