'use client';

import React, { useState } from 'react';
import { ArchitectureNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Cpu, X, Code, ExternalLink, Play, Layers, Box } from 'lucide-react';

import Architecture3DCanvas from './Architecture3DCanvas';

interface ArchitectureNodeCanvasProps {
  nodes: ArchitectureNode[];
}

export default function ArchitectureNodeCanvas({ nodes }: ArchitectureNodeCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  if (!nodes || nodes.length === 0) return null;

  if (viewMode === '3d') {
    return (
      <Architecture3DCanvas
        nodes={nodes}
        onBackTo2D={() => setViewMode('2d')}
      />
    );
  }

  return (
    <Card variant="blueprint" className="p-8 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
        <div>
          <h3 className="text-lg font-display font-extrabold text-forge-white flex items-center gap-3">
            <Cpu className="w-5 h-5 text-brand-ember" />
            <span>1. Auto-Generated System Architecture Canvas</span>
          </h3>
          <p className="text-xs font-sans text-zinc-400">
            Interactive pipeline schematic. Click any node to inspect payload schemas and starter code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setViewMode('3d')}
            className="text-xs font-mono bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
          >
            <Box className="w-3.5 h-3.5 mr-1 text-cyan-400 animate-pulse" /> Launch 3D Holo-Grid
          </Button>

          <Badge variant="ember" size="sm">
            {nodes.length} Nodes
          </Badge>
        </div>
      </div>

      {/* SVG Pipeline Canvas */}
      <div className="relative bg-forge-black/80 border border-quenched-steel/25 rounded-blueprint p-8 min-h-[320px] flex items-center justify-center overflow-x-auto">
        
        {/* Connection Laser Lines SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-brand-ember/40">
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF3B00" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FF9500" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF3B00" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Animated Connecting Lasers */}
          {nodes.slice(0, nodes.length - 1).map((_, idx) => {
            const startX = `${((idx + 0.5) / nodes.length) * 100}%`;
            const endX = `${((idx + 1.5) / nodes.length) * 100}%`;
            return (
              <line
                key={idx}
                x1={startX}
                y1="50%"
                x2={endX}
                y2="50%"
                stroke="url(#laserGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Node Pipeline Flow */}
        <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {nodes.map((node, idx) => {
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id || idx}
                onClick={() => setSelectedNode(node)}
                className={`p-5 rounded-blueprint border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-brand-ember/20 border-brand-ember ring-2 ring-brand-ember/50 shadow-xl shadow-brand-ember/15'
                    : 'bg-forge-surface/90 border-quenched-steel/30 hover:border-brand-ember/60 hover:bg-forge-surface'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedNode(node)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-brand-ember uppercase tracking-widest">
                    Node 0{idx + 1}
                  </span>
                  <Badge variant="quenched" size="sm">
                    {node.category}
                  </Badge>
                </div>

                <h4 className="text-xs font-display font-extrabold text-forge-white truncate mb-1">
                  {node.title}
                </h4>

                <p className="text-[11px] font-mono text-quenched-steel-light mb-2">{node.tech}</p>

                <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>

                <div className="pt-3 border-t border-quenched-steel/20 flex items-center justify-between text-[10px] font-mono text-brand-ember font-bold">
                  <span>Click to Inspect</span>
                  <Play className="w-3 h-3 text-brand-ember fill-brand-ember" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Inspector Drawer */}
      {selectedNode && (
        <Card variant="blueprint" className="p-6 bg-brand-ember/10 border-brand-ember/40 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="ember" size="sm">
                  {selectedNode.category}
                </Badge>
                <span className="text-xs font-mono font-bold text-quenched-steel-light">{selectedNode.tech}</span>
              </div>
              <h4 className="text-base font-display font-bold text-forge-white">{selectedNode.title}</h4>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-forge-surface-light"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs font-sans text-zinc-200 leading-relaxed">{selectedNode.description}</p>

          {/* Code Spec Sample */}
          <div className="space-y-2 pt-2 border-t border-brand-ember/20">
            <span className="text-[10px] font-mono font-bold text-brand-ember uppercase tracking-widest flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Node Interface Spec & Route:</span>
            </span>

            <pre className="p-4 bg-forge-black border border-quenched-steel/30 rounded-blueprint text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`// API Endpoint: /api/${selectedNode.title.toLowerCase().replace(/[^a-z0-9]/g, '')}/execute
export async function POST(req: Request) {
  // Executing Node: ${selectedNode.title} (${selectedNode.tech})
  const payload = await req.json();
  console.log('[Node Execution] Ingesting:', payload);
  
  return NextResponse.json({
    nodeId: '${selectedNode.id}',
    status: 'ACTIVE',
    processedAt: new Date().toISOString()
  });
}`}
            </pre>
          </div>
        </Card>
      )}
    </Card>
  );
}
