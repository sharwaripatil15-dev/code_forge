'use client';

import React, { useState } from 'react';
import { DeepSearchState } from '@/lib/types';
import { PanelLeftOpen, PanelLeftClose, Plus, Layers, Sparkles, Clock, ChevronRight, Database, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface PlanHistorySidebarProps {
  plans: DeepSearchState[];
  currentPlanId?: string;
  onSelectPlan: (plan: DeepSearchState) => void;
  onNewIdea: () => void;
  onDeletePlan?: (planId: string) => void;
}

export function PlanHistorySidebar({
  plans,
  currentPlanId,
  onSelectPlan,
  onNewIdea,
  onDeletePlan,
}: PlanHistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <>
      {/* 1. Slim Collapsed Toggle Button floating on top-left edge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 sm:top-24 left-3 sm:left-4 z-30 min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-forge-surface/95 border border-brand-ember/40 text-brand-ember hover:bg-brand-ember/20 shadow-xl transition-all group backdrop-blur-md flex items-center justify-center"
          title="Open Plan History Sidebar"
          aria-label="Open Plan History Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="sr-only">Open History</span>
        </button>
      )}

      {/* 2. Backdrop Overlay when expanded */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-forge-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. Sliding Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-full sm:w-88 bg-forge-surface/95 border-r border-quenched-steel/30 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out backdrop-blur-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-quenched-steel/20 flex items-center justify-between gap-3 bg-forge-black/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-brand-ember/15 border border-brand-ember/30 text-brand-ember shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-display font-bold text-forge-white uppercase tracking-wider truncate">
                Plan History
              </h2>
              <p className="text-[10px] font-mono text-zinc-400 truncate">
                Synced with Supabase DB
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-forge-surface-light transition shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Close Sidebar"
          >
            <PanelLeftClose className="w-5 h-5 text-brand-ember" />
          </button>
        </div>

        {/* New Idea Button (Same pattern as New Chat) */}
        <div className="p-4 border-b border-quenched-steel/20 bg-forge-black/20">
          <button
            onClick={() => {
              onNewIdea();
              setIsOpen(false);
            }}
            className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-blueprint bg-brand-ember hover:bg-brand-ember-light text-white font-mono font-bold text-xs shadow-md shadow-brand-ember/25 transition-all group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>+ New Idea</span>
          </button>
        </div>

        {/* Saved Plans List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono font-bold text-quenched-steel-light uppercase tracking-wider">
            <span>Saved Supabase Plans ({plans.length})</span>
            <Database className="w-3 h-3 text-emerald-400" />
          </div>

          {plans.length > 0 ? (
            plans.map((plan, index) => {
              const isSelected = currentPlanId === plan.id || (!currentPlanId && index === 0);
              const score = (plan.metrics as any)?.overallNoveltyScore || plan.metrics?.noveltyScore || plan.metrics?.feasibilityScore || 85;

              return (
                <div
                  key={plan.id || index}
                  onClick={() => {
                    onSelectPlan(plan);
                    setIsOpen(false);
                  }}
                  className={`group relative p-3.5 rounded-blueprint border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-ember/15 border-brand-ember/50 shadow-md shadow-brand-ember/10'
                      : 'bg-forge-black/40 border-quenched-steel/20 hover:border-brand-ember/40 hover:bg-forge-surface-light/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-display font-bold text-forge-white truncate group-hover:text-brand-ember transition">
                        {plan.blueprint?.title || plan.input?.idea || 'Untitled Plan'}
                      </h4>
                      <p className="text-[11px] font-sans text-zinc-400 line-clamp-1 mt-0.5">
                        {plan.input?.idea || plan.blueprint?.tagline}
                      </p>
                    </div>

                    <Badge
                      variant={score >= 80 ? 'ember' : 'quenched'}
                      size="sm"
                      className="shrink-0 text-[9px] font-mono px-1.5 py-0.5"
                    >
                      {score}/100
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-zinc-500 pt-2 border-t border-quenched-steel/15">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-quenched-steel-light" />
                      <span>{formatDate(plan.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-brand-ember opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Load</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-quenched-steel-light mx-auto animate-pulse" />
              <p className="text-xs font-mono text-zinc-400">
                No past plans yet. Submit an idea above to generate your first research blueprint!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-quenched-steel/20 bg-forge-black/60 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
          <span>IdeaForge AI Copilot</span>
          <span className="text-emerald-400 font-bold">Postgres RLS Active</span>
        </div>
      </aside>
    </>
  );
}
