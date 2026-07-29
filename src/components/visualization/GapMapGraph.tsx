'use client';

import React, { useState } from 'react';
import { GapNode } from '@/lib/types';
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
    n1: { x: 220, y: 160, color: '#3b82f6' }, // Core project
    n2: { x: 150, y: 320, color: '#f97316' }, // AST paper
    n3: { x: 380, y: 130, color: '#f97316' }, // Synthesis paper
    n4: { x: 180, y: 460, color: '#10b981' }, // Static Linter
    opp: { x: 680, y: 280, color: '#f97316' } // Opportunity target
  };

  return (
    <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-500">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Interactive Knowledge Gap Map</h3>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Node clusters plot existing solutions. The glowing radar marks <span className="text-brand-400 font-bold">Your Opportunity Space</span>.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-500"></span> AST Synthesis
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Agentic Loops
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Formal Proofs
          </div>
        </div>
      </div>

      {/* SVG Canvas Area with Generous Height */}
      <div className="relative w-full h-[480px] bg-zinc-950/90 border border-zinc-800/80 rounded-2xl overflow-hidden bg-grid-pattern-spacious">
        
        {/* Glowing Radar Overlay over Opportunity Space */}
        <div className="absolute top-[80px] right-[60px] w-80 h-80 rounded-full border border-brand-500/30 bg-brand-500/5 animate-pulse-slow pointer-events-none flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-brand-500/20 bg-brand-500/10 flex items-center justify-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-400/80 font-black">
              WHITE SPACE ZONE
            </span>
          </div>
        </div>

        <svg className="w-full h-full">
          {/* Connection Lines */}
          <line x1={220} y1={160} x2={150} y2={320} stroke="#27272a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1={150} y1={320} x2={380} y2={130} stroke="#27272a" strokeWidth="2" />
          <line x1={180} y1={460} x2={380} y2={130} stroke="#27272a" strokeWidth="2" />

          {/* Dotted Opportunity Bridges */}
          <line x1={380} y1={130} x2={680} y2={280} stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 6" />
          <line x1={150} y1={320} x2={680} y2={280} stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 6" />

          {/* Render Cluster Nodes */}
          {nodes.map((node) => {
            const pos = layoutPositions[node.id] || { x: 350, y: 240, color: '#f97316' };
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
                    stroke="#f97316"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Node Base */}
                <circle
                  r={isOpportunity ? 28 : isSelected ? 20 : 16}
                  fill={isOpportunity ? '#f97316' : pos.color}
                  stroke={isSelected ? '#ffffff' : 'rgba(0,0,0,0.5)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="shadow-2xl"
                />

                {/* Node Label */}
                <text
                  x={0}
                  y={isOpportunity ? 48 : 34}
                  textAnchor="middle"
                  fill={isOpportunity ? '#f97316' : '#d4d4d8'}
                  fontSize={isOpportunity ? 12 : 10}
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
        <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedNode.type === 'opportunity' ? (
                <Sparkles className="w-6 h-6 text-brand-500" />
              ) : selectedNode.type === 'paper' ? (
                <BookOpen className="w-6 h-6 text-brand-400" />
              ) : (
                <GitBranch className="w-6 h-6 text-blue-400" />
              )}
              <h4 className="text-base font-extrabold text-white">{selectedNode.label}</h4>
            </div>

            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1.5"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            {selectedNode.description}
          </p>

          {selectedNode.starsOrCitations && (
            <div className="text-xs text-zinc-400 font-mono pt-1">
              Impact Metric: <span className="text-white font-bold">{selectedNode.starsOrCitations}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
