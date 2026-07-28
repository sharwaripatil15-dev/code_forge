'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Rocket, Layers, Cpu, Calendar, Copy, Check, Send, Download, Sparkles, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectHubStepProps {
  blueprint: ProjectBlueprint;
  onOpenTelegramMentor: () => void;
}

export default function ProjectHubStep({ blueprint, onOpenTelegramMentor }: ProjectHubStepProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedScaffold, setSelectedScaffold] = useState(0);

  const handleCopy = (content: string, filePath: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filePath);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-white">Project HUB: Generated Blueprint & Scaffold</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Implementation Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {blueprint.title} — {blueprint.tagline}
          </p>
        </div>

        <button
          onClick={onOpenTelegramMentor}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Launch AI Telegram Mentor Agent</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#121216] border border-zinc-800 p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">Problem Statement</h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">{blueprint.problemStatement}</p>
        </div>

        <div className="bg-[#121216] border border-zinc-800 p-6 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Unique Value Proposition</h3>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">{blueprint.uniqueValueProposition}</p>
        </div>
      </div>

      {/* System Architecture Node Diagram */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            <span>Auto-Generated System Architecture</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">5 Pipeline Nodes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {blueprint.architectureNodes.map((node, idx) => (
            <div
              key={node.id}
              className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 relative group hover:border-brand-500/50 transition"
            >
              <div className="text-[10px] font-bold text-brand-400 uppercase">Node 0{idx + 1}</div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{node.title}</h4>
              <p className="text-[11px] font-mono text-zinc-400">{node.tech}</p>
              <p className="text-[10px] text-zinc-500 line-clamp-2">{node.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Recommendations */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Layers className="w-5 h-5 text-brand-500" />
          <span>Hackathon-Optimized Tech Stack</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueprint.techStack.map((tech, idx) => (
            <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{tech.category}</span>
                <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 font-bold rounded text-[10px]">
                  {tech.chosen}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">{tech.rationale}</p>
              <div className="text-[10px] text-zinc-500">
                Alternatives considered: {tech.alternatives.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones & Timeline */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <Calendar className="w-5 h-5 text-brand-500" />
          <span>Sprint Milestones Roadmap</span>
        </h3>

        <div className="space-y-3">
          {blueprint.milestones.map((m) => (
            <div key={m.week} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {m.week}
                  </span>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                </div>
                <span className="text-xs font-mono text-zinc-400">{m.duration}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300 pt-1">
                <div>
                  <span className="font-semibold text-emerald-400">Deliverables: </span>
                  {m.deliverables.join(', ')}
                </div>
                <div>
                  <span className="font-semibold text-amber-400">Potential Risk: </span>
                  {m.potentialRisk}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scaffold Exporter Viewer */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-500" />
            <span>Blueprint → Repo Boilerplate Exporter</span>
          </h3>

          <button
            onClick={() => handleCopy(blueprint.scaffoldFiles[selectedScaffold].content, blueprint.scaffoldFiles[selectedScaffold].filePath)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-500/20"
          >
            {copiedFile === blueprint.scaffoldFiles[selectedScaffold].filePath ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy File Boilerplate
              </>
            )}
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {blueprint.scaffoldFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScaffold(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5 ${
                selectedScaffold === idx
                  ? 'bg-zinc-800 text-brand-400 border border-brand-500/40'
                  : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.filePath}</span>
            </button>
          ))}
        </div>

        {/* Code Content Block */}
        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 overflow-x-auto max-h-80 leading-relaxed">
          {blueprint.scaffoldFiles[selectedScaffold].content}
        </pre>
      </div>
    </div>
  );
}
