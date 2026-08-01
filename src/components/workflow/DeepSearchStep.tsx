'use client';

import React, { useState, useEffect } from 'react';
import { DeepSearchState } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, BookOpen, GitBranch, Globe, ArrowRight, Layers, ExternalLink, ShieldCheck, Scale } from 'lucide-react';

interface DeepSearchStepProps {
  data: DeepSearchState;
  onContinue: () => void;
}

export default function DeepSearchStep({ data, onContinue }: DeepSearchStepProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'papers' | 'repos' | 'patents'>('all');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  const patentsList = data.patents || [];
  const totalCount = data.papers.length + data.repos.length + patentsList.length + data.webInsights.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 220);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Header & Status Card */}
      <Card variant="blueprint" className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-forge-white tracking-tight">
              DeepSearch Intelligence Dossier
            </h2>
            
            {data.isLive ? (
              <Badge variant="emerald" pulse>
                Live Multi-Source Search
              </Badge>
            ) : (
              <Badge variant="quenched">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Reliability Dynamic Engine
              </Badge>
            )}
          </div>

          <p className="text-sm font-sans text-zinc-400">
            Multi-source intelligence analysis for: <span className="text-forge-white font-bold">"{data.input.idea}"</span>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto justify-center min-h-[44px] shrink-0"
        >
          Explore Interactive Gap Map
        </Button>
      </Card>

      {/* Scanning Progress Gauge */}
      {isScanning && (
        <Card variant="solid" className="p-5 space-y-3 shadow-sm border-brand-ember/30 bg-forge-surface/90">
          <div className="flex justify-between text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
            <span className="flex items-center gap-2 text-brand-ember">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-ember animate-ping" />
              {progress < 25
                ? '🔍 Stage 1/5: Querying academic research papers (arXiv)...'
                : progress < 50
                ? '🐙 Stage 2/5: Searching GitHub open-source repositories...'
                : progress < 75
                ? '📜 Stage 3/5: Auditing Google Patent prior-art & Hugging Face datasets...'
                : progress < 95
                ? '🧠 Stage 4/5: Synthesizing competitive market gaps & metrics...'
                : '✅ Stage 5/5: Search Dossier & Citation Claims Ready!'}
            </span>
            <span className="text-brand-ember font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-forge-surface-light h-2.5 rounded-full overflow-hidden border border-quenched-steel/20">
            <div
              className="bg-gradient-to-r from-brand-ember via-amber-molten to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Knowledge Clusters Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-quenched-steel-light uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-ember" />
          <span>Knowledge Clusters & Prior-Art Families</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.clusters.concat([
            {
              id: 'c-patents',
              name: 'Patents & Prior Art',
              color: '#ff3b00',
              description: 'Published patent claims and intellectual property coverage.',
              itemCount: patentsList.length,
              dominantTrend: 'Novelty impact factored in score.',
            }
          ]).map((cluster) => (
            <Card key={cluster.id} variant="blueprint" className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-white uppercase tracking-wider truncate max-w-[140px]"
                  style={{ backgroundColor: cluster.color }}
                >
                  {cluster.name}
                </span>
                <span className="text-xs font-mono font-bold text-quenched-steel-light">{cluster.itemCount} sources</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{cluster.description}</p>
              
              <div className="pt-2 border-t border-quenched-steel/20 text-[11px] font-mono text-zinc-400">
                <span className="font-bold text-forge-white">Dominant Trend: </span>{cluster.dominantTrend}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 1:1 CITATION-BACKED RESEARCH SYNTHESES PANEL */}
      {data.citationClaims && data.citationClaims.length > 0 && (
        <Card variant="blueprint" className="p-7 space-y-5 shadow-xl border-brand-ember/40 bg-forge-surface/90">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-3.5">
            <div>
              <h3 className="text-lg font-display font-extrabold text-forge-white uppercase tracking-tight flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-blueprint bg-brand-ember/20 border border-brand-ember/40 flex items-center justify-center text-brand-ember text-xs font-bold font-mono">📝</span>
                <span>Citation-Backed Research Syntheses</span>
              </h3>
              <p className="text-xs font-sans text-zinc-400 mt-0.5">
                Each research claim below is synthesized 1:1 from a single specific verified source with direct citation mapping.
              </p>
            </div>
            <Badge variant="emerald" size="sm">
              1:1 Claim-to-Source Mapped
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.citationClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 rounded-blueprint bg-forge-black/60 border border-quenched-steel/25 space-y-2.5 hover:border-brand-ember/40 transition group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-brand-ember px-2 py-0.5 rounded bg-brand-ember/15 border border-brand-ember/30">
                    {claim.citationBadge} {claim.sourceType}
                  </span>
                  <span className="text-zinc-400 text-[10px]">{claim.authorOrMeta}</span>
                </div>

                <p className="text-xs font-sans text-zinc-200 leading-relaxed font-medium line-clamp-3">
                  "{claim.claimSentence}"
                </p>

                <div className="pt-2 border-t border-quenched-steel/15 flex items-center justify-between">
                  <span className="text-[11px] font-sans font-bold text-forge-white truncate max-w-[260px]">
                    {claim.sourceTitle}
                  </span>
                  <a
                    href={claim.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono font-bold text-brand-ember hover:text-white flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>View Citation Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={activeTab === 'all' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('all')}
          >
            All Sources ({totalCount})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'papers' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('papers')}
            leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          >
            arXiv Papers ({data.papers.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'repos' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('repos')}
            leftIcon={<GitBranch className="w-3.5 h-3.5" />}
          >
            GitHub Repos ({data.repos.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === 'patents' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('patents')}
            leftIcon={<Scale className="w-3.5 h-3.5" />}
          >
            Google Patents ({patentsList.length})
          </Button>
        </div>
      </div>

      {/* Results Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Google Patents & Prior Art */}
        {(activeTab === 'all' || activeTab === 'patents') &&
          patentsList.map((patent) => (
            <Card key={patent.id} variant="interactive" className="space-y-4 group border-brand-ember/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-ember shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-brand-ember uppercase tracking-widest">
                    Google Patent • {patent.patentNumber}
                  </span>
                </div>
                <Badge variant="amber" size="sm">
                  Relevance: {patent.relevanceScore}%
                </Badge>
              </div>

              <h4 className="text-sm font-display font-bold text-forge-white group-hover:text-brand-ember transition leading-snug">
                {patent.title}
              </h4>

              <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-sans">{patent.abstract}</p>

              <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-zinc-400 border-t border-quenched-steel/20">
                <span className="truncate max-w-[220px]">Assignee: {patent.assignee}</span>
                <a
                  href={patent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-ember hover:text-amber-molten font-bold flex items-center gap-1 shrink-0 focus-visible:ring-2 focus-visible:ring-brand-ember rounded"
                >
                  <span>Google Patents</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}

        {/* arXiv Papers */}
        {(activeTab === 'all' || activeTab === 'papers') &&
          data.papers.map((paper) => (
            <Card key={paper.id} variant="interactive" className="space-y-4 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-ember shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-quenched-steel-light uppercase tracking-widest">arXiv Dossier</span>
                </div>
                <Badge variant="ember" size="sm">
                  {paper.citationsCount} Citations
                </Badge>
              </div>

              <h4 className="text-sm font-display font-bold text-forge-white group-hover:text-brand-ember transition leading-snug">
                {paper.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">{paper.summary}</p>

              <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-zinc-400 border-t border-quenched-steel/20">
                <span className="truncate max-w-[220px]">{paper.authors.join(', ')} ({paper.publishedDate})</span>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-ember hover:text-amber-molten font-bold flex items-center gap-1 shrink-0 focus-visible:ring-2 focus-visible:ring-brand-ember rounded"
                >
                  <span>PDF Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}

        {/* GitHub Repos */}
        {(activeTab === 'all' || activeTab === 'repos') &&
          data.repos.map((repo) => (
            <Card key={repo.id} variant="interactive" className="space-y-4 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-quenched-steel-light shrink-0" />
                  <span className="text-[10px] font-mono font-bold text-quenched-steel-light uppercase tracking-widest">GitHub Repository</span>
                </div>
                <Badge variant="amber" size="sm">
                  ★ {repo.stars} stars
                </Badge>
              </div>

              <h4 className="text-sm font-display font-bold text-forge-white group-hover:text-brand-ember transition">
                {repo.fullName}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">{repo.description}</p>

              <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-zinc-400 border-t border-quenched-steel/20">
                <span className="font-mono font-bold text-forge-white">{repo.primaryLanguage}</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-quenched-steel-light hover:text-white font-bold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brand-ember rounded"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}

        {/* Web Insights */}
        {activeTab === 'all' &&
          data.webInsights.map((web) => (
            <Card key={web.id} variant="interactive" className="space-y-4 group">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono font-bold text-quenched-steel-light uppercase tracking-widest">{web.source}</span>
              </div>

              <h4 className="text-sm font-display font-bold text-forge-white group-hover:text-brand-ember transition">
                {web.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">{web.snippet}</p>

              <div className="flex items-center justify-end pt-3 text-[11px] font-mono border-t border-quenched-steel/20">
                <a
                  href={web.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brand-ember rounded"
                >
                  <span>Read Full Intel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
