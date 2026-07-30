'use client';

import React from 'react';
import { BuildResourcesPanelData } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Database, Package, BookOpen, GraduationCap, ExternalLink, Star, Download, Heart, ArrowUpRight } from 'lucide-react';

interface BuildResourcesPanelProps {
  resources?: BuildResourcesPanelData;
  projectTitle: string;
}

export default function BuildResourcesPanel({ resources, projectTitle }: BuildResourcesPanelProps) {
  if (!resources) return null;

  return (
    <Card variant="blueprint" className="p-8 space-y-8 shadow-xl border-brand-ember/30">
      
      {/* Header */}
      <div className="border-b border-quenched-steel/20 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-display font-extrabold text-forge-white uppercase tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-blueprint bg-brand-ember/20 border border-brand-ember/40 flex items-center justify-center text-brand-ember">🧰</span>
              <span>Build With This: Developer Resources & Datasets</span>
            </h3>
            <Badge variant="emerald" size="sm">
              Purpose-Built Toolkit
            </Badge>
          </div>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            Curated open datasets, starter boilerplates, foundational reading, and verified official documentation for {projectTitle}.
          </p>
        </div>
      </div>

      {/* 4-Grid Category Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. DATASETS (Hugging Face Datasets Hub API) */}
        <div className="bg-forge-surface/90 border border-quenched-steel/25 p-5 rounded-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-3">
            <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>1. Open Datasets (Hugging Face Hub)</span>
            </h4>
            <Badge variant="quenched" size="sm">
              {resources.datasets.length} Datasets
            </Badge>
          </div>

          <div className="space-y-3">
            {resources.datasets.map((ds) => (
              <a
                key={ds.id}
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 rounded-blueprint bg-forge-black/50 border border-quenched-steel/20 hover:border-emerald-500/50 hover:bg-forge-surface-light transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300 transition flex items-center gap-1">
                    {ds.id}
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </span>
                  <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-quenched-steel-light" />
                      {ds.downloads > 1000 ? `${(ds.downloads / 1000).toFixed(1)}k` : ds.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      {ds.likes}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-sans text-zinc-300 mt-1.5 line-clamp-2">
                  {ds.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {ds.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-quenched-steel/20 text-quenched-steel-light border border-quenched-steel/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. REPOS TO BUILD WITH (Libraries & Starter Kits) */}
        <div className="bg-forge-surface/90 border border-quenched-steel/25 p-5 rounded-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-3">
            <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-ember" />
              <span>2. Starter Repos & SDKs to Build With</span>
            </h4>
            <Badge variant="ember" size="sm">
              {resources.buildRepos.length} Repos
            </Badge>
          </div>

          <div className="space-y-3">
            {resources.buildRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 rounded-blueprint bg-forge-black/50 border border-quenched-steel/20 hover:border-brand-ember/50 hover:bg-forge-surface-light transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-brand-ember group-hover:text-amber-molten transition flex items-center gap-1">
                    {repo.fullName}
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-molten" />
                    {repo.stars}
                  </span>
                </div>

                <p className="text-xs font-sans text-zinc-300 mt-1.5 line-clamp-2">
                  {repo.description}
                </p>

                <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono">
                  <span className="text-zinc-400">Lang: <strong className="text-forge-white">{repo.primaryLanguage}</strong></span>
                  <span className="text-brand-ember font-bold">Use: Builder Toolkit</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 3. FOUNDATIONAL RESEARCH & TECHNIQUE PAPERS */}
        <div className="bg-forge-surface/90 border border-quenched-steel/25 p-5 rounded-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-3">
            <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>3. Foundational Papers & Technique Reading</span>
            </h4>
            <Badge variant="quenched" size="sm">
              {resources.foundationalPapers.length} Papers
            </Badge>
          </div>

          <div className="space-y-3">
            {resources.foundationalPapers.map((paper) => (
              <a
                key={paper.id}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 rounded-blueprint bg-forge-black/50 border border-quenched-steel/20 hover:border-sky-400/50 hover:bg-forge-surface-light transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-sans font-bold text-sky-400 group-hover:text-sky-300 transition line-clamp-1">
                    {paper.title}
                  </span>
                  <ExternalLink className="w-3 h-3 text-sky-400 shrink-0 opacity-70 group-hover:opacity-100" />
                </div>

                <p className="text-xs font-sans text-zinc-300 mt-1.5 line-clamp-2">
                  {paper.summary}
                </p>

                <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono text-zinc-400">
                  <span>Authors: {paper.authors.join(', ')}</span>
                  <span className="text-sky-400 font-bold">Foundational</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 4. OFFICIAL DOCUMENTATION & LEARNING GUIDES */}
        <div className="bg-forge-surface/90 border border-quenched-steel/25 p-5 rounded-blueprint space-y-4">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-3">
            <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-molten" />
              <span>4. Official Documentation & Guides</span>
            </h4>
            <Badge variant="quenched" size="sm">
              {resources.learningResources.length} Resources
            </Badge>
          </div>

          <div className="space-y-3">
            {resources.learningResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 rounded-blueprint bg-forge-black/50 border border-quenched-steel/20 hover:border-amber-molten/50 hover:bg-forge-surface-light transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-sans font-bold text-amber-molten group-hover:text-amber-300 transition flex items-center gap-1">
                    {res.title}
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    {res.category}
                  </span>
                </div>

                <p className="text-xs font-sans text-zinc-300 mt-1.5 line-clamp-2">
                  {res.description}
                </p>

                <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono text-zinc-400">
                  <span>Provider: <strong className="text-forge-white">{res.provider}</strong></span>
                  <span className="text-emerald-400 font-bold">Verified Link</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
}
