'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { generateProjectZip } from '@/lib/scaffoldGenerator';
import { X, Download, FileCode, Folder, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScaffoldGeneratorModalProps {
  blueprint: ProjectBlueprint;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScaffoldGeneratorModal({ blueprint, isOpen, onClose }: ScaffoldGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [framework, setFramework] = useState<'nextjs' | 'express' | 'vite'>('nextjs');

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsGenerating(true);
    try {
      await generateProjectZip(blueprint, framework);
      setIsDone(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const scaffoldFiles = [
    { name: 'package.json', desc: 'Next.js 14, React 18, Tailwind, Gemini AI, Supabase' },
    { name: 'README.md', desc: 'Setup instructions, problem statement & architecture specs' },
    { name: 'src/lib/gemini.ts', desc: 'Working Gemini 1.5 Flash SDK API client' },
    { name: 'src/lib/supabase.ts', desc: 'Working Supabase Postgres client initialization' },
    { name: '.env.example', desc: 'Pre-configured API keys for Gemini & Supabase' },
    { name: 'schema.sql', desc: 'Database migration script & indexes' },
    { name: 'Dockerfile', desc: 'Container build configuration' },
    { name: 'src/app/page.tsx', desc: 'Clean starter UI landing component' },
    { name: 'src/app/api/route.ts', desc: 'Healthcheck REST API endpoint' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-xl bg-forge-surface border border-brand-ember/40 rounded-blueprint shadow-2xl overflow-hidden flex flex-col justify-between">
        <div className="p-5 bg-forge-black/90 border-b border-quenched-steel/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-ember/20 border border-brand-ember/40 text-brand-ember">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-extrabold text-white flex items-center gap-2">
                <span>Production Code Scaffold (.ZIP)</span>
                <Badge variant="ember" size="sm" className="font-mono text-[10px]">
                  One-Click Download
                </Badge>
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Generates a clean starter codebase with dependencies, SDKs, schemas, and API routes.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-quenched-steel/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto font-mono">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Target Framework Architecture:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setFramework('nextjs')}
                className={`p-2.5 rounded-lg border text-center font-bold transition ${
                  framework === 'nextjs'
                    ? 'bg-brand-ember/20 border-brand-ember text-brand-ember'
                    : 'bg-forge-black border-quenched-steel/30 text-zinc-400 hover:text-white'
                }`}
              >
                Next.js 14
              </button>
              <button
                onClick={() => setFramework('express')}
                className={`p-2.5 rounded-lg border text-center font-bold transition ${
                  framework === 'express'
                    ? 'bg-brand-ember/20 border-brand-ember text-brand-ember'
                    : 'bg-forge-black border-quenched-steel/30 text-zinc-400 hover:text-white'
                }`}
              >
                Express API
              </button>
              <button
                onClick={() => setFramework('vite')}
                className={`p-2.5 rounded-lg border text-center font-bold transition ${
                  framework === 'vite'
                    ? 'bg-brand-ember/20 border-brand-ember text-brand-ember'
                    : 'bg-forge-black border-quenched-steel/30 text-zinc-400 hover:text-white'
                }`}
              >
                Vite + React
              </button>
            </div>
          </div>

          <span className="text-xs font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wider pt-2 block">
            <Folder className="w-4 h-4 text-brand-ember" /> Included Boilerplate Structure:
          </span>

          <div className="space-y-2">
            {scaffoldFiles.map((file, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-forge-black/80 border border-quenched-steel/25 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                  {file.name}
                </span>
                <span className="text-zinc-400 text-[11px] font-sans truncate max-w-[220px]">{file.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-forge-black/90 border-t border-quenched-steel/30 flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadZip}
            disabled={isGenerating}
            className="text-xs font-mono font-bold"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Packaging ZIP...
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> Download Complete!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1.5" /> Download Full Scaffold (.ZIP)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
