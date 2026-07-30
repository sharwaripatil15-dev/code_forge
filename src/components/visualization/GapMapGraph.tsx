'use client';

import React, { useState, useEffect } from 'react';
import { GapNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Target, Sparkles, ExternalLink, BookOpen, GitBranch } from 'lucide-react';

interface GapMapGraphProps {
  nodes: GapNode[];
  whiteSpaceTitle: string;
  whiteSpaceDescription: string;
}

// Guaranteed safe layout slot coordinates to prevent top/bottom/side clipping
// All coordinates stay safely within SVG ViewBox: x in [140, 470], y in [100, 390]
const CLUSTER_SLOTS = [
  { x: 170, y: 115 }, // Top Left
  { x: 350, y: 100 }, // Top Center
  { x: 145, y: 250 }, // Mid Left
  { x: 320, y: 235 }, // Mid Center
  { x: 470, y: 180 }, // Mid Right
  { x: 195, y: 385 }, // Bottom Left
  { x: 385, y: 370 }, // Bottom Center
];

const NODE_COLORS: Record<string, string> = {
  repo: '#4a6274',       // Quenched steel
  paper: '#ff9500',      // Amber molten
  dataset: '#10b981',    // Emerald
  opportunity: '#ff3b00',// Ember
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

export default function GapMapGraph({ nodes, whiteSpaceTitle, whiteSpaceDescription }: GapMapGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GapNode | null>(null);

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

  // Compute node positions dynamically with safe margins
  const computedNodes = React.useMemo(() => {
    let nonOppCount = 0;
    return normalizedNodes.map((node) => {
      const isOpportunity = checkIsOpportunity(node);
      let x = 650;
      let y = 230;

      if (!isOpportunity) {
        const slot = CLUSTER_SLOTS[nonOppCount % CLUSTER_SLOTS.length];
        const cycle = Math.floor(nonOppCount / CLUSTER_SLOTS.length);
        x = Math.max(130, Math.min(480, slot.x + cycle * 20));
        y = Math.max(95, Math.min(390, slot.y + cycle * 15));
        nonOppCount++;
      }

      const color = NODE_COLORS[node.type] || (isOpportunity ? '#ff3b00' : '#4a6274');
      return { ...node, x, y, color, isOpportunity };
    });
  }, [normalizedNodes]);

  const oppNode = computedNodes.find((n) => n.isOpportunity) || { x: 650, y: 230 };
  const regularNodes = computedNodes.filter((n) => !n.isOpportunity);

  // Compute dynamic connection lines (mesh structure + ember opportunity bridges)
  const connections = React.useMemo(() => {
    const lines: Array<{ id: string; x1: number; y1: number; x2: number; y2: number; isBridge: boolean }> = [];

    // Structured cluster connections
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

    // Dotted opportunity bridges from closest cluster nodes
    const bridgeCandidates = [...regularNodes].sort((a, b) => {
      const distA = Math.hypot(a.x - oppNode.x, a.y - oppNode.y);
      const distB = Math.hypot(b.x - oppNode.x, b.y - oppNode.y);
      return distA - distB;
    });

    bridgeCandidates.slice(0, Math.min(2, bridgeCandidates.length)).forEach((n, idx) => {
      lines.push({
        id: `opp-bridge-${idx}`,
        x1: n.x,
        y1: n.y,
        x2: oppNode.x,
        y2: oppNode.y,
        isBridge: true,
      });
    });

    return lines;
  }, [regularNodes, oppNode]);

  return (
    <Card variant="blueprint" className="p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
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
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ember"></span> Opportunity
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4a6274]"></span> Open Repos
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Papers
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Datasets
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[500px] bg-forge-black/90 border border-quenched-steel/25 rounded-blueprint overflow-hidden bg-blueprint-grid">
        <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {/* SVG-Native Concentric Radar Rings locked to Opportunity Node */}
          <circle
            cx={oppNode.x}
            cy={oppNode.y}
            r={135}
            fill="rgba(255, 59, 0, 0.03)"
            stroke="rgba(255, 59, 0, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse-slow"
          />
          <circle
            cx={oppNode.x}
            cy={oppNode.y}
            r={90}
            fill="rgba(255, 59, 0, 0.06)"
            stroke="rgba(255, 59, 0, 0.35)"
            strokeWidth="1.5"
          />
          
          {/* WHITE SPACE ZONE Badge directly inside SVG above Opportunity Node */}
          <g transform={`translate(${oppNode.x}, ${oppNode.y - 105})`}>
            <rect
              x={-68}
              y={-11}
              width={136}
              height={22}
              rx={5}
              fill="#0b0f14"
              fillOpacity={0.95}
              stroke="#ff3b00"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <text
              x={0}
              y={4}
              textAnchor="middle"
              fill="#ff3b00"
              fontSize={9}
              fontFamily="var(--font-jetbrains)"
              fontWeight="bold"
              letterSpacing="0.15em"
            >
              WHITE SPACE ZONE
            </text>
          </g>

          {/* Connection Lines */}
          {connections.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.isBridge ? '#ff3b00' : 'rgba(74, 98, 116, 0.35)'}
              strokeWidth={line.isBridge ? 2.5 : 1.5}
              strokeDasharray={line.isBridge ? '6 6' : undefined}
              className={line.isBridge ? 'opacity-80' : 'opacity-60'}
            />
          ))}

          {/* Render Cluster & Opportunity Nodes */}
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
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                {isOpportunity ? (
                  <g className="select-none">
                    {/* Pinging radar outer ring */}
                    <circle r={34} fill="none" stroke="#ff3b00" strokeWidth="2" className="animate-ping opacity-40" />

                    {/* Opportunity Center Circle */}
                    <circle
                      r={22}
                      fill="#ff3b00"
                      stroke={isSelected ? '#f3f2ee' : '#ff9500'}
                      strokeWidth={isSelected ? 3 : 2}
                      className="shadow-2xl"
                    />

                    {/* Opportunity Backdrop Card & Text Label */}
                    <g transform="translate(0, 32)">
                      <rect
                        x={-115}
                        y={0}
                        width={230}
                        height={44}
                        rx={6}
                        fill="#0b0f14"
                        fillOpacity={0.95}
                        stroke="#ff3b00"
                        strokeWidth={1.5}
                        strokeOpacity={0.8}
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
                        ✦ YOUR OPPORTUNITY SPACE
                      </text>
                      <text
                        x={0}
                        y={31}
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
                    {/* Standard Node Base Circle */}
                    <circle
                      r={isSelected ? 18 : 14}
                      fill={node.color}
                      stroke={isSelected ? '#f3f2ee' : 'rgba(0,0,0,0.6)'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="shadow-lg"
                    />

                    {/* Standard Node Label Backdrop Card */}
                    <g transform={`translate(0, ${isSelected ? 24 : 20})`}>
                      <rect
                        x={-65}
                        y={0}
                        width={130}
                        height={22}
                        rx={4}
                        fill="#0b0f14"
                        fillOpacity={0.9}
                        stroke={isSelected ? '#f3f2ee' : 'rgba(74,98,116,0.4)'}
                        strokeWidth={1}
                      />
                      <text
                        x={0}
                        y={15}
                        textAnchor="middle"
                        fill={isSelected ? '#f3f2ee' : '#d1d5db'}
                        fontSize={9.5}
                        fontFamily="var(--font-jetbrains)"
                        fontWeight={isSelected ? 'bold' : '500'}
                      >
                        {cleanLabel.length > 20 ? cleanLabel.slice(0, 18) + '...' : cleanLabel}
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
        <Card variant="solid" className="p-5 space-y-2.5 border-quenched-steel/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedNode.type === 'opportunity' ? (
                <Sparkles className="w-5 h-5 text-brand-ember" />
              ) : selectedNode.type === 'paper' ? (
                <BookOpen className="w-5 h-5 text-amber-500" />
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
                className="text-xs font-mono text-brand-ember hover:text-amber-molten font-bold flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-brand-ember rounded px-2 py-1 bg-brand-ember/10 border border-brand-ember/20"
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

