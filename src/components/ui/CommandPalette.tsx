'use client';

import React, { useState, useEffect } from 'react';
import { StepId } from '@/lib/types';
import { Search, Rocket, Swords, Send, GitBranch, X, Layers, Compass, Code, Terminal } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (step: StepId) => void;
  onCreateRepo?: () => void;
  onLaunchMentor?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectStep,
  onCreateRepo,
  onLaunchMentor,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'step-input',
      title: 'Step 1: Idea Input & Scope',
      category: 'Workspace Navigation',
      icon: <Rocket className="w-4 h-4 text-brand-ember" />,
      shortcut: '1',
      run: () => { onSelectStep('input'); onClose(); },
    },
    {
      id: 'step-search',
      title: 'Step 2: DeepSearch Intelligence Dossier',
      category: 'Workspace Navigation',
      icon: <Search className="w-4 h-4 text-amber-molten" />,
      shortcut: '2',
      run: () => { onSelectStep('search'); onClose(); },
    },
    {
      id: 'step-gapmap',
      title: 'Step 3: Interactive Gap Map Topology',
      category: 'Workspace Navigation',
      icon: <Compass className="w-4 h-4 text-quenched-steel-light" />,
      shortcut: '3',
      run: () => { onSelectStep('gapmap'); onClose(); },
    },
    {
      id: 'step-devils',
      title: 'Step 4: Devil\'s Advocate Interrogation',
      category: 'Workspace Navigation',
      icon: <Swords className="w-4 h-4 text-brand-ember" />,
      shortcut: '4',
      run: () => { onSelectStep('devils'); onClose(); },
    },
    {
      id: 'step-blueprint',
      title: 'Step 5: Project HUB & Blueprint',
      category: 'Workspace Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      shortcut: '5',
      run: () => { onSelectStep('blueprint'); onClose(); },
    },
    {
      id: 'create-repo',
      title: 'Create Real GitHub Repository',
      category: 'Actions & Automation',
      icon: <GitBranch className="w-4 h-4 text-forge-white" />,
      shortcut: 'Ctrl+Shift+G',
      run: () => { if (onCreateRepo) onCreateRepo(); onClose(); },
    },
    {
      id: 'launch-mentor',
      title: 'Launch AI Telegram Mentor Agent',
      category: 'Actions & Automation',
      icon: <Send className="w-4 h-4 text-emerald-400" />,
      shortcut: 'Ctrl+Shift+T',
      run: () => { if (onLaunchMentor) onLaunchMentor(); onClose(); },
    },
  ];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-forge-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-forge-surface border border-brand-ember/40 rounded-blueprint shadow-2xl overflow-hidden z-10 space-y-0">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-quenched-steel/20 bg-forge-black/50">
          <Search className="w-5 h-5 text-brand-ember shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, navigate steps, or search workspace..."
            className="w-full bg-transparent text-sm font-sans font-medium text-forge-white focus:outline-none placeholder:text-zinc-500"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-forge-surface-light transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.run}
                className="w-full flex items-center justify-between px-4 py-3 rounded-blueprint text-left hover:bg-brand-ember/15 border border-transparent hover:border-brand-ember/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-forge-surface-light group-hover:bg-brand-ember/20 transition">
                    {action.icon}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-forge-white group-hover:text-brand-ember transition">
                      {action.title}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      {action.category}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-forge-black/60 px-2 py-1 rounded border border-quenched-steel/20 group-hover:border-brand-ember/40 transition">
                  {action.shortcut}
                </span>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No matching commands found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-forge-black/70 border-t border-quenched-steel/20 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span>Use ↑ ↓ to navigate, Enter to select</span>
          <span className="text-brand-ember font-bold">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
