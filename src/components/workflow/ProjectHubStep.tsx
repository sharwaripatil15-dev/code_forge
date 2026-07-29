'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Rocket, Layers, Cpu, Calendar, Copy, Check, Send, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-10 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#121218]/90 border border-zinc-800/90 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-500">
              <Rocket className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Project HUB: Generated Blueprint</h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              Implementation Ready
            </span>
          </div>

          <p className="text-sm text-zinc-400 font-medium">
            {blueprint.title} — {blueprint.tagline}
          </p>
        </div>

        <button
          onClick={onOpenTelegramMentor}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-500/20 transition self-start md:self-auto shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Launch AI Telegram Mentor Agent</span>
        </button>
      </div>

      {/* Problem & UVP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121218]/80 border border-zinc-800 p-8 rounded-3xl space-y-3 shadow-lg">
          <h3 className="text-xs font-bold text-brand-400 uppercase tracking-widest">Problem Statement</h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">{blueprint.problemStatement}</p>
        </div>

        <div className="bg-[#121218]/80 border border-zinc-800 p-8 rounded-3xl space-y-3 shadow-lg">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Unique Value Proposition</h3>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">{blueprint.uniqueValueProposition}</p>
        </div>
      </div>

      {/* System Architecture Grid */}
      <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-3">
            <Cpu className="w-5 h-5 text-brand-500" />
            <span>Auto-Generated System Architecture</span>
          </h3>
          <span className="text-xs font-mono font-bold text-zinc-400">5 Pipeline Nodes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {blueprint.architectureNodes.map((node, idx) => (
            <div
              key={node.id}
              className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-2 relative group hover:border-brand-500/50 transition shadow-sm"
            >
              <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Node 0{idx + 1}</div>
              <h4 className="text-xs font-extrabold text-white truncate">{node.title}</h4>
              <p className="text-[11px] font-mono text-zinc-400">{node.tech}</p>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{node.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <Layers className="w-5 h-5 text-brand-500" />
          <span>Hackathon-Optimized Tech Stack</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blueprint.techStack.map((tech, idx) => (
            <div key={idx} className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{tech.category}</span>
                <span className="px-3 py-1 bg-brand-500/10 text-brand-400 font-bold rounded-md text-[10px]">
                  {tech.chosen}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-medium">{tech.rationale}</p>
              
              <div className="text-[11px] text-zinc-500 pt-1">
                Alternatives considered: {tech.alternatives.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Roadmap */}
      <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <Calendar className="w-5 h-5 text-brand-500" />
          <span>Sprint Milestones Roadmap</span>
        </h3>

        <div className="space-y-4">
          {blueprint.milestones.map((m) => (
            <div key={m.week} className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {m.week}
                  </span>
                  <h4 className="text-sm font-extrabold text-white">{m.title}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400">{m.duration}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300 pt-1">
                <div>
                  <span className="font-bold text-emerald-400">Deliverables: </span>
                  {m.deliverables.join(', ')}
                </div>
                <div>
                  <span className="font-bold text-amber-400">Potential Risk: </span>
                  {m.potentialRisk}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scaffold Exporter */}
      <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-3">
            <Terminal className="w-5 h-5 text-brand-500" />
            <span>Blueprint → Repo Boilerplate Exporter</span>
          </h3>

          <button
            onClick={() => handleCopy(blueprint.scaffoldFiles[selectedScaffold].content, blueprint.scaffoldFiles[selectedScaffold].filePath)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-brand-500/20"
          >
            {copiedFile === blueprint.scaffoldFiles[selectedScaffold].filePath ? (
              <>
                <Check className="w-4 h-4" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Boilerplate File
              </>
            )}
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {blueprint.scaffoldFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScaffold(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
                selectedScaffold === idx
                  ? 'bg-zinc-800 text-brand-400 border border-brand-500/40 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{file.filePath}</span>
            </button>
          ))}
        </div>

        {/* Code View */}
        <pre className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono text-zinc-200 overflow-x-auto max-h-96 leading-relaxed shadow-inner">
          {blueprint.scaffoldFiles[selectedScaffold].content}
        </pre>
      </div>
    </div>
  );
}
