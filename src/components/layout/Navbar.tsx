'use client';

import React from 'react';
import { StepId } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Lightbulb, Search, Network, Swords, Rocket, Layers, Check, Command, Sun, Palette, User, ShieldCheck, type LucideIcon } from 'lucide-react';

interface NavbarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  onOpenCommandPalette: () => void;
  onOpenAuthModal?: () => void;
  hasInput: boolean;
  activeTheme?: string;
  onToggleTheme?: () => void;
  userEmail?: string;
  isLoggedIn?: boolean;
}

const STEP_ORDER: StepId[] = ['input', 'search', 'gapmap', 'devils', 'blueprint', 'mentor'];

const STEPS: { id: StepId; label: string; icon: LucideIcon }[] = [
  { id: 'input', label: '1. Idea Input', icon: Lightbulb },
  { id: 'search', label: '2. DeepSearch', icon: Search },
  { id: 'gapmap', label: '3. Gap Map', icon: Network },
  { id: 'devils', label: "4. Devil's Advocate", icon: Swords },
  { id: 'blueprint', label: '5. Project HUB', icon: Rocket },
];


export default function Navbar({
  currentStep,
  onSelectStep,
  onOpenCommandPalette,
  onOpenAuthModal,
  hasInput,
  activeTheme,
  onToggleTheme,
  userEmail,
  isLoggedIn,
}: NavbarProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-quenched-steel/20 bg-forge-black/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectStep('input')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectStep('input')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-blueprint bg-gradient-to-br from-brand-ember via-amber-molten to-quenched-steel flex items-center justify-center text-white shadow-md shadow-brand-ember/20 group-hover:scale-105 transition-transform border border-brand-ember/40 shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 font-display font-bold text-lg sm:text-xl tracking-tight text-forge-white uppercase leading-none">
                <span>IDEA</span>
                <span className="text-brand-ember">FORGE</span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-quenched-steel-light font-bold tracking-wider uppercase whitespace-nowrap mt-0.5">
                Research. Build. Impact.
              </p>
            </div>
          </div>

          {/* Desktop 5-Step Stepper Bar */}
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
                    className={`h-9 px-3.5 inline-flex items-center justify-center gap-2 rounded-lg text-xs font-mono font-bold transition-all duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-brand-ember group min-h-[44px] ${
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

            <div className="h-5 w-px bg-quenched-steel/30 mx-2.5 shrink-0" />

            {/* Command K Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="h-9 px-3 inline-flex items-center gap-2 rounded-lg bg-forge-surface-light border border-quenched-steel/30 text-xs font-mono text-zinc-300 hover:text-white hover:border-brand-ember/50 transition min-h-[44px]"
            >
              <Command className="w-3.5 h-3.5 text-brand-ember" />
              <span className="font-bold">Cmd+K</span>
            </button>

            {/* Theme Switcher Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-forge-surface-light border border-quenched-steel/30 text-xs font-mono text-zinc-300 hover:text-white hover:border-brand-ember/50 transition min-h-[44px]"
                title="Toggle Theme"
              >
                <Palette className="w-3.5 h-3.5 text-amber-molten" />
                <span className="capitalize text-[11px] font-bold">{activeTheme || 'Forge'}</span>
              </button>
            )}

            {/* Auth Trigger */}
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className={`h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border text-xs font-mono transition min-h-[44px] ${
                  isLoggedIn
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                    : 'bg-brand-ember/15 border-brand-ember/30 text-brand-ember hover:bg-brand-ember/25'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[110px]">{userEmail ? userEmail.split('@')[0] : 'Magic Link'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls for Mobile/Tablet */}
          <div className="flex items-center gap-2 shrink-0 lg:hidden">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-lg bg-forge-surface border border-quenched-steel/30 text-amber-molten min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Toggle Theme"
              >
                <Palette className="w-4 h-4" />
              </button>
            )}

            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="p-2.5 rounded-lg bg-forge-surface border border-quenched-steel/30 text-brand-ember min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Account Auth"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenCommandPalette}
              className="p-2.5 rounded-lg bg-forge-surface border border-brand-ember/40 text-brand-ember min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Command Palette"
            >
              <Command className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Touch Horizontal Stepper Strip */}
        <div className="lg:hidden py-2 border-t border-quenched-steel/15 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 px-1">
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
                className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-brand-ember text-white shadow-md border border-brand-ember/50'
                    : isCompleted
                    ? 'bg-quenched-steel/20 text-quenched-steel-light border border-quenched-steel/30'
                    : isDisabled
                    ? 'text-zinc-600 opacity-40 cursor-not-allowed'
                    : 'text-zinc-400 hover:text-white bg-forge-surface'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
