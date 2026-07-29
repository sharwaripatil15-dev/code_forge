'use client';

import React from 'react';
import { GapMetrics } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface IdeaRadarChartProps {
  metrics: GapMetrics;
}

export default function IdeaRadarChart({ metrics }: IdeaRadarChartProps) {
  const radarData = [
    { subject: 'Novelty', value: metrics.noveltyScore, fullMark: 100 },
    { subject: 'Feasibility', value: metrics.feasibilityScore, fullMark: 100 },
    { subject: 'Complexity', value: metrics.technicalComplexity, fullMark: 100 },
    { subject: 'Market Impact', value: metrics.marketImpact, fullMark: 100 },
    { subject: 'Speed to MVP', value: metrics.executionSpeed, fullMark: 100 },
  ];

  return (
    <Card variant="blueprint" className="p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-forge-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-ember" />
            <span>Idea DNA Radar & Viability Index</span>
          </h3>
          <p className="text-xs font-sans text-zinc-400">
            Multi-dimensional novelty analysis based on live DeepSearch results
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-xl font-mono font-extrabold text-emerald-400">{metrics.feasibilityScore}/100</span>
            <p className="text-[10px] font-mono text-quenched-steel-light uppercase tracking-wider">Feasibility</p>
          </div>
          <div className="h-8 w-px bg-quenched-steel/20" />
          <div>
            <span className="text-xl font-mono font-extrabold text-brand-ember">{metrics.noveltyScore}/100</span>
            <p className="text-[10px] font-mono text-quenched-steel-light uppercase tracking-wider">Novelty</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Spider Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="rgba(74, 98, 116, 0.3)" />
              <PolarAngleAxis dataKey="subject" stroke="#4a6274" tick={{ fontSize: 11, fontWeight: 'bold', fontFamily: 'var(--font-jetbrains)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272a" />
              <Radar
                name="Idea Profile"
                dataKey="value"
                stroke="#ff3b00"
                fill="#ff3b00"
                fillOpacity={0.35}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Scorecard */}
        <div className="space-y-4">
          <Card variant="solid" className="p-4 space-y-3 border-quenched-steel/30">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-quenched-steel-light">White Space Opportunity:</span>
              <Badge variant="ember" size="sm">
                HIGH OPPORTUNITY
              </Badge>
            </div>
            <p className="text-xs font-display font-bold text-forge-white leading-snug">{metrics.whiteSpaceTitle}</p>
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">{metrics.whiteSpaceDescription}</p>
          </Card>

          <div className="space-y-2">
            <p className="text-xs font-mono font-bold text-quenched-steel-light uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-ember" />
              <span>Key Differentiating Innovations</span>
            </p>
            <ul className="space-y-1.5">
              {metrics.keyInnovations.map((innovation, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-sans text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{innovation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
