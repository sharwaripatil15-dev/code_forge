'use client';

import React, { useState } from 'react';
import { ProjectMilestone } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckSquare, Sliders, Plus, Trash2, Clock, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface SprintMilestonesCustomizerProps {
  initialMilestones: ProjectMilestone[];
}

// Preset Sprint Timelines
const SPRINT_PRESETS: Record<string, { label: string; durationLabel: string; milestones: ProjectMilestone[] }> = {
  '24h': {
    label: '24-Hour Hackathon Sprint',
    durationLabel: '24 Hours',
    milestones: [
      {
        week: 1,
        title: 'Phase 1: Architecture & API Schemas',
        duration: 'Hours 0–4',
        actionableSteps: ['Define AST parser endpoints', 'Setup Next.js 14 boilerplate', 'Configure Gemini API keys'],
        deliverables: ['Working GitHub repo scaffold', 'API Contract'],
        potentialRisk: 'Scope creep during initial design setup.',
        completed: false,
      },
      {
        week: 2,
        title: 'Phase 2: Core MVP Feature Implementation',
        duration: 'Hours 4–12',
        actionableSteps: ['Implement primary AI pipeline', 'Build dynamic UI components', 'Connect state handlers'],
        deliverables: ['End-to-end working core feature demo'],
        potentialRisk: 'API rate limits or latency bottlenecks.',
        completed: false,
      },
      {
        week: 3,
        title: 'Phase 3: Integration & Stress Testing',
        duration: 'Hours 12–20',
        actionableSteps: ['Add edge case fallbacks', 'Test multi-device responsive layout', 'Integrate Telegram bot alerts'],
        deliverables: ['Integrated full-stack system', 'Passes unit checks'],
        potentialRisk: 'Uncaught async promise rejections.',
        completed: false,
      },
      {
        week: 4,
        title: 'Phase 4: Pitch Deck & Video Recording',
        duration: 'Hours 20–24',
        actionableSteps: ['Generate 3D architecture diagram', 'Record 2-min demo walkthrough', 'Deploy to Vercel'],
        deliverables: ['Live production URL', 'Devpost submission'],
        potentialRisk: 'Last-minute deployment build failures.',
        completed: false,
      },
    ],
  },
  '48h': {
    label: '48-Hour Weekend Sprint',
    durationLabel: '48 Hours',
    milestones: [
      {
        week: 1,
        title: 'Day 1 Morning: Design & Setup',
        duration: 'Day 1 (0–8h)',
        actionableSteps: ['Initialize Next.js App Router', 'Create database schemas', 'Deploy staging environment'],
        deliverables: ['Scaffolding & CI pipeline'],
        potentialRisk: 'Environment setup delays.',
        completed: false,
      },
      {
        week: 2,
        title: 'Day 1 Evening: Core Engine Build',
        duration: 'Day 1 (8–18h)',
        actionableSteps: ['Build LLM orchestration engine', 'Implement vector embeddings', 'Construct main workspace view'],
        deliverables: ['Working functional prototype'],
        potentialRisk: 'Complex prompt engineering iteration.',
        completed: false,
      },
      {
        week: 3,
        title: 'Day 2 Morning: Polish & Extras',
        duration: 'Day 2 (18–36h)',
        actionableSteps: ['Refine UI micro-animations', 'Add cost calculator & export tools', 'Optimize bundle size'],
        deliverables: ['Polished UX & feature-complete app'],
        potentialRisk: 'UI alignment bugs on mobile views.',
        completed: false,
      },
      {
        week: 4,
        title: 'Day 2 Evening: Final Demo & Submission',
        duration: 'Day 2 (36–48h)',
        actionableSteps: ['Record high-res demo walkthrough', 'Finalize GitHub README documentation', 'Submit hackathon entry'],
        deliverables: ['Submission ready & published demo'],
        potentialRisk: 'Late video rendering delays.',
        completed: false,
      },
    ],
  },
  '1w': {
    label: '1-Week Rapid MVP Sprint',
    durationLabel: '7 Days',
    milestones: [
      {
        week: 1,
        title: 'Days 1-2: Architecture & Foundation',
        duration: 'Days 1-2',
        actionableSteps: ['Setup database & authentication', 'Draft full system architecture diagram', 'Create API router handlers'],
        deliverables: ['Core database schemas & API routes'],
        potentialRisk: 'Underestimating backend query complexity.',
        completed: false,
      },
      {
        week: 2,
        title: 'Days 3-4: Feature Development',
        duration: 'Days 3-4',
        actionableSteps: ['Implement core AI business logic', 'Build interactive UI screens', 'Add export & sharing capabilities'],
        deliverables: ['Feature-complete MVP build'],
        potentialRisk: 'State management synchronization issues.',
        completed: false,
      },
      {
        week: 3,
        title: 'Days 5-6: Testing & Optimization',
        duration: 'Days 5-6',
        actionableSteps: ['Conduct end-to-end integration tests', 'Optimize page load performance', 'Conduct beta user testing'],
        deliverables: ['Zero critical bug count'],
        potentialRisk: 'Edge cases discovered late in testing.',
        completed: false,
      },
      {
        week: 4,
        title: 'Day 7: Launch & Presentation',
        duration: 'Day 7',
        actionableSteps: ['Prepare launch pitch slides', 'Deploy to production environment', 'Publish public demo'],
        deliverables: ['Live production launch'],
        potentialRisk: 'DNS or SSL provisioning delays.',
        completed: false,
      },
    ],
  },
};

export default function SprintMilestonesCustomizer({ initialMilestones }: SprintMilestonesCustomizerProps) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(
    initialMilestones && initialMilestones.length > 0 ? initialMilestones : SPRINT_PRESETS['24h'].milestones
  );
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('ai');

  const handleApplyPreset = (presetKey: string) => {
    if (SPRINT_PRESETS[presetKey]) {
      setMilestones(SPRINT_PRESETS[presetKey].milestones);
      setActivePreset(presetKey);
    }
  };

  const toggleTaskCompleted = (milestoneWeek: number) => {
    setMilestones(
      milestones.map((m) => (m.week === milestoneWeek ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleUpdateMilestoneTitle = (week: number, title: string) => {
    setMilestones(milestones.map((m) => (m.week === week ? { ...m, title } : m)));
  };

  const handleUpdateMilestoneDuration = (week: number, duration: string) => {
    setMilestones(milestones.map((m) => (m.week === week ? { ...m, duration } : m)));
  };

  const handleUpdateRisk = (week: number, potentialRisk: string) => {
    setMilestones(milestones.map((m) => (m.week === week ? { ...m, potentialRisk } : m)));
  };

  const handleAddTask = (week: number, taskText: string) => {
    if (!taskText.trim()) return;
    setMilestones(
      milestones.map((m) =>
        m.week === week ? { ...m, actionableSteps: [...m.actionableSteps, taskText.trim()] } : m
      )
    );
  };

  const handleRemoveTask = (week: number, taskIdx: number) => {
    setMilestones(
      milestones.map((m) =>
        m.week === week
          ? { ...m, actionableSteps: m.actionableSteps.filter((_, idx) => idx !== taskIdx) }
          : m
      )
    );
  };

  const handleAddMilestone = () => {
    const nextNum = milestones.length + 1;
    const newM: ProjectMilestone = {
      week: nextNum,
      title: `Phase ${nextNum}: New Engineering Goal`,
      duration: `Phase ${nextNum}`,
      actionableSteps: ['Define actionable task 1', 'Define actionable task 2'],
      deliverables: ['Milestone Deliverable'],
      potentialRisk: 'Risk assessment pending.',
      completed: false,
    };
    setMilestones([...milestones, newM]);
  };

  const handleRemoveMilestone = (week: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.week !== week));
  };

  return (
    <Card variant="blueprint" className="p-8 space-y-6 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-extrabold text-forge-white flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-ember" />
              <span>5. Sprint Milestones & Actionable Task Breakdown</span>
            </h3>
            <Badge variant="quenched" size="sm" className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" /> AI Timeline Active
            </Badge>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Review actionable tasks, check off completed milestones, or click <span className="text-forge-white font-bold">Customize Timeline</span> to adjust sprint duration & tasks.
          </p>
        </div>

        <Button
          variant={isCustomizing ? 'primary' : 'quenched'}
          size="sm"
          onClick={() => setIsCustomizing(!isCustomizing)}
          leftIcon={<Sliders className="w-3.5 h-3.5 text-brand-ember" />}
          className="text-xs font-mono font-bold shrink-0"
        >
          {isCustomizing ? 'Done Customizing' : 'Customize Timeline & Tasks'}
        </Button>
      </div>

      {/* Customizer Presets Panel (shown when Customize is ON) */}
      {isCustomizing && (
        <Card variant="solid" className="p-5 bg-forge-black/90 border-brand-ember/40 space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-ember" />
                <span>Sprint Time Period Presets:</span>
              </span>
              <p className="text-[11px] font-sans text-zinc-400 pt-0.5">
                Switch timeline duration or build a custom multi-phase workflow
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={activePreset === '24h' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleApplyPreset('24h')}
                className="text-[11px] font-mono"
              >
                24-Hour Hackathon
              </Button>

              <Button
                variant={activePreset === '48h' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleApplyPreset('48h')}
                className="text-[11px] font-mono"
              >
                48-Hour Weekend
              </Button>

              <Button
                variant={activePreset === '1w' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleApplyPreset('1w')}
                className="text-[11px] font-mono"
              >
                1-Week MVP
              </Button>

              <Button
                variant="quenched"
                size="sm"
                onClick={handleAddMilestone}
                leftIcon={<Plus className="w-3.5 h-3.5 text-brand-ember" />}
                className="text-xs font-mono text-brand-ember hover:bg-brand-ember/10 border-brand-ember/40"
              >
                Add Phase Slot
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Milestones & Tasks List */}
      <div className="space-y-4">
        {milestones.map((m) => (
          <Card key={m.week} variant="solid" className="p-6 space-y-4 border-quenched-steel/25">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 w-full">
                <span className="w-7 h-7 rounded-full bg-brand-ember text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {m.week}
                </span>

                {isCustomizing ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestoneTitle(m.week, e.target.value)}
                      className="w-full bg-forge-black/80 border border-quenched-steel/30 rounded px-2.5 py-1 text-sm font-display font-bold text-forge-white focus:outline-none focus:border-brand-ember"
                      placeholder="Phase Title"
                    />
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) => handleUpdateMilestoneDuration(m.week, e.target.value)}
                      className="w-48 bg-forge-black/60 border border-quenched-steel/20 rounded px-2 py-1 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 shrink-0"
                      placeholder="Duration (e.g. Hours 0-4)"
                    />
                  </div>
                ) : (
                  <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
                    <span>{m.title}</span>
                  </h4>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleTaskCompleted(m.week)}
                  className="cursor-pointer"
                >
                  <Badge variant={m.completed ? 'emerald' : 'quenched'} size="sm">
                    {m.completed ? '✓ COMPLETED' : 'IN PROGRESS'}
                  </Badge>
                </button>

                {!isCustomizing && (
                  <span className="text-xs font-mono font-bold text-quenched-steel-light hidden sm:inline">
                    {m.duration}
                  </span>
                )}

                {isCustomizing && (
                  <button
                    onClick={() => handleRemoveMilestone(m.week)}
                    className="text-zinc-500 hover:text-red-400 p-1 transition"
                    title="Remove Milestone Phase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Actionable Engineering Tasks */}
            <div className="bg-forge-black/50 border border-quenched-steel/20 p-4 rounded-blueprint space-y-2">
              <span className="text-[10px] font-mono font-bold text-brand-ember uppercase tracking-widest flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Actionable Engineering Tasks:</span>
              </span>

              <ul className="space-y-1.5 pl-1">
                {m.actionableSteps &&
                  m.actionableSteps.map((task, tIdx) => (
                    <li key={tIdx} className="text-xs font-sans text-zinc-200 flex items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-brand-ember font-mono text-[11px] font-bold">•</span>
                        <span>{task}</span>
                      </div>

                      {isCustomizing && (
                        <button
                          onClick={() => handleRemoveTask(m.week, tIdx)}
                          className="text-zinc-500 hover:text-red-400 text-xs px-1"
                        >
                          ×
                        </button>
                      )}
                    </li>
                  ))}
              </ul>

              {/* Add Custom Task Input (shown when customizing) */}
              {isCustomizing && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="+ Add new actionable task (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTask(m.week, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full bg-forge-black/80 border border-quenched-steel/30 rounded px-2.5 py-1 text-xs font-mono text-zinc-200 focus:outline-none focus:border-brand-ember"
                  />
                </div>
              )}
            </div>

            {/* Deliverables & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans text-zinc-300 pt-1">
              <div>
                <span className="font-bold text-emerald-400 font-mono">Deliverables: </span>
                {m.deliverables ? m.deliverables.join(', ') : 'Working Prototype'}
              </div>

              <div>
                <span className="font-bold text-amber-molten font-mono">Potential Risk: </span>
                {isCustomizing ? (
                  <input
                    type="text"
                    value={m.potentialRisk}
                    onChange={(e) => handleUpdateRisk(m.week, e.target.value)}
                    className="w-full bg-forge-black/60 border border-quenched-steel/20 rounded px-2 py-0.5 text-xs font-sans text-amber-300 focus:outline-none focus:border-amber-400 mt-1"
                  />
                ) : (
                  <span>{m.potentialRisk}</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
