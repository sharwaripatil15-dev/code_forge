'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import IdeaInputStep from '@/components/workflow/IdeaInputStep';
import DeepSearchStep from '@/components/workflow/DeepSearchStep';
import GapMapStep from '@/components/workflow/GapMapStep';
import DevilsAdvocateStep from '@/components/workflow/DevilsAdvocateStep';
import ProjectHubStep from '@/components/workflow/ProjectHubStep';
import MentorStep from '@/components/workflow/MentorStep';
import DashboardStep from '@/components/workflow/DashboardStep';
import ForgeTransformation from '@/components/workflow/ForgeTransformation';
import AuthModal from '@/components/auth/AuthModal';

const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette').then((m) => m.CommandPalette), { ssr: false });

import { MOCK_DATASETS } from '@/lib/mock/mockData';
import { StepId, IdeaInputData, DeepSearchState, DevilsAdvocateQuestion, GapMetrics } from '@/lib/types';
import { getOrCreateSession, saveUserBlueprint, loadUserBlueprint, getUserPlansFromSupabase, logoutUserSession, UserSession } from '@/lib/supabase';
import { LanguageCode } from '@/lib/translations';

export default function WorkspacePage() {
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [searchData, setSearchData] = useState<DeepSearchState>(MOCK_DATASETS.default);
  const [hasInput, setHasInput] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'forge' | 'blueprint' | 'cyberpunk'>('forge');
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userPlans, setUserPlans] = useState<DeepSearchState[]>([]);

  // Supabase Auth & Persistence Session
  const [session, setSession] = useState<UserSession>({
    email: 'builder@ideaforge.ai',
    isLoggedIn: false,
    telegramConnectCode: 'FORGE-8421',
  });

  const refreshUserPlans = useCallback(async (email: string) => {
    try {
      const plans = await getUserPlansFromSupabase(email);
      if (plans && plans.length > 0) {
        setUserPlans(plans);
      }
    } catch (err) {
      console.warn('[User Plans] Refresh error:', err);
    }
  }, []);

  // Client-side Session & Saved Blueprint Restoration with Step & Language Persistence
  useEffect(() => {
    const clientSession = getOrCreateSession();
    setSession(clientSession);

    const saved = loadUserBlueprint(clientSession.email);
    if (saved) {
      setSearchData(saved);
    }

    refreshUserPlans(clientSession.email);

    const savedStep = typeof window !== 'undefined'
      ? (localStorage.getItem('ideaforge_active_step') as StepId | null)
      : null;

    if (savedStep && ['input', 'search', 'gapmap', 'devils', 'blueprint', 'mentor', 'dashboard'].includes(savedStep)) {
      setCurrentStep(savedStep);
    } else if (saved && saved.blueprint) {
      setCurrentStep('blueprint');
    }

    const savedLang = (typeof window !== 'undefined' ? localStorage.getItem('ideaforge_language') : null) as LanguageCode | null;
    if (savedLang && ['en', 'hi', 'es', 'fr', 'ja'].includes(savedLang)) {
      setActiveLanguage(savedLang);
    }
  }, [refreshUserPlans]);

  // Helper to change language and persist in localStorage
  const handleSelectLanguage = (lang: LanguageCode) => {
    setActiveLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_language', lang);
    }
  };

  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  const fetchLazyBlueprint = useCallback(async (currentState: DeepSearchState) => {
    if (!currentState || !currentState.input || !currentState.input.idea) return;

    setIsGeneratingBlueprint(true);
    try {
      const response = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: currentState.input,
          papers: currentState.papers || [],
          repos: currentState.repos || [],
          patents: currentState.patents || [],
          language: activeLanguage,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.blueprint) {
        setSearchData((prev) => ({
          ...prev,
          blueprint: resData.blueprint,
        }));
      }
    } catch (err) {
      console.warn('[Lazy Blueprint] Fetch error:', err);
    } finally {
      setIsGeneratingBlueprint(false);
    }
  }, [activeLanguage]);

  // Helper to change step and persist in localStorage
  const changeStep = useCallback((step: StepId) => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ideaforge_active_step', step);
    }

    // Trigger lazy blueprint generation when navigating to Step 5 (Project HUB)
    if (step === 'blueprint') {
      fetchLazyBlueprint(searchData);
    }
  }, [fetchLazyBlueprint, searchData]);

  // Persist plan whenever searchData updates
  useEffect(() => {
    if (searchData && searchData.blueprint && searchData.blueprint.title) {
      saveUserBlueprint(session.email, searchData).then((updatedState) => {
        if (updatedState && updatedState.id && !searchData.id) {
          setSearchData(updatedState);
        }
      });
    }
  }, [searchData, session.email]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

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
    const saved = loadUserBlueprint(email);
    if (saved) setSearchData(saved);
    refreshUserPlans(email);
  };

  const handleLogout = () => {
    const updated = logoutUserSession();
    setSession(updated);
    setUserPlans([]);
  };

  const handleToggleTheme = () => {
    if (activeTheme === 'forge') setActiveTheme('blueprint');
    else if (activeTheme === 'blueprint') setActiveTheme('cyberpunk');
    else setActiveTheme('forge');
  };

  const handleIdeaSubmit = async (input: IdeaInputData) => {
    setIsLoading(true);
    changeStep('search');

    try {
      const response = await fetch('/api/deepsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, language: activeLanguage }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setSearchData(resData.data);
      } else {
        setSearchData({
          ...MOCK_DATASETS.default,
          input,
          isLive: false,
        });
      }
    } catch (err) {
      console.warn('API call error, using mock fallback:', err);
      setSearchData({
        ...MOCK_DATASETS.default,
        input,
        isLive: false,
      });
    } finally {
      setIsLoading(false);
      setHasInput(true);
    }
  };

  const handleSelectPlan = (plan: DeepSearchState) => {
    setSearchData(plan);
    changeStep('blueprint');
  };

  const handleNewIdea = () => {
    setSearchData({
      input: { idea: '', category: 'AI & Developer Tools', targetUser: 'Developers & Open Source Teams' },
      papers: [],
      repos: [],
      patents: [],
      webInsights: [],
      clusters: [],
      metrics: {
        noveltyScore: 0,
        feasibilityScore: 0,
        technicalComplexity: 0,
        marketImpact: 0,
        executionSpeed: 0,
        whiteSpaceTitle: '',
        whiteSpaceDescription: '',
        keyInnovations: [],
      },
      nodes: [],
      devilsQuestions: [],
      blueprint: {
        title: '',
        tagline: '',
        problemStatement: '',
        executiveSummary: '',
        uniqueValueProposition: '',
        architectureNodes: [],
        techStack: [],
        apisAndDatasets: [],
        timeline: { totalEstimatedWeeks: 0, totalEstimatedHours: 0, criticalPath: '', phases: [] },
        milestones: [],
        scaffoldFiles: [],
        telegramMentorPrompt: '',
      },
      isLive: true,
    });
    setHasInput(false);
    changeStep('input');
  };

  const handleUpdateQuestions = (questions: DevilsAdvocateQuestion[]) => {
    setSearchData((prev) => ({
      ...prev,
      devilsQuestions: questions,
    }));
  };

  const handleUpdateMetrics = (updatedMetrics: GapMetrics) => {
    setSearchData((prev) => ({
      ...prev,
      metrics: updatedMetrics,
    }));
  };

  const handleGenerateBlueprint = () => {
    setIsTransforming(true);
  };

  const handleTransformationComplete = () => {
    setIsTransforming(false);
    changeStep('blueprint');
  };

  const handleUpdateMilestones = useCallback((milestoneWeek: number, completed: boolean) => {
    setSearchData((prev) => {
      const updatedMilestones = prev.blueprint.milestones.map((m: any) =>
        m.week === milestoneWeek ? { ...m, completed } : m
      );
      return {
        ...prev,
        blueprint: {
          ...prev.blueprint,
          milestones: updatedMilestones,
        },
      };
    });
  }, []);

  const handleUpdateMentorMessages = useCallback((msgs: Array<{ sender: 'bot' | 'user'; text: string; time: string }>) => {
    setSearchData((prev) => {
      if (JSON.stringify(prev.mentorChatHistory) === JSON.stringify(msgs)) return prev;
      return {
        ...prev,
        mentorChatHistory: msgs,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-forge-black text-forge-white flex flex-col selection:bg-brand-ember selection:text-white font-sans relative">
      {/* Signature Moment: Forge Transformation Overlay */}
      {isTransforming && (
        <ForgeTransformation
          ideaText={searchData.input.idea}
          onComplete={handleTransformationComplete}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={changeStep}
        hasInput={hasInput}
        activeTheme={activeTheme}
        onToggleTheme={handleToggleTheme}
        activeLanguage={activeLanguage}
        onSelectLanguage={handleSelectLanguage}
        userEmail={session.email}
        isLoggedIn={session.isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === 'input' && (
          <IdeaInputStep
            onSubmitIdea={handleIdeaSubmit}
            initialInput={searchData.input}
            activeLanguage={activeLanguage}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'search' && (
          <DeepSearchStep
            data={searchData}
            onContinue={() => changeStep('gapmap')}
          />
        )}

        {currentStep === 'gapmap' && (
          <GapMapStep
            data={searchData}
            onContinue={() => changeStep('devils')}
          />
        )}

        {currentStep === 'devils' && (
          <DevilsAdvocateStep
            data={searchData}
            onContinue={handleGenerateBlueprint}
            onUpdateQuestions={handleUpdateQuestions}
            onUpdateMetrics={handleUpdateMetrics}
          />
        )}

        {currentStep === 'blueprint' && (
          <ProjectHubStep
            blueprint={searchData.blueprint}
            onOpenTelegramMentor={() => changeStep('mentor')}
          />
        )}

        {currentStep === 'mentor' && (
          <MentorStep
            blueprint={searchData.blueprint}
            onBackToBlueprint={() => changeStep('blueprint')}
            onUpdateMilestones={handleUpdateMilestones}
            initialMessages={searchData.mentorChatHistory}
            onUpdateMessages={handleUpdateMentorMessages}
          />
        )}

        {currentStep === 'dashboard' && (
          <DashboardStep
            onSelectPlan={handleSelectPlan}
            onNewIdea={handleNewIdea}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Auth Modal (Magic Link & Telegram Connection Code) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        session={session}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStep={changeStep}
        onLaunchMentor={() => changeStep('mentor')}
      />

      {/* Blueprint Footer */}
      <footer className="border-t border-quenched-steel/20 py-4 text-center text-xs font-mono text-quenched-steel-light">
        IdeaForge AI Research & Innovation Copilot • Research. Build. Impact.
      </footer>
    </div>
  );
}

