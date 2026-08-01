'use client';

import dynamic from 'next/dynamic';
import { DeepSearchState } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Network } from 'lucide-react';

const GapMapGraph = dynamic(() => import('../visualization/GapMapGraph'), {
  ssr: false,
  loading: () => <div className="h-[480px] bg-forge-black rounded-blueprint flex items-center justify-center text-xs font-mono text-zinc-500">Loading Interactive D3 Gap Graph...</div>
});

const IdeaRadarChart = dynamic(() => import('../visualization/IdeaRadarChart'), {
  ssr: false,
  loading: () => <div className="h-[220px] bg-forge-black rounded-blueprint flex items-center justify-center text-xs font-mono text-zinc-500">Loading Radar Chart...</div>
});

interface GapMapStepProps {
  data: DeepSearchState;
  onContinue: () => void;
}

export default function GapMapStep({ data, onContinue }: GapMapStepProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Step Header */}
      <Card variant="blueprint" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Network className="w-5 h-5 text-brand-ember" />
            <h2 className="text-xl font-display font-bold text-forge-white">Opportunity Gap Map</h2>
            <Badge variant="ember" size="sm">
              0 - 100 Visual Scale
            </Badge>
            <Badge variant="outline" size="sm" className="font-mono text-zinc-400">
              User-Guided Map
            </Badge>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Node clusters plot existing market solutions on a 0-100 scale. Click nodes to inspect details, or use the <strong>"How to Read This Map?"</strong> guide button for help.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto justify-center min-h-[44px] shrink-0"
        >
          Stress-test architecture
        </Button>
      </Card>

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
