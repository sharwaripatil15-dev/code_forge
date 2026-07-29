'use client';

import React, { useState } from 'react';
import { GapNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Target, Sparkles, ExternalLink, BookOpen, GitBranch } from 'lucide-react';

interface GapMapGraphProps {
  nodes: GapNode[];
  whiteSpaceTitle: string;
  whiteSpaceDescription: string;
}

export default function GapMapGraph({ nodes }: GapMapGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GapNode | null>(nodes.find(n => n.type === 'opportunity') || nodes[0]);

  // Pre-calculated node coordinates for static layout stability & dynamic SVG rendering
  const layoutPositions: Record<string, { x: number; y: number; color: string }> = {
    n1: { x: 220, y: 160, color: '#4a6274' }, // Core project (quenched steel)
    n2: { x: 150, y: 320, color: '#ff3b00' }, // AST paper (ember)
    n3: { x: 380, y: 130, color: '#ff9500' }, // Synthesis paper (amber)
    n4: { x: 180, y: 460, color: '#10b981' }, // Static Linter (emerald)
    opp: { x: 680, y: 280, color: '#ff3b00' } // Opportunity target (ember glow)
  };

  return (
    <Card variant="blueprint" className="p-8 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-extrabold text-forge-white">Interactive Knowledge Gap Map</h3>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Node clusters plot existing solutions. The glowing radar marks <span className="text-brand-ember font-bold">Your Opportunity Space</span>.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-quenched-steel-light">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ember"></span> AST Synthesis
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-quenched-steel-light"></span> Agentic Loops
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Formal Proofs
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[480px] bg-forge-black/90 border border-quenched-steel/25 rounded-blueprint overflow-hidden bg-blueprint-grid">
        
        {/* Glowing Radar Overlay over Opportunity Space */}
        <div className="absolute top-[80px] right-[60px] w-80 h-80 rounded-full border border-brand-ember/30 bg-brand-ember/5 animate-pulse-slow pointer-events-none flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-brand-ember/20 bg-brand-ember/10 flex items-center justify-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-ember font-bold">
              WHITE SPACE ZONE
            </span>
          </div>
        </div>

        <svg className="w-full h-full">
          {/* Connection Lines */}
          <line x1={220} y1={160} x2={150} y2={320} stroke="rgba(74, 98, 116, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1={150} y1={320} x2={380} y2={130} stroke="rgba(74, 98, 116, 0.3)" strokeWidth="2" />
          <line x1={180} y1={460} x2={380} y2={130} stroke="rgba(74, 98, 116, 0.3)" strokeWidth="2" />

          {/* Dotted Opportunity Bridges */}
          <line x1={380} y1={130} x2={680} y2={280} stroke="#ff3b00" strokeWidth="2.5" strokeDasharray="6 6" />
          <line x1={150} y1={320} x2={680} y2={280} stroke="#ff3b00" strokeWidth="2.5" strokeDasharray="6 6" />

          {/* Render Cluster Nodes */}
          {nodes.map((node) => {
            const pos = layoutPositions[node.id] || { x: 350, y: 240, color: '#ff3b00' };
            const isOpportunity = node.type === 'opportunity';
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
              >
                {/* Outer Ring for Opportunity Node */}
                {isOpportunity && (
                  <circle
                    r={42}
                    fill="none"
                    stroke="#ff3b00"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Node Base */}
                <circle
                  r={isOpportunity ? 28 : isSelected ? 20 : 16}
                  fill={isOpportunity ? '#ff3b00' : pos.color}
                  stroke={isSelected ? '#f3f2ee' : 'rgba(0,0,0,0.5)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="shadow-2xl"
                />

                {/* Node Label */}
                <text
                  x={0}
                  y={isOpportunity ? 48 : 34}
                  textAnchor="middle"
                  fill={isOpportunity ? '#ff3b00' : '#f3f2ee'}
                  fontSize={isOpportunity ? 12 : 10}
                  fontFamily="var(--font-jetbrains)"
                  fontWeight={isOpportunity || isSelected ? 'bold' : '500'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Detail Panel */}
      {selectedNode && (
        <Card variant="solid" className="p-6 space-y-3 border-quenched-steel/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedNode.type === 'opportunity' ? (
                <Sparkles className="w-5 h-5 text-brand-ember" />
              ) : selectedNode.type === 'paper' ? (
                <BookOpen className="w-5 h-5 text-quenched-steel-light" />
              ) : (
                <GitBranch className="w-5 h-5 text-quenched-steel-light" />
              )}
              <h4 className="text-base font-display font-bold text-forge-white">{selectedNode.label}</h4>
            </div>

            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-brand-ember hover:text-amber-molten font-bold flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-ember rounded"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-xs font-sans text-zinc-300 leading-relaxed">
            {selectedNode.description}
          </p>

          {selectedNode.starsOrCitations && (
            <div className="text-xs font-mono text-quenched-steel-light pt-1">
              Impact Metric: <span className="text-forge-white font-bold">{selectedNode.starsOrCitations}</span>
            </div>
          )}
        </Card>
      )}
    </Card>
  );
}
