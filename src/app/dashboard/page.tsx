'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AuthModal from '@/components/auth/AuthModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  LayoutDashboard, 
  Rocket, 
  TrendingUp, 
  CheckSquare, 
  Zap, 
  Calendar, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  PieChart, 
  PlusCircle, 
  RotateCcw, 
  FileDown, 
  Clock, 
  Target, 
  Layers,
  FolderGit2,
  Brain,
  ShieldCheck,
  Lock,
  Bot,
  UserCheck,
  Lightbulb,
  Search,
  Network,
  Swords,
  LogIn,
  UserPlus
} from 'lucide-react';
import { getOrCreateSession, getUserPlansFromSupabase, logoutUserSession, UserSession } from '@/lib/supabase';
import { DeepSearchState } from '@/lib/types';
import { LanguageCode } from '@/lib/translations';
import { exportBlueprintToPDF } from '@/lib/exportUtils';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<DeepSearchState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [activeTheme, setActiveTheme] = useState<'forge' | 'blueprint' | 'cyberpunk'>('forge');
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [exportingId, setExportingId] = useState<string | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<UserSession>({
    email: 'builder@ideaforge.ai',
    isLoggedIn: false,
    telegramConnectCode: 'FORGE-8421',
  });

  const handleLoginSuccess = (email: string) => {
    const updated: UserSession = {
      ...session,
      email,
      isLoggedIn: true,
    };
    setSession(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_user_session', JSON.stringify(updated));
    }
    loadDashboardData();
  };

  const handleLogout = () => {
    const updated = logoutUserSession();
    setSession(updated);
    setPlans([]);
  };

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setIsSessionChecking(true);
    const clientSession = getOrCreateSession();
    setSession(clientSession);

    try {
      if (clientSession.isLoggedIn) {
        // Fetch from Supabase for logged-in user
        const fetched = await getUserPlansFromSupabase(clientSession.email);
        if (fetched && fetched.length > 0) {
          setPlans(fetched);
        } else {
          // Fallback to local plans
          const fallbackPlans: DeepSearchState[] = [];
          if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('ideaforge_plan_')) {
                try {
                  const item = localStorage.getItem(key);
                  if (item) {
                    const parsed = JSON.parse(item);
                    if (parsed && (parsed.blueprint || parsed.input)) {
                      fallbackPlans.push(parsed);
                    }
                  }
                } catch (e) {
                  // ignore
                }
              }
            }
          }
          setPlans(fallbackPlans);
        }
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.warn('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsSessionChecking(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Load Saved Theme & Language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ideaforge_theme') as any;
      if (savedTheme && ['forge', 'blueprint', 'cyberpunk'].includes(savedTheme)) {
        setActiveTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      const savedLang = localStorage.getItem('ideaforge_language') as LanguageCode;
      if (savedLang) {
        setActiveLanguage(savedLang);
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const themes: ('forge' | 'blueprint' | 'cyberpunk')[] = ['forge', 'blueprint', 'cyberpunk'];
    const nextIndex = (themes.indexOf(activeTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setActiveTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setActiveLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_language', lang);
    }
  };

  const handleCreateNewIdea = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_active_step', 'input');
    }
    router.push('/app');
  };

  const handleResumePlan = (plan: DeepSearchState) => {
    if (typeof window !== 'undefined' && plan.id) {
      localStorage.setItem('ideaforge_last_active_plan', JSON.stringify(plan));
      localStorage.setItem('ideaforge_active_step', 'blueprint');
    }
    router.push('/app');
  };

  const handleExportPlanPDF = async (e: React.MouseEvent, plan: DeepSearchState) => {
    e.stopPropagation();
    if (!plan.blueprint) return;
    const planId = plan.id || plan.blueprint.title || 'plan';
    setExportingId(planId);
    try {
      const res = await exportBlueprintToPDF(plan.blueprint);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('Export PDF error:', err);
    } finally {
      setExportingId(null);
    }
  };

  // Aggregated Dashboard Analytics Calculations
  const totalProjects = session.isLoggedIn ? plans.length : 0;

  const totalNovelty = session.isLoggedIn && totalProjects > 0 ? plans.reduce((acc, p) => acc + (p.metrics?.noveltyScore || 85), 0) : 0;
  const avgNovelty = totalProjects > 0 ? Math.round(totalNovelty / totalProjects) : 0;

  const totalFeasibility = session.isLoggedIn && totalProjects > 0 ? plans.reduce((acc, p) => acc + (p.metrics?.feasibilityScore || 82), 0) : 0;
  const avgFeasibility = totalProjects > 0 ? Math.round(totalFeasibility / totalProjects) : 0;

  let totalMilestonesCount = 0;
  let completedMilestonesCount = 0;

  if (session.isLoggedIn) {
    plans.forEach((p) => {
      const milestones = p.blueprint?.milestones || [];
      totalMilestonesCount += milestones.length;
      completedMilestonesCount += milestones.filter((m) => m.completed).length;
    });
  }

  const overallMilestonePct = totalMilestonesCount > 0 
    ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
    : 0;

  // Most active recent plan
  const mostRecentPlan = session.isLoggedIn ? (plans[0] || null) : null;

  // 7 Pipeline Steps Definition
  const PIPELINE_STEPS = [
    {
      stepNumber: '01',
      title: 'Idea Input',
      icon: Lightbulb,
      color: 'text-amber-molten',
      bgColor: 'bg-amber-molten/10 border-amber-molten/30',
      description: 'Describe project idea, target user demographics, and domain category.',
    },
    {
      stepNumber: '02',
      title: 'DeepSearch',
      icon: Search,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      description: 'Multi-source AI synthesis across arXiv papers, GitHub repos, USPTO patents & live web intelligence.',
    },
    {
      stepNumber: '03',
      title: 'Gap Map',
      icon: Network,
      color: 'text-brand-ember',
      bgColor: 'bg-brand-ember/10 border-brand-ember/30',
      description: 'Interactive 2D force-directed opportunity graph plotting novelty vs. feasibility white-spaces.',
    },
    {
      stepNumber: '04',
      title: "Devil's Advocate",
      icon: Swords,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      description: 'Dynamic AI stress-testing across uniqueness, feasibility risk, existing overlap & scalability.',
    },
    {
      stepNumber: '05',
      title: 'Forge Transformation',
      icon: Sparkles,
      color: 'text-amber-300',
      bgColor: 'bg-amber-400/10 border-amber-400/30',
      description: 'Cinematic particle transition converting research data into a complete project blueprint.',
    },
    {
      stepNumber: '06',
      title: 'Project HUB',
      icon: Rocket,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      description: 'System architecture canvas, tech stack recommendations, milestones & code scaffold generator.',
    },
    {
      stepNumber: '07',
      title: 'AI Mentor & Telegram Bot',
      icon: Bot,
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-400/10 border-cyan-400/30',
      description: 'Continuous AI mentor chat synced across web workspace & Telegram bot (@Loopideaforgebot).',
    },
  ];

  return (
    <div className="min-h-screen bg-forge-black text-forge-white flex flex-col selection:bg-brand-ember selection:text-white font-sans relative">
      
      {/* Navbar (Preserved unchanged across all states) */}
      <Navbar
        currentStep="dashboard"
        onSelectStep={() => router.push('/app')}
        onOpenCommandPalette={() => {}}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        hasInput={true}
        activeTheme={activeTheme}
        onToggleTheme={handleToggleTheme}
        activeLanguage={activeLanguage}
        onSelectLanguage={handleSelectLanguage}
        userEmail={session.email}
        isLoggedIn={session.isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Loading Skeleton State */}
        {isSessionChecking ? (
          <div className="space-y-8 py-6 animate-pulse">
            <div className="h-44 bg-forge-surface border border-quenched-steel/20 rounded-blueprint" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="h-32 bg-forge-surface border border-quenched-steel/20 rounded-blueprint" />
              <div className="h-32 bg-forge-surface border border-quenched-steel/20 rounded-blueprint" />
              <div className="h-32 bg-forge-surface border border-quenched-steel/20 rounded-blueprint" />
              <div className="h-32 bg-forge-surface border border-quenched-steel/20 rounded-blueprint" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Top Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-forge-surface via-forge-surface-light to-forge-surface border border-quenched-steel/30 p-8 rounded-blueprint shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-ember/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-2 z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-2.5 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-display font-extrabold text-forge-white tracking-tight">
                    Innovation Executive Dashboard
                  </h1>
                  {session.isLoggedIn ? (
                    <Badge variant="emerald" className="gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Synced with Supabase</span>
                    </Badge>
                  ) : (
                    <Badge variant="quenched" className="gap-1">
                      <Lock className="w-3.5 h-3.5 text-brand-ember" />
                      <span>Not Logged In</span>
                    </Badge>
                  )}
                </div>

                <p className="text-sm font-sans text-zinc-400 max-w-2xl">
                  {session.isLoggedIn ? (
                    <>Aggregated technical metrics, white-space gap analysis, and active milestones across all saved project blueprints for <span className="text-forge-white font-bold">{session.email}</span>.</>
                  ) : (
                    <>Guest Preview Workspace — Log in or sign up to save your blueprints to Supabase, sync with Telegram AI bot, and access multi-project analytics anywhere.</>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
                {!session.isLoggedIn && (
                  <>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setIsAuthModalOpen(true)}
                      leftIcon={<UserPlus className="w-4 h-4" />}
                      className="min-h-[44px] font-bold"
                    >
                      Sign Up
                    </Button>

                    <Button
                      variant="quenched"
                      size="md"
                      onClick={() => setIsAuthModalOpen(true)}
                      leftIcon={<LogIn className="w-4 h-4 text-brand-ember" />}
                      className="min-h-[44px] font-bold"
                    >
                      Log In
                    </Button>
                  </>
                )}

                <Button
                  variant={session.isLoggedIn ? "primary" : "outline"}
                  size="md"
                  onClick={handleCreateNewIdea}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                  className="min-h-[44px]"
                >
                  Forge New Idea
                </Button>
              </div>
            </div>

            {/* 4 Metric Cards (Displays 0 stats when NOT logged in) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total Projects */}
              <Card variant="solid" className="p-6 border-quenched-steel/30 hover:border-brand-ember/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Total Blueprints</span>
                  <div className="p-2 bg-brand-ember/10 border border-brand-ember/20 rounded-lg text-brand-ember">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-forge-white">{totalProjects}</span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{session.isLoggedIn ? 'Saved & Active' : '0 Saved'}</span>
                </div>
                <p className="mt-2 text-xs font-sans text-zinc-400">
                  {session.isLoggedIn ? 'Project specs generated in IdeaForge' : 'Log in to sync saved blueprints'}
                </p>
              </Card>

              {/* Card 2: Avg Novelty Score */}
              <Card variant="solid" className="p-6 border-quenched-steel/30 hover:border-brand-ember/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Avg Novelty Score</span>
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-cyan-400">{avgNovelty}%</span>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">White-Space</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${avgNovelty}%` }} />
                </div>
              </Card>

              {/* Card 3: Avg Feasibility Score */}
              <Card variant="solid" className="p-6 border-quenched-steel/30 hover:border-brand-ember/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Avg Feasibility</span>
                  <div className="p-2 bg-amber-molten/10 border border-amber-molten/20 rounded-lg text-amber-molten">
                    <Target className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-amber-molten">{avgFeasibility}%</span>
                  <span className="text-xs font-mono text-amber-300 font-semibold">Execution Ready</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-amber-molten h-1.5 rounded-full" style={{ width: `${avgFeasibility}%` }} />
                </div>
              </Card>

              {/* Card 4: Overall Milestone Completion Rate */}
              <Card variant="solid" className="p-6 border-quenched-steel/30 hover:border-brand-ember/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Milestone Progress</span>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-emerald-400">{overallMilestonePct}%</span>
                  <span className="text-xs font-mono text-emerald-300 font-semibold">{completedMilestonesCount}/{totalMilestonesCount} Done</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${overallMilestonePct}%` }} />
                </div>
              </Card>
            </div>

            {/* Logged Out Account Auth Banner (Displayed when NOT logged in) */}
            {!session.isLoggedIn && (
              <Card variant="blueprint" className="p-8 border-brand-ember/40 bg-gradient-to-br from-brand-ember/15 via-forge-surface to-forge-surface relative overflow-hidden shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" className="px-3 py-1 font-mono uppercase text-xs">
                        AI-Powered Research & Innovation Copilot
                      </Badge>
                      <span className="text-xs font-mono text-zinc-400">Research. Build. Impact.</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-forge-white tracking-tight">
                      Unlock Cloud Sync & Multi-Project Analytics
                    </h2>

                    <p className="text-sm font-sans text-zinc-300 leading-relaxed">
                      Log in or sign up to auto-save your technical research blueprints, white-space novelty scores, execution timelines, and Telegram AI mentorship progress to your Supabase account.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setIsAuthModalOpen(true)}
                      leftIcon={<UserPlus className="w-5 h-5" />}
                      className="w-full justify-center min-h-[48px] font-bold shadow-lg shadow-brand-ember/30"
                    >
                      Sign Up via Magic Link
                    </Button>

                    <Button
                      variant="quenched"
                      size="md"
                      onClick={() => setIsAuthModalOpen(true)}
                      leftIcon={<LogIn className="w-4 h-4 text-brand-ember" />}
                      className="w-full justify-center min-h-[44px] font-bold"
                    >
                      Log In
                    </Button>
                  </div>
                </div>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-quenched-steel/20">
                  <div className="bg-forge-black/60 p-4 rounded-blueprint border border-quenched-steel/20 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-ember">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Supabase Auto-Save</span>
                    </div>
                    <p className="text-xs font-sans text-zinc-400">Never lose your architecture blueprints, code scaffolds, or milestone checklists.</p>
                  </div>

                  <div className="bg-forge-black/60 p-4 rounded-blueprint border border-quenched-steel/20 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                      <Bot className="w-4 h-4" />
                      <span>Telegram Mentor Sync</span>
                    </div>
                    <p className="text-xs font-sans text-zinc-400">Link your Telegram account to check off milestones and consult your AI mentor anywhere.</p>
                  </div>

                  <div className="bg-forge-black/60 p-4 rounded-blueprint border border-quenched-steel/20 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-molten">
                      <PieChart className="w-4 h-4" />
                      <span>Multi-Idea Analytics</span>
                    </div>
                    <p className="text-xs font-sans text-zinc-400">Compare technical feasibility, market impact, and white-spaces across all your ideas.</p>
                  </div>
                </div>
              </Card>
            )}

            {/* 7 Pipeline Steps Visual Walkthrough */}
            <div className="space-y-6">
              <div className="border-b border-quenched-steel/20 pb-4">
                <Badge variant="quenched" className="mb-2 uppercase tracking-wider font-mono text-[10px]">
                  End-to-End Pipeline
                </Badge>
                <h2 className="text-2xl font-display font-extrabold text-forge-white">
                  The 7-Step IdeaForge Innovation Workflow
                </h2>
                <p className="text-xs font-sans text-zinc-400 mt-1">
                  Explore how raw concepts evolve into execution-ready technical blueprints and code scaffolds
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PIPELINE_STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <Card 
                      key={idx} 
                      variant="solid" 
                      className={`p-6 border-quenched-steel/30 hover:border-brand-ember/40 transition space-y-3 relative group ${idx === 6 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-blueprint border ${s.bgColor}`}>
                          <Icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <span className="text-xs font-mono font-bold text-zinc-500">{s.stepNumber}</span>
                      </div>

                      <h3 className="text-base font-display font-bold text-forge-white group-hover:text-brand-ember transition">
                        {s.title}
                      </h3>

                      <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                        {s.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Feature Section: "Resume Where You Left Off" Hero Card (Displayed when logged in) */}
            {session.isLoggedIn && mostRecentPlan ? (
              <Card variant="blueprint" className="p-8 border-brand-ember/30 relative overflow-hidden shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-brand-ember uppercase tracking-wider font-bold">
                      <RotateCcw className="w-4 h-4" />
                      <span>Resume Where You Left Off</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 font-normal">Most Recent Active Blueprint</span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-display font-extrabold text-forge-white">
                        {mostRecentPlan.blueprint?.title || mostRecentPlan.input?.idea || 'Untitled Blueprint'}
                      </h2>
                      <p className="text-sm font-sans text-brand-ember/90 mt-1 font-semibold">
                        {mostRecentPlan.blueprint?.tagline || mostRecentPlan.input?.idea}
                      </p>
                    </div>

                    <p className="text-xs font-sans text-zinc-300 line-clamp-2">
                      {mostRecentPlan.blueprint?.executiveSummary || mostRecentPlan.blueprint?.problemStatement || 'Architected technical pipeline with complete milestones and scaffold generator.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Badge variant="quenched">{mostRecentPlan.input?.category || 'Tech'}</Badge>
                      <Badge variant="quenched">Target: {mostRecentPlan.input?.targetUser || 'Developers'}</Badge>
                      <span className="text-xs font-mono text-zinc-400">
                        ⏱️ Dev Estimate: {mostRecentPlan.blueprint?.timeline?.totalEstimatedWeeks || 4} Weeks
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-quenched-steel/20 pt-4 lg:pt-0 lg:pl-8">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handleResumePlan(mostRecentPlan)}
                      leftIcon={<Rocket className="w-5 h-5" />}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full justify-center min-h-[48px]"
                    >
                      Resume Project Blueprint
                    </Button>

                    <Button
                      variant="quenched"
                      size="md"
                      isLoading={exportingId === (mostRecentPlan.id || mostRecentPlan.blueprint?.title)}
                      onClick={(e) => handleExportPlanPDF(e, mostRecentPlan)}
                      leftIcon={<FileDown className="w-4 h-4 text-brand-ember" />}
                      className="w-full justify-center min-h-[44px]"
                    >
                      Export Pitch PDF
                    </Button>
                  </div>

                </div>
              </Card>
            ) : null}

            {/* Logged-In Saved Blueprints Portfolio Grid */}
            {session.isLoggedIn && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-forge-white">All Saved Project Blueprints</h3>
                    <p className="text-xs font-sans text-zinc-400 mt-0.5">Select any blueprint to inspect or resume editing in the workspace canvas</p>
                  </div>
                  <span className="text-xs font-mono text-quenched-steel-light font-bold">
                    {plans.length} Projects Total
                  </span>
                </div>

                {isLoading ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-brand-ember border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-zinc-400">Loading saved blueprints from Supabase...</p>
                  </div>
                ) : plans.length === 0 ? (
                  <Card variant="solid" className="p-12 text-center space-y-4 border-dashed border-quenched-steel/40">
                    <Brain className="w-12 h-12 text-quenched-steel-light mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-lg font-display font-bold text-forge-white">No Saved Blueprints Yet</h4>
                      <p className="text-xs font-sans text-zinc-400">Forge your first hackathon or startup idea into a complete execution plan.</p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleCreateNewIdea}
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                      className="mx-auto"
                    >
                      Create First Blueprint
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => {
                      const title = plan.blueprint?.title || plan.input?.idea || `Blueprint #${index + 1}`;
                      const tagline = plan.blueprint?.tagline || plan.input?.idea;
                      const category = plan.input?.category || 'Tech';
                      const milestones = plan.blueprint?.milestones || [];
                      const completedCount = milestones.filter((m) => m.completed).length;
                      const milestonePct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
                      const planId = plan.id || title;

                      return (
                        <Card 
                          key={index} 
                          variant="solid" 
                          className="p-6 border-quenched-steel/30 hover:border-brand-ember/60 transition group flex flex-col justify-between cursor-pointer space-y-4"
                          onClick={() => handleResumePlan(plan)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="quenched">{category}</Badge>
                              <span className="text-[11px] font-mono text-zinc-500">
                                {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'Active'}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-display font-extrabold text-forge-white group-hover:text-brand-ember transition line-clamp-1">
                                {title}
                              </h4>
                              <p className="text-xs font-sans text-zinc-400 line-clamp-2 mt-1">
                                {tagline}
                              </p>
                            </div>

                            {/* Scores & Progress */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-quenched-steel/20">
                              <div className="bg-forge-surface p-2 rounded border border-quenched-steel/20 text-center">
                                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Novelty</span>
                                <span className="text-sm font-display font-bold text-cyan-400">{plan.metrics?.noveltyScore || 85}%</span>
                              </div>
                              <div className="bg-forge-surface p-2 rounded border border-quenched-steel/20 text-center">
                                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Feasibility</span>
                                <span className="text-sm font-display font-bold text-amber-molten">{plan.metrics?.feasibilityScore || 82}%</span>
                              </div>
                            </div>

                            {/* Milestone Progress Bar */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                                <span>Milestones ({completedCount}/{milestones.length})</span>
                                <span className="text-emerald-400 font-bold">{milestonePct}%</span>
                              </div>
                              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${milestonePct}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-quenched-steel/20">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleResumePlan(plan)}
                              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                              className="flex-1 justify-center"
                            >
                              Open Plan
                            </Button>

                            <button
                              onClick={(e) => handleExportPlanPDF(e, plan)}
                              disabled={exportingId === planId}
                              className="p-2 rounded-lg bg-forge-surface-light border border-quenched-steel/30 text-zinc-300 hover:text-white hover:border-brand-ember/50 transition shrink-0"
                              title="Export Pitch Deck PDF"
                            >
                              <FileDown className="w-4 h-4 text-brand-ember text-zinc-300" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        session={session}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Footer */}
      <footer className="border-t border-quenched-steel/20 py-4 text-center text-xs font-mono text-quenched-steel-light">
        IdeaForge AI Innovation Dashboard • Aggregated Analytics & Project Management
      </footer>
    </div>
  );
}
