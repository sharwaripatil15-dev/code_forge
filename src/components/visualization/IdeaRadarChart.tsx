'use client';

import React from 'react';
import { GapMetrics } from '@/lib/types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ShieldAlert, Zap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-500" />
            <span>Idea DNA Radar & Viability Index</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Multi-dimensional novelty analysis based on live DeepSearch results
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-brand-500 font-mono">{metrics.noveltyScore}/100</span>
          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Overall Novelty Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Spider Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" tick={{ fontSize: 11, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" />
              <Radar
                name="Idea Profile"
                dataKey="value"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Scorecard */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300">Unexplored White Space Title:</span>
              <span className="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold">
                HIGH OPPORTUNITY
              </span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">{metrics.whiteSpaceTitle}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{metrics.whiteSpaceDescription}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Key Differentiating Innovations</span>
            </p>
            <ul className="space-y-1.5">
              {metrics.keyInnovations.map((innovation, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{innovation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
