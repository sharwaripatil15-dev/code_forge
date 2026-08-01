'use client';

import React, { useState, useEffect } from 'react';
import { GapNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Target, Sparkles, ExternalLink, BookOpen, GitBranch, HelpCircle, X, Info, ArrowUpRight, Compass } from 'lucide-react';

interface GapMapGraphProps {
  nodes: GapNode[];
  whiteSpaceTitle: string;
  whiteSpaceDescription: string;
}

// Guaranteed safe layout slot coordinates mapping to 2D grid:
// X-axis: Market Uncrowdedness (0% Crowded -> 100% Open Space) [x: 100px -> 700px]
// Y-axis: Novelty Score (0 Conventional -> 100 Disruptive) [y: 410px -> 60px]
const CLUSTER_SLOTS = [
  { x: 170, y: 340, scaleX: 15, scaleY: 25 }, // Low Uncrowded (Crowded), Low-Mid Novelty
  { x: 300, y: 310, scaleX: 35, scaleY: 32 }, // Mid Crowded, Mid Novelty
  { x: 210, y: 220, scaleX: 20, scaleY: 55 }, // Crowded, High Novelty Paper
  { x: 380, y: 250, scaleX: 48, scaleY: 48 }, // Moderate Uncrowded, Moderate Novelty
  { x: 450, y: 190, scaleX: 60, scaleY: 65 }, // Mid-High Uncrowded, High Novelty
  { x: 260, y: 390, scaleX: 28, scaleY: 12 }, // Crowded, Low Novelty
  { x: 420, y: 360, scaleX: 55, scaleY: 20 }, // Moderate Uncrowded, Low Novelty
];

const NODE_COLORS: Record<string, string> = {
  repo: '#4a6274',       // Quenched steel blue
  paper: '#ff9500',      // Amber molten
  dataset: '#10b981',    // Emerald green
  opportunity: '#ff3b00',// Ember red
};

// Helper function to check if a node represents the Opportunity Space
function checkIsOpportunity(node: GapNode): boolean {
  if (!node) return false;
  const typeStr = (node.type || '').toLowerCase();
  const clusterStr = (node.clusterId || '').toLowerCase();
  const idStr = (node.id || '').toLowerCase();
  const labelStr = (node.label || '').toUpperCase();

  return (
    typeStr === 'opportunity' ||
    clusterStr === 'opportunity' ||
    idStr === 'opp' ||
    idStr.includes('opp') ||
    labelStr.includes('YOUR OPPORTUNITY SPACE')
  );
}

function GapMapGraph({ nodes, whiteSpaceTitle, whiteSpaceDescription }: GapMapGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GapNode | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<GapNode | null>(null);

  // Normalize nodes list to guarantee an opportunity node exists
  const normalizedNodes = React.useMemo(() => {
    const list = [...(nodes || [])];
    const hasOpp = list.some(checkIsOpportunity);

    if (!hasOpp && whiteSpaceTitle) {
      list.push({
        id: 'opp',
        label: `YOUR OPPORTUNITY SPACE: ${whiteSpaceTitle}`,
        clusterId: 'opportunity',
        type: 'opportunity',
        description: whiteSpaceDescription || '',
      });
    }
    return list;
  }, [nodes, whiteSpaceTitle, whiteSpaceDescription]);

  // Sync selected node when normalizedNodes change
  useEffect(() => {
    if (normalizedNodes && normalizedNodes.length > 0) {
      setSelectedNode(normalizedNodes.find(checkIsOpportunity) || normalizedNodes[0]);
    }
  }, [normalizedNodes]);

  // Compute node positions dynamically mapped to 2D scale
  const computedNodes = React.useMemo(() => {
    let nonOppCount = 0;
    return normalizedNodes.map((node) => {
      const isOpportunity = checkIsOpportunity(node);
      // Opportunity node is placed at top-right high score: X=88% (x=640), Y=88 (y=100)
      let x = 640;
      let y = 100;
      let scaleX = 88;
      let scaleY = 88;

      if (!isOpportunity) {
        const slot = CLUSTER_SLOTS[nonOppCount % CLUSTER_SLOTS.length];
        const cycle = Math.floor(nonOppCount / CLUSTER_SLOTS.length);
        x = Math.max(130, Math.min(520, slot.x + cycle * 20));
        y = Math.max(140, Math.min(390, slot.y + cycle * 12));
        scaleX = slot.scaleX;
        scaleY = slot.scaleY;
        nonOppCount++;
      }

      const color = NODE_COLORS[node.type] || (isOpportunity ? '#ff3b00' : '#4a6274');
      return { ...node, x, y, scaleX, scaleY, color, isOpportunity };
    });
  }, [normalizedNodes]);

  const oppNode = computedNodes.find((n) => n.isOpportunity) || { x: 640, y: 100, scaleX: 88, scaleY: 88 };
  const regularNodes = computedNodes.filter((n) => !n.isOpportunity);

  // Compute dynamic connection lines with explicit Gap Distance calculations
  const connections = React.useMemo(() => {
    const lines: Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isBridge: boolean;
      gapDistance?: number;
    }> = [];

    // Structured cluster connections between existing solutions
    for (let i = 0; i < regularNodes.length - 1; i++) {
      lines.push({
        id: `rel-${i}`,
        x1: regularNodes[i].x,
        y1: regularNodes[i].y,
        x2: regularNodes[i + 1].x,
        y2: regularNodes[i + 1].y,
        isBridge: false,
      });
    }

    // Dotted opportunity bridges from closest cluster nodes to Opportunity Node
    const bridgeCandidates = [...regularNodes].sort((a, b) => {
      const distA = Math.hypot(a.x - oppNode.x, a.y - oppNode.y);
      const distB = Math.hypot(b.x - oppNode.x, b.y - oppNode.y);
      return distA - distB;
    });

    bridgeCandidates.slice(0, Math.min(2, bridgeCandidates.length)).forEach((n, idx) => {
      const distPercent = Math.round(Math.hypot((oppNode.scaleX || 88) - (n.scaleX || 30), (oppNode.scaleY || 88) - (n.scaleY || 30)));
      lines.push({
        id: `opp-bridge-${idx}`,
        x1: n.x,
        y1: n.y,
        x2: oppNode.x,
        y2: oppNode.y,
        isBridge: true,
        gapDistance: distPercent,
      });
    });

    return lines;
  }, [regularNodes, oppNode]);

  return (
    <Card variant="blueprint" className="p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header with Title and User Guide Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-extrabold text-forge-white">
              Interactive Knowledge Gap Map
            </h3>

            {/* Scale Badge indicator */}
            <Badge variant="ember" size="sm" className="font-mono text-[10px]">
              2D Scale: 0 to 100
            </Badge>

            {/* How to Read Guide Button */}
            <button
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-blueprint transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Read This Map?</span>
            </button>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Node clusters plot existing market solutions on a 0-100 scale. The top-right glowing zone marks <span className="text-brand-ember font-bold">Your Opportunity Space</span>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs font-mono font-bold text-quenched-steel-light flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ember animate-pulse"></span> Opportunity
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4a6274]"></span> Open Repos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Papers
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Datasets
          </div>
        </div>
      </div>

      {/* Guide Banner for Quick Explanation */}
      <div className="bg-brand-ember/10 border border-brand-ember/25 rounded-blueprint p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-zinc-300">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-ember shrink-0" />
          <span>
            <strong>Quick Tip:</strong> Both axes scale from <strong>0 to 100</strong>. The closer a node is to the <strong>Top-Right (100, 100)</strong>, the higher its <strong>Novelty</strong> and <strong>Uncrowded Market Potential</strong>!
          </span>
        </div>
        <button
          onClick={() => setShowGuideModal(true)}
          className="text-xs font-mono font-bold text-brand-ember hover:underline shrink-0 flex items-center gap-1"
        >
          <span>View Full Guide</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* SVG Canvas Area with 2D Coordinate Grid & Axes */}
      <div className="relative w-full h-[540px] bg-forge-black/95 border border-quenched-steel/30 rounded-blueprint overflow-hidden bg-blueprint-grid">
        <svg className="w-full h-full" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid meet">
          {/* Background Grid Lines for 2D Scale (0, 25, 50, 75, 100) */}
          {/* Vertical Grid Lines (X-axis ticks: 0, 25, 50, 75, 100) */}
          {[
            { val: '0%', x: 90 },
            { val: '25%', x: 230 },
            { val: '50%', x: 370 },
            { val: '75%', x: 510 },
            { val: '100%', x: 650 },
          ].map((tick) => (
            <g key={`vgrid-${tick.val}`}>
              <line
                x1={tick.x}
                y1={50}
                x2={tick.x}
                y2={440}
                stroke={tick.val === '50%' ? 'rgba(74, 98, 116, 0.4)' : 'rgba(74, 98, 116, 0.15)'}
                strokeWidth={tick.val === '50%' ? 1.5 : 1}
                strokeDasharray={tick.val === '50%' ? '4 4' : undefined}
              />
              <text
                x={tick.x}
                y={458}
                textAnchor="middle"
                fill="#8f9ba8"
                fontSize={9.5}
                fontFamily="var(--font-jetbrains)"
                fontWeight="bold"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Horizontal Grid Lines (Y-axis ticks: 0, 25, 50, 75, 100) */}
          {[
            { val: '100', y: 80 },
            { val: '75', y: 170 },
            { val: '50', y: 260 },
            { val: '25', y: 350 },
            { val: '0', y: 440 },
          ].map((tick) => (
            <g key={`hgrid-${tick.val}`}>
              <line
                x1={90}
                y1={tick.y}
                x2={690}
                y2={tick.y}
                stroke={tick.val === '50' ? 'rgba(74, 98, 116, 0.4)' : 'rgba(74, 98, 116, 0.15)'}
                strokeWidth={tick.val === '50' ? 1.5 : 1}
                strokeDasharray={tick.val === '50' ? '4 4' : undefined}
              />
              <text
                x={76}
                y={tick.y + 3}
                textAnchor="end"
                fill="#8f9ba8"
                fontSize={9.5}
                fontFamily="var(--font-jetbrains)"
                fontWeight="bold"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Quadrant Visual Zone Background Highlights */}
          {/* Top-Right Quadrant: HIGH OPPORTUNITY WHITE SPACE (Uncrowded + High Novelty) */}
          <rect
            x={370}
            y={50}
            width={310}
            height={210}
            rx={8}
            fill="rgba(255, 59, 0, 0.04)"
            stroke="rgba(255, 59, 0, 0.25)"
            strokeWidth={1.5}
            strokeDasharray="6 6"
          />
          <text
            x={525}
            y={72}
            textAnchor="middle"
            fill="#ff3b00"
            fontSize={10}
            fontFamily="var(--font-jetbrains)"
            fontWeight="bold"
            letterSpacing="0.1em"
          >
            ✦ HIGH OPPORTUNITY WHITE SPACE ZONE (SCORE 75-100)
          </text>

          {/* Left Region: CROWDED MARKET ZONE */}
          <rect
            x={90}
            y={170}
            width={280}
            height={270}
            rx={8}
            fill="rgba(74, 98, 116, 0.05)"
            stroke="rgba(74, 98, 116, 0.2)"
            strokeWidth={1}
          />
          <text
            x={230}
            y={425}
            textAnchor="middle"
            fill="#8f9ba8"
            fontSize={9.5}
            fontFamily="var(--font-jetbrains)"
            fontWeight="bold"
            letterSpacing="0.08em"
          >
            🏢 CROWDED MARKET ZONE (EXISTING SOLUTIONS)
          </text>

          {/* MAIN AXIS LINES */}
          {/* X-Axis Line (Horizontal Axis) */}
          <line x1={80} y1={440} x2={705} y2={440} stroke="#ff3b00" strokeWidth={2} />
          <polygon points="712,440 702,435 702,445" fill="#ff3b00" />
          <text
            x={390}
            y={480}
            textAnchor="middle"
            fill="#f3f2ee"
            fontSize={11}
            fontFamily="var(--font-jetbrains)"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            X-AXIS: MARKET UNCROWDEDNESS SCALE → (0% Saturated Market → 100% Open White Space)
          </text>

          {/* Y-Axis Line (Vertical Axis) */}
          <line x1={90} y1={450} x2={90} y2={45} stroke="#ff3b00" strokeWidth={2} />
          <polygon points="90,38 85,48 95,48" fill="#ff3b00" />
          <text
            x={-245}
            y={32}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#f3f2ee"
            fontSize={11}
            fontFamily="var(--font-jetbrains)"
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            Y-AXIS: NOVELTY & UNMET NEED SCORE ↑ (0 Conventional → 100 Disruptive)
          </text>

          {/* Concentric Radar Rings locked to Opportunity Node */}
          <circle
            cx={oppNode.x}
            cy={oppNode.y}
            r={110}
            fill="rgba(255, 59, 0, 0.04)"
            stroke="rgba(255, 59, 0, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse-slow"
          />
          <circle
            cx={oppNode.x}
            cy={oppNode.y}
            r={70}
            fill="rgba(255, 59, 0, 0.08)"
            stroke="rgba(255, 59, 0, 0.4)"
            strokeWidth="1.5"
          />

          {/* Connection Lines with Gap Distance Badges */}
          {connections.map((line) => (
            <g key={line.id}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.isBridge ? '#ff3b00' : 'rgba(74, 98, 116, 0.35)'}
                strokeWidth={line.isBridge ? 2.5 : 1.5}
                strokeDasharray={line.isBridge ? '6 6' : undefined}
                className={line.isBridge ? 'opacity-85' : 'opacity-60'}
              />
              {line.isBridge && line.gapDistance && (
                <g transform={`translate(${(line.x1 + line.x2) / 2}, ${(line.y1 + line.y2) / 2})`}>
                  <rect
                    x={-42}
                    y={-10}
                    width={84}
                    height={20}
                    rx={4}
                    fill="#0b0f14"
                    fillOpacity={0.95}
                    stroke="#ff3b00"
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={3}
                    textAnchor="middle"
                    fill="#ff3b00"
                    fontSize={8.5}
                    fontFamily="var(--font-jetbrains)"
                    fontWeight="bold"
                  >
                    +{line.gapDistance}% GAP
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* Render Cluster & Opportunity Nodes with 2D Coordinate Badges */}
          {computedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isOpportunity = node.isOpportunity;

            const cleanLabel = isOpportunity
              ? node.label.replace(/^YOUR OPPORTUNITY SPACE:\s*/i, '')
              : node.label;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
              >
                {isOpportunity ? (
                  <g className="select-none">
                    {/* Radar ping */}
                    <circle r={36} fill="none" stroke="#ff3b00" strokeWidth="2" className="animate-ping opacity-40" />

                    {/* Opportunity Center Circle */}
                    <circle
                      r={24}
                      fill="#ff3b00"
                      stroke={isSelected ? '#f3f2ee' : '#ff9500'}
                      strokeWidth={isSelected ? 3.5 : 2}
                      className="shadow-2xl"
                    />

                    {/* Opportunity Backdrop Card & Text Label */}
                    <g transform="translate(0, 34)">
                      <rect
                        x={-120}
                        y={0}
                        width={240}
                        height={46}
                        rx={6}
                        fill="#0b0f14"
                        fillOpacity={0.95}
                        stroke="#ff3b00"
                        strokeWidth={1.5}
                      />
                      <text
                        x={0}
                        y={14}
                        textAnchor="middle"
                        fill="#ff3b00"
                        fontSize={9}
                        fontFamily="var(--font-jetbrains)"
                        fontWeight="bold"
                        letterSpacing="0.05em"
                      >
                        ✦ YOUR OPPORTUNITY SPACE (X:{node.scaleX}%, Y:{node.scaleY})
                      </text>
                      <text
                        x={0}
                        y={32}
                        textAnchor="middle"
                        fill="#f3f2ee"
                        fontSize={10.5}
                        fontFamily="var(--font-jetbrains)"
                        fontWeight="bold"
                      >
                        {cleanLabel.length > 28 ? cleanLabel.slice(0, 26) + '...' : cleanLabel}
                      </text>
                    </g>
                  </g>
                ) : (
                  <g className="select-none">
                    {/* Standard Node Circle */}
                    <circle
                      r={isSelected ? 18 : 14}
                      fill={node.color}
                      stroke={isSelected ? '#f3f2ee' : 'rgba(0,0,0,0.6)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="shadow-lg"
                    />

                    {/* Node Label Backdrop Card with Scale Coordinates */}
                    <g transform={`translate(0, ${isSelected ? 24 : 20})`}>
                      <rect
                        x={-70}
                        y={0}
                        width={140}
                        height={24}
                        rx={4}
                        fill="#0b0f14"
                        fillOpacity={0.92}
                        stroke={isSelected ? '#f3f2ee' : 'rgba(74,98,116,0.5)'}
                        strokeWidth={1}
                      />
                      <text
                        x={0}
                        y={11}
                        textAnchor="middle"
                        fill={isSelected ? '#f3f2ee' : '#d1d5db'}
                        fontSize={9}
                        fontFamily="var(--font-jetbrains)"
                        fontWeight={isSelected ? 'bold' : '500'}
                      >
                        {cleanLabel.length > 18 ? cleanLabel.slice(0, 16) + '...' : cleanLabel}
                      </text>
                      <text
                        x={0}
                        y={21}
                        textAnchor="middle"
                        fill="#8f9ba8"
                        fontSize={7.5}
                        fontFamily="var(--font-jetbrains)"
                      >
                        Score: (X:{node.scaleX}%, Y:{node.scaleY})
                      </text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Detail Panel */}
      {selectedNode && (
        <Card variant="solid" className="p-5 space-y-3 border-quenched-steel/30 bg-forge-black/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-quenched-steel/20 pb-3">
            <div className="flex items-center gap-3">
              {selectedNode.type === 'opportunity' ? (
                <div className="p-2 bg-brand-ember/20 border border-brand-ember/40 rounded-blueprint text-brand-ember">
                  <Sparkles className="w-5 h-5" />
                </div>
              ) : selectedNode.type === 'paper' ? (
                <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-blueprint text-amber-500">
                  <BookOpen className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-quenched-steel/20 border border-quenched-steel/40 rounded-blueprint text-quenched-steel-light">
                  <GitBranch className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-display font-bold text-forge-white">{selectedNode.label}</h4>
                  <Badge variant={selectedNode.type === 'opportunity' ? 'ember' : 'quenched'} size="sm" className="font-mono">
                    Score: X-{selectedNode.scaleX}%, Y-{selectedNode.scaleY}
                  </Badge>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Category: <span className="text-forge-white uppercase font-bold">{selectedNode.type}</span>
                </p>
              </div>
            </div>

            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-brand-ember hover:text-amber-molten font-bold flex items-center gap-1.5 px-3 py-1.5 bg-brand-ember/10 border border-brand-ember/30 rounded-blueprint shrink-0"
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
            <div className="text-xs font-mono text-quenched-steel-light">
              Impact Metric: <span className="text-forge-white font-bold">{selectedNode.starsOrCitations}</span>
            </div>
          )}
        </Card>
      )}

      {/* Interactive "How to Read This Map" Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="blueprint" className="max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto border-brand-ember/40">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-forge-white rounded-blueprint hover:bg-quenched-steel/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-quenched-steel/20 pb-3">
              <div className="p-2.5 bg-brand-ember/20 border border-brand-ember/40 rounded-blueprint text-brand-ember">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-forge-white">How to Read the Knowledge Gap Map</h3>
                <p className="text-xs font-sans text-zinc-400">Step-by-step guide for non-technical & first-time users</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-zinc-300 leading-relaxed">
              <div className="p-3.5 bg-forge-black rounded-blueprint border border-quenched-steel/30 space-y-1.5">
                <div className="flex items-center gap-2 text-brand-ember font-bold font-mono">
                  <Info className="w-4 h-4" />
                  <span>1. Understanding the 0 to 100 Scales</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 pl-1">
                  <li>
                    <strong>X-Axis (Horizontal Scale 0% → 100%):</strong> Measures <strong>Market Uncrowdedness</strong>. 0% means a heavily crowded existing market; 100% means open White Space with zero competition.
                  </li>
                  <li>
                    <strong>Y-Axis (Vertical Scale 0 → 100):</strong> Measures <strong>Novelty & Innovation</strong>. 0 means conventional solution; 100 means groundbreaking approach.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 bg-forge-black rounded-blueprint border border-quenched-steel/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                  <Target className="w-4 h-4" />
                  <span>2. Why is the Red Circle at the Top-Right?</span>
                </div>
                <p>
                  The top-right quadrant (Score 75-100) represents the <strong>Golden Opportunity Zone</strong>! It combines high novelty (Y &gt; 75) with an uncrowded open market (X &gt; 75%).
                </p>
              </div>

              <div className="p-3.5 bg-forge-black rounded-blueprint border border-quenched-steel/30 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                  <GitBranch className="w-4 h-4" />
                  <span>3. Color Code Legend</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-ember"></span> Red = Your Opportunity Space
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#4a6274]"></span> Blue = Existing GitHub Repos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span> Orange = Research Papers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Green = Datasets
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-forge-black rounded-blueprint border border-quenched-steel/30 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>4. What are the Dotted Red Lines?</span>
                </div>
                <p>
                  Dotted red lines indicate the <strong>Gap Distance (+% GAP)</strong> between existing tools and your opportunity. A larger gap percentage means your solution offers a bigger step forward!
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="md" onClick={() => setShowGuideModal(false)}>
                Got it, take me back to Map!
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}

export default React.memo(GapMapGraph);


