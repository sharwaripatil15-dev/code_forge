'use client';

import React from 'react';
import { DeepSearchState } from '@/lib/types';
import GapMapGraph from '../visualization/GapMapGraph';
import IdeaRadarChart from '../visualization/IdeaRadarChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Network } from 'lucide-react';

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
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-brand-ember" />
            <h2 className="text-xl font-display font-bold text-forge-white">Opportunity Gap Map</h2>
            <Badge variant="ember" size="sm">
              Visual Knowledge Clustering
            </Badge>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Hover and click nodes to explore current solutions. The glowing white-space zone highlights your uncrowded target market.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="self-start sm:self-auto shrink-0"
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
