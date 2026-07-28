'use client';

import React, { useState, useEffect } from 'react';
import { DeepSearchState } from '@/lib/types';
import { Search, BookOpen, GitBranch, Globe, ArrowRight, Layers, ExternalLink, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DeepSearchStepProps {
  data: DeepSearchState;
  onContinue: () => void;
}

export default function DeepSearchStep({ data, onContinue }: DeepSearchStepProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'papers' | 'repos' | 'web'>('all');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Live progress simulation for smooth UX
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-white">DeepSearch Multi-Source Intelligence</h2>
            {data.isLive ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Query
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Zero-Downtime Fallback Active
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Querying arXiv papers, GitHub repositories, and live web discussions for "{data.input.idea}"
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition self-start sm:self-auto"
        >
          <span>Explore Interactive Gap Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar during scan */}
      {isScanning && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-semibold text-zinc-400">
            <span>Synthesizing multi-source knowledge clusters...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-orange-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Knowledge Clusters Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Knowledge Clusters & Approach Families</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-5 bg-[#121216] border border-zinc-800 rounded-2xl space-y-2 hover:border-zinc-700 transition"
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: cluster.color }}
                >
                  {cluster.name}
                </span>
                <span className="text-xs font-mono text-zinc-400">{cluster.itemCount} sources</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">{cluster.description}</p>
              <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                <span className="font-semibold text-zinc-300">Trend:</span> {cluster.dominantTrend}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'all' ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Sources ({data.papers.length + data.repos.length + data.webInsights.length})
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'papers' ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> arXiv Papers ({data.papers.length})
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'repos' ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> GitHub Repos ({data.repos.length})
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'web' ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Web Intel ({data.webInsights.length})
          </button>
        </div>
      </div>

      {/* Results Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Research Papers */}
        {(activeTab === 'all' || activeTab === 'papers') &&
          data.papers.map((paper) => (
            <div
              key={paper.id}
              className="p-5 bg-[#121216] border border-zinc-800/90 rounded-2xl space-y-3 hover:border-brand-500/40 transition group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">arXiv Paper</span>
                </div>
                <span className="px-2 py-0.5 bg-zinc-800 text-brand-400 rounded text-[10px] font-mono font-bold">
                  {paper.citationsCount} Citations
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition leading-snug">
                {paper.title}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{paper.summary}</p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/80">
                <span>{paper.authors.join(', ')} ({paper.publishedDate})</span>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  <span>PDF Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

        {/* GitHub Repos */}
        {(activeTab === 'all' || activeTab === 'repos') &&
          data.repos.map((repo) => (
            <div
              key={repo.id}
              className="p-5 bg-[#121216] border border-zinc-800/90 rounded-2xl space-y-3 hover:border-brand-500/40 transition group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">GitHub Repo</span>
                </div>
                <span className="px-2 py-0.5 bg-zinc-800 text-amber-400 rounded text-[10px] font-mono font-bold">
                  ★ {repo.stars} stars
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition">
                {repo.fullName}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{repo.description}</p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/80">
                <span className="font-mono text-zinc-300">{repo.primaryLanguage}</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>View Code</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

        {/* Web Insights */}
        {(activeTab === 'all' || activeTab === 'web') &&
          data.webInsights.map((web) => (
            <div
              key={web.id}
              className="p-5 bg-[#121216] border border-zinc-800/90 rounded-2xl space-y-3 hover:border-brand-500/40 transition group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{web.source}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition">
                {web.title}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{web.snippet}</p>
              <div className="flex items-center justify-end pt-2 text-[11px] border-t border-zinc-800/80">
                <a
                  href={web.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Read Post</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
