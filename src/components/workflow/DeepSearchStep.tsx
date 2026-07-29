'use client';

import React, { useState, useEffect } from 'react';
import { DeepSearchState } from '@/lib/types';
import { Search, BookOpen, GitBranch, Globe, ArrowRight, Layers, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface DeepSearchStepProps {
  data: DeepSearchState;
  onContinue: () => void;
}

export default function DeepSearchStep({ data, onContinue }: DeepSearchStepProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'papers' | 'repos' | 'web'>('all');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

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
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8">
      
      {/* Header & Status Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#121218]/90 border border-zinc-800/90 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-500">
              <Search className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">DeepSearch Multi-Source Intelligence</h2>
            
            {data.isLive ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Gemini Search
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Reliability Dynamic Engine
              </span>
            )}
          </div>

          <p className="text-sm text-zinc-400 font-medium">
            Multi-source analysis for: <span className="text-white font-bold">"{data.input.idea}"</span>
          </p>
        </div>

        <button
          onClick={onContinue}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-500/20 transition self-start md:self-auto shrink-0"
        >
          <span>Explore Interactive Gap Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scanning Progress Bar */}
      {isScanning && (
        <div className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <span>Synthesizing multi-source knowledge clusters...</span>
            <span className="text-brand-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-orange-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Knowledge Clusters Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span>Knowledge Clusters & Approach Families</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="p-6 bg-[#121218]/80 border border-zinc-800 rounded-2xl space-y-3 hover:border-zinc-700 transition shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: cluster.color }}
                >
                  {cluster.name}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400">{cluster.itemCount} sources</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-medium">{cluster.description}</p>
              
              <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                <span className="font-bold text-zinc-300">Trend: </span>{cluster.dominantTrend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            All Sources ({data.papers.length + data.repos.length + data.webInsights.length})
          </button>

          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'papers' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> arXiv Papers ({data.papers.length})
          </button>

          <button
            onClick={() => setActiveTab('repos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'repos' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> GitHub Repos ({data.repos.length})
          </button>

          <button
            onClick={() => setActiveTab('web')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'web' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Web Intel ({data.webInsights.length})
          </button>
        </div>
      </div>

      {/* Results Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* arXiv Papers */}
        {(activeTab === 'all' || activeTab === 'papers') &&
          data.papers.map((paper) => (
            <div
              key={paper.id}
              className="p-6 bg-[#121218]/80 border border-zinc-800 rounded-2xl space-y-4 hover:border-brand-500/40 transition shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-500 shrink-0" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">arXiv Paper</span>
                </div>
                <span className="px-2.5 py-1 bg-zinc-800/80 text-brand-400 rounded-md text-[10px] font-mono font-bold border border-zinc-700/60">
                  {paper.citationsCount} Citations
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-white group-hover:text-brand-400 transition leading-snug">
                {paper.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-medium">{paper.summary}</p>

              <div className="flex items-center justify-between pt-3 text-[11px] text-zinc-400 border-t border-zinc-800/80">
                <span className="truncate max-w-[220px]">{paper.authors.join(', ')} ({paper.publishedDate})</span>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1 shrink-0"
                >
                  <span>PDF Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

        {/* GitHub Repos */}
        {(activeTab === 'all' || activeTab === 'repos') &&
          data.repos.map((repo) => (
            <div
              key={repo.id}
              className="p-6 bg-[#121218]/80 border border-zinc-800 rounded-2xl space-y-4 hover:border-brand-500/40 transition shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GitHub Repository</span>
                </div>
                <span className="px-2.5 py-1 bg-zinc-800/80 text-amber-400 rounded-md text-[10px] font-mono font-bold border border-zinc-700/60">
                  ★ {repo.stars} stars
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-white group-hover:text-brand-400 transition">
                {repo.fullName}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-medium">{repo.description}</p>

              <div className="flex items-center justify-between pt-3 text-[11px] text-zinc-400 border-t border-zinc-800/80">
                <span className="font-mono font-bold text-zinc-300">{repo.primaryLanguage}</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

        {/* Web Insights */}
        {(activeTab === 'all' || activeTab === 'web') &&
          data.webInsights.map((web) => (
            <div
              key={web.id}
              className="p-6 bg-[#121218]/80 border border-zinc-800 rounded-2xl space-y-4 hover:border-brand-500/40 transition shadow-lg group"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{web.source}</span>
              </div>

              <h4 className="text-sm font-extrabold text-white group-hover:text-brand-400 transition">
                {web.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-medium">{web.snippet}</p>

              <div className="flex items-center justify-end pt-3 text-[11px] border-t border-zinc-800/80">
                <a
                  href={web.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <span>Read Full Intel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
