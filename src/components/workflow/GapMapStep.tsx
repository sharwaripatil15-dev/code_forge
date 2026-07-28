'use client';

import React from 'react';
import { DeepSearchState } from '@/lib/types';
import GapMapGraph from '../visualization/GapMapGraph';
import IdeaRadarChart from '../visualization/IdeaRadarChart';
import { ArrowRight, Sparkles, Network } from 'lucide-react';

interface GapMapStepProps {
  data: DeepSearchState;
  onContinue: () => void;
}

export default function GapMapStep({ data, onContinue }: GapMapStepProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-white">Signature Feature: Opportunity Gap Map</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
              Visual Knowledge Clustering
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Hover and click nodes to explore current solutions. The glowing zone highlights your uncrowded target market.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <span>Enter Devil's Advocate Pass</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Force-Directed Gap Map */}
      <GapMapGraph
        nodes={data.nodes}
        whiteSpaceTitle={data.metrics.whiteSpaceTitle}
        whiteSpaceDescription={data.metrics.whiteSpaceDescription}
      />

      {/* Idea DNA Radar & Viability Index */}
      <IdeaRadarChart metrics={data.metrics} />
    </div>
  );
}
