'use client';

import React, { useState, useEffect } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, ChevronLeft, ChevronRight, Rocket, Flame, Layers, ShieldCheck, Target, TrendingUp, Users, DollarSign, Cpu, FileText, Printer, Mic, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PitchDeckModalProps {
  blueprint: ProjectBlueprint;
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchDeckModal({ blueprint, isOpen, onClose }: PitchDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [themeMode, setThemeMode] = useState<'cyberpunk' | 'blueprint' | 'gold'>('cyberpunk');

  const presenterNotes: Record<number, string> = {
    0: `Welcome investors! Today we are introducing ${blueprint.title || 'this project'}. Our vision is to eliminate manual friction using automated AI pipelines.`,
    1: `The primary problem in the industry is manual fragmentation. Customers spend hours on tasks that AI can solve in seconds.`,
    2: `Our breakthrough solution leverages Gemini 1.5 Pro and 3D System Blueprints to automate the entire lifecycle automatically.`,
    3: `Unlike generic competitors, our strategic moat is integrating deep research grounding with instant code scaffold generation.`,
    4: `Our architecture features a 4-tier microservice stack: Client, API Gateway, AI Engine, and Supabase Postgres.`,
    5: `We selected Next.js 14, Supabase, Gemini 1.5, and Vercel Edge for maximum serverless scalability.`,
    6: `Our monetization model combines a Freemium entry tier with a $29/mo Pro tier and Enterprise API seats.`,
    7: `Our 4-week execution roadmap gets us to production MVP in 28 days with clear weekly milestones.`,
    8: `We are assembling a 4-person lean team: Fullstack Engineer, AI Prompt Engineer, UI/UX Designer, and Product Lead.`,
    9: `Thank you for your time! We are raising our seed round to accelerate production deployment.`,
  };

  const slides = [
    {
      slideNum: 1,
      title: blueprint.title || 'IdeaForge Innovation',
      subtitle: blueprint.tagline || 'Next-Generation AI Venture',
      badge: '01. COVER & VISION',
      icon: Flame,
      content: (
        <div className="space-y-6 text-center py-8">
          <div className="inline-flex p-4 rounded-2xl bg-brand-ember/20 border border-brand-ember/40 text-brand-ember shadow-2xl shadow-brand-ember/20">
            <Flame className="w-12 h-12 animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              {blueprint.title || 'IdeaForge Project'}
            </h1>
            <p className="text-lg text-amber-molten font-mono font-bold mt-3">
              {blueprint.tagline || 'AI-Powered Scalable Startup Solution'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-forge-black/80 border border-quenched-steel/30 max-w-xl mx-auto text-xs text-zinc-300 font-sans leading-relaxed">
            {blueprint.problemStatement?.slice(0, 160) || 'Transforming complex challenges into scalable AI products.'}
          </div>
        </div>
      ),
    },
    {
      slideNum: 2,
      title: 'The Problem Statement',
      subtitle: 'Key Market Friction & Inefficiencies',
      badge: '02. THE PROBLEM',
      icon: Target,
      content: (
        <div className="space-y-6 py-4">
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <Target className="w-5 h-5" /> Core Pain Point
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              {blueprint.problemStatement || 'High fragmentation and manual friction severely slow down execution speed.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      slideNum: 3,
      title: 'Our Solution & Breakthrough',
      subtitle: 'Automated AI Pipeline & Seamless Experience',
      badge: '03. THE SOLUTION',
      icon: Rocket,
      content: (
        <div className="space-y-6 py-4">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Rocket className="w-5 h-5" /> The AI Innovation
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              {blueprint.uniqueValueProposition || blueprint.executiveSummary || 'An end-to-end AI workspace that validates ideas, analyzes market gaps, and builds 3D blueprints.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      slideNum: 4,
      title: 'Competitive White-Space Gap',
      subtitle: 'Market Differentiation & Strategic Moat',
      badge: '04. MARKET MOAT',
      icon: TrendingUp,
      content: (
        <div className="space-y-4 py-4">
          <div className="p-5 rounded-xl bg-forge-black border border-cyan-500/30 space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 font-mono">Differentiator White-Space</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {blueprint.uniqueValueProposition || 'Integrated AI Reasoning + Interactive 3D System Canvas.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      slideNum: 5,
      title: '3D System Architecture',
      subtitle: 'Multi-Layer Pipeline & Microservices',
      badge: '05. SYSTEM ARCHITECTURE',
      icon: Layers,
      content: (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {['Presentation (Web/Mobile)', 'API & Gateway Pipeline', 'AI Reasoning & LLM', 'Data & Vector Storage'].map((layer, i) => (
              <div key={i} className="p-4 rounded-xl bg-forge-black/90 border border-brand-ember/30 space-y-1">
                <span className="text-brand-ember font-bold block text-[10px]">LAYER 0{i + 1}</span>
                <span className="text-white font-extrabold">{layer}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      slideNum: 6,
      title: 'Recommended Tech Stack',
      subtitle: 'Production-Grade Infrastructure',
      badge: '06. TECH STACK',
      icon: Cpu,
      content: (
        <div className="grid grid-cols-2 gap-3 py-4 text-xs font-mono">
          {(blueprint.techStack || [
            { category: 'Frontend', chosen: 'Next.js 14, React 18, Tailwind' },
            { category: 'Backend / AI', chosen: 'Node.js, Gemini API, Express' },
            { category: 'Database', chosen: 'Supabase Postgres, PgVector' },
            { category: 'Deployment', chosen: 'Vercel Edge, Docker, GitHub' },
          ]).map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-forge-black border border-quenched-steel/30 space-y-1">
              <span className="text-amber-400 font-bold block text-[10px] uppercase">{item.category}</span>
              <span className="text-white font-bold">{item.chosen}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      slideNum: 7,
      title: 'Business & Monetization Model',
      subtitle: 'Revenue Streams & Unit Economics',
      badge: '07. BUSINESS MODEL',
      icon: DollarSign,
      content: (
        <div className="space-y-4 py-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
            <span className="text-white font-bold">Freemium Tier</span>
            <span className="text-emerald-400 font-bold">$0 / Month (3 Free Validations)</span>
          </div>
          <div className="p-4 rounded-xl bg-brand-ember/15 border border-brand-ember/40 flex justify-between items-center">
            <span className="text-white font-bold">Pro Founder Plan</span>
            <span className="text-brand-ember font-extrabold">$29 / Month (Unlimited 3D Specs)</span>
          </div>
        </div>
      ),
    },
    {
      slideNum: 8,
      title: 'Execution Roadmap & Phases',
      subtitle: '4-Week Sprint Schedule',
      badge: '08. EXECUTION ROADMAP',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 py-4 text-xs font-mono">
          {(blueprint.timeline?.phases || [
            { phaseName: 'Phase 1: Foundations', duration: 'Week 1', goal: 'Core engine setup' },
            { phaseName: 'Phase 2: AI Reasoning', duration: 'Week 2', goal: 'Gemini API integration' },
            { phaseName: 'Phase 3: Integration', duration: 'Week 3', goal: 'Webhooks & alert triggers' },
            { phaseName: 'Phase 4: Deployment', duration: 'Week 4', goal: 'Vercel deployment & launch' },
          ]).map((phase, i) => (
            <div key={i} className="p-3 rounded-xl bg-forge-black border border-quenched-steel/30 flex justify-between items-center">
              <span className="text-brand-ember font-bold">{phase.phaseName}</span>
              <span className="text-zinc-400">{phase.duration}</span>
              <span className="text-emerald-400 font-bold">{phase.goal}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      slideNum: 9,
      title: 'Team & Skill Requirements',
      subtitle: 'Core Roles Needed for Execution',
      badge: '09. TEAM STRUCTURE',
      icon: Users,
      content: (
        <div className="grid grid-cols-2 gap-3 py-4 text-xs font-mono">
          {['Fullstack Engineer (Next.js)', 'AI / Prompt Engineer', 'UI/UX Designer', 'Product Lead'].map((role, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-forge-black border border-quenched-steel/30 text-center font-bold text-cyan-400">
              👤 {role}
            </div>
          ))}
        </div>
      ),
    },
    {
      slideNum: 10,
      title: 'Join Us in Building the Future',
      subtitle: 'Ready for Launch & Investment',
      badge: '10. CALL TO ACTION',
      icon: Sparkles,
      content: (
        <div className="space-y-6 text-center py-8">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-2xl">
            <Sparkles className="w-12 h-12 animate-bounce" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white">Let’s Build {blueprint.title || 'This Project'}</h2>
          <p className="text-sm font-mono text-emerald-400 font-bold">Validated by IdeaForge AI • Ready for Development</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const themeClasses = {
    cyberpunk: 'bg-forge-surface border-brand-ember/40',
    blueprint: 'bg-slate-950 border-cyan-500/50',
    gold: 'bg-zinc-950 border-amber-500/50',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in">
      <div className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between min-h-[620px] transition-all duration-300 ${themeClasses[themeMode]}`}>
        <div className="p-4 bg-forge-black/90 border-b border-quenched-steel/30 flex items-center justify-between z-20 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-ember/20 border border-brand-ember/40 text-brand-ember">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="ember" size="sm" className="font-mono text-[10px]">
                  {slide.badge}
                </Badge>
                <span className="text-xs font-mono text-zinc-400">Slide {currentSlide + 1} of {slides.length}</span>
              </div>
              <h3 className="text-base font-display font-extrabold text-white">{slide.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-forge-black p-1 rounded-lg border border-quenched-steel/30 text-xs font-mono">
              <button onClick={() => setThemeMode('cyberpunk')} className={`px-2 py-0.5 rounded transition ${themeMode === 'cyberpunk' ? 'bg-brand-ember text-white' : 'text-zinc-400'}`}>Cyber</button>
              <button onClick={() => setThemeMode('blueprint')} className={`px-2 py-0.5 rounded transition ${themeMode === 'blueprint' ? 'bg-cyan-500 text-white' : 'text-zinc-400'}`}>Blue</button>
              <button onClick={() => setThemeMode('gold')} className={`px-2 py-0.5 rounded transition ${themeMode === 'gold' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400'}`}>Gold</button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowPresenterNotes(!showPresenterNotes)} className={`text-xs font-mono ${showPresenterNotes ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'}`}>
              <FileText className="w-3.5 h-3.5 mr-1" /> Notes
            </Button>

            <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs font-mono text-zinc-300">
              <Printer className="w-3.5 h-3.5 mr-1" /> PDF
            </Button>

            <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-quenched-steel/20 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showPresenterNotes && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 p-3 text-xs font-mono text-amber-300 flex items-start gap-2.5">
            <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold block uppercase text-[10px] text-amber-400 tracking-wider">Presenter Script:</span>
              <p className="leading-relaxed text-zinc-200 mt-0.5">{presenterNotes[currentSlide]}</p>
            </div>
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col justify-center overflow-y-auto">
          {slide.content}
        </div>

        <div className="p-4 bg-forge-black/90 border-t border-quenched-steel/30 flex items-center justify-between z-20">
          <Button variant="outline" size="sm" onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))} disabled={currentSlide === 0} className="text-xs font-mono">
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-1.5 hidden sm:flex">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition ${currentSlide === idx ? 'bg-brand-ember scale-125' : 'bg-zinc-700'}`} />
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (currentSlide === slides.length - 1) {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                onClose();
              } else {
                setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
              }
            }}
            className="text-xs font-mono"
          >
            {currentSlide === slides.length - 1 ? 'Finish Presentation' : 'Next Slide'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
