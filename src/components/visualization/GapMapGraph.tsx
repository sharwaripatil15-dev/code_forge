'use client';

import React, { useState } from 'react';
import { GapNode } from '@/lib/types';
import { Target, Sparkles, ExternalLink, BookOpen, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';

interface GapMapGraphProps {
  nodes: GapNode[];
  whiteSpaceTitle: string;
  whiteSpaceDescription: string;
}

export default function GapMapGraph({ nodes, whiteSpaceTitle, whiteSpaceDescription }: GapMapGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GapNode | null>(nodes.find(n => n.type === 'opportunity') || nodes[0]);

  // Pre-calculated node coordinates for static layout stability & dynamic SVG rendering
  const layoutPositions: Record<string, { x: number; y: number; color: string }> = {
    n1: { x: 180, y: 140, color: '#3b82f6' }, // Sweep AI
    n2: { x: 120, y: 280, color: '#f97316' }, // PR-Agent
    n3: { x: 320, y: 110, color: '#f97316' }, // LMFuzz
    n4: { x: 140, y: 420, color: '#10b981' }, // Semgrep Engine
    n5: { x: 300, y: 400, color: '#3b82f6' }, // SWE-bench
    n6: { x: 420, y: 280, color: '#10b981' }, // ZK-Proof
    opp: { x: 580, y: 240, color: '#f97316' } // Opportunity target
  };

  return (
    <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-500/10 border border-brand-500/30 rounded-lg text-brand-500">
              <Target className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">Interactive Knowledge Gap Map</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Node clusters show existing approaches. The highlighted glowing region marks <span className="text-brand-400 font-bold">Your Opportunity Space</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-500"></span> AST Synthesis
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Agentic Loops
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Formal Proofs
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[420px] bg-zinc-950/80 border border-zinc-800/80 rounded-xl overflow-hidden bg-grid-pattern">
        
        {/* Glowing Radar Overlay over Opportunity Space */}
        <div className="absolute top-[80px] right-[40px] w-72 h-72 rounded-full border border-brand-500/30 bg-brand-500/5 animate-pulse-slow pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-brand-500/20 bg-brand-500/10 flex items-center justify-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-400/70 font-extrabold">
              WHITE SPACE ZONE
            </span>
          </div>
        </div>

        <svg className="w-full h-full">
          {/* Connection Lines */}
          <line x1={180} y1={140} x2={120} y2={280} stroke="#27272a" strokeWidth="2" strokeDasharray="4 4" />
          <line x1={120} y1={280} x2={320} y2={110} stroke="#27272a" strokeWidth="2" />
          <line x1={320} y1={110} x2={420} y2={280} stroke="#27272a" strokeWidth="2" />
          <line x1={140} y1={420} x2={300} y2={400} stroke="#27272a" strokeWidth="2" />
          <line x1={300} y1={400} x2={420} y2={280} stroke="#27272a" strokeWidth="2" />

          {/* Dotted Opportunity Bridges */}
          <line x1={320} y1={110} x2={580} y2={240} stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" />
          <line x1={420} y1={280} x2={580} y2={240} stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" />

          {/* Render Cluster Nodes */}
          {nodes.map((node) => {
            const pos = layoutPositions[node.id] || { x: 300, y: 200, color: '#f97316' };
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
                    r={36}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Node Base */}
                <circle
                  r={isOpportunity ? 24 : isSelected ? 18 : 14}
                  fill={isOpportunity ? '#f97316' : pos.color}
                  stroke={isSelected ? '#ffffff' : 'rgba(0,0,0,0.5)'}
                  strokeWidth={isSelected ? 3 : 1}
                  className="shadow-xl"
                />

                {/* Node Label */}
                <text
                  x={0}
                  y={isOpportunity ? 42 : 30}
                  textAnchor="middle"
                  fill={isOpportunity ? '#f97316' : '#a1a1aa'}
                  fontSize={isOpportunity ? 11 : 9}
                  fontWeight={isOpportunity || isSelected ? 'bold' : 'normal'}
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
        <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-xl space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedNode.type === 'opportunity' ? (
                <Sparkles className="w-5 h-5 text-brand-500" />
              ) : selectedNode.type === 'paper' ? (
                <BookOpen className="w-5 h-5 text-brand-400" />
              ) : (
                <GitBranch className="w-5 h-5 text-blue-400" />
              )}
              <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
            </div>

            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            {selectedNode.description}
          </p>

          {selectedNode.starsOrCitations && (
            <div className="text-[11px] text-zinc-400 font-mono pt-1">
              Impact Metric: <span className="text-white font-bold">{selectedNode.starsOrCitations}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
