'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import AuthModal from '@/components/auth/AuthModal';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { PlanHistorySidebar } from '@/components/layout/PlanHistorySidebar';
import IdeaInputStep from '@/components/workflow/IdeaInputStep';
import DeepSearchStep from '@/components/workflow/DeepSearchStep';
import GapMapStep from '@/components/workflow/GapMapStep';
import DevilsAdvocateStep from '@/components/workflow/DevilsAdvocateStep';
import ProjectHubStep from '@/components/workflow/ProjectHubStep';
import MentorStep from '@/components/workflow/MentorStep';
import ForgeTransformation from '@/components/workflow/ForgeTransformation';

import { MOCK_DATASETS } from '@/lib/mock/mockData';
import { StepId, IdeaInputData, DeepSearchState, DevilsAdvocateQuestion, GapMetrics } from '@/lib/types';
import { getOrCreateSession, saveUserBlueprint, loadUserBlueprint, getUserPlansFromSupabase, UserSession } from '@/lib/supabase';

export default function WorkspacePage() {
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [searchData, setSearchData] = useState<DeepSearchState>(MOCK_DATASETS.default);
  const [userPlans, setUserPlans] = useState<DeepSearchState[]>([]);
  const [hasInput, setHasInput] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'forge' | 'blueprint' | 'cyberpunk'>('forge');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  // Supabase Auth & Persistence Session
  const [session, setSession] = useState<UserSession>({
    email: 'builder@ideaforge.ai',
    isLoggedIn: false,
    telegramConnectCode: 'FORGE-8421',
  });

  const refreshUserPlans = useCallback(async (email: string) => {
    const plans = await getUserPlansFromSupabase(email);
    if (plans && plans.length > 0) {
      setUserPlans(plans);
    }
  }, []);

  // Client-side Session & Saved Blueprint Restoration
  useEffect(() => {
    const clientSession = getOrCreateSession();
    setSession(clientSession);

    const saved = loadUserBlueprint(clientSession.email);
    if (saved && saved.blueprint) {
      setSearchData(saved);
      setCurrentStep('blueprint');
    }

    refreshUserPlans(clientSession.email);
  }, [refreshUserPlans]);

  // Persist plan whenever searchData updates
  useEffect(() => {
    if (searchData && searchData.blueprint && searchData.blueprint.title) {
      saveUserBlueprint(session.email, searchData).then((updatedState) => {
        if (updatedState && updatedState.id && !searchData.id) {
          setSearchData(updatedState);
        }
        refreshUserPlans(session.email);
      });
    }
  }, [searchData, session.email, refreshUserPlans]);

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

  const handleToggleTheme = () => {
    if (activeTheme === 'forge') setActiveTheme('blueprint');
    else if (activeTheme === 'blueprint') setActiveTheme('cyberpunk');
    else setActiveTheme('forge');
  };

  const handleIdeaSubmit = async (input: IdeaInputData) => {
    setIsLoading(true);
    setCurrentStep('search');

    try {
      const response = await fetch('/api/deepsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
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
    setCurrentStep('blueprint');
  };

  const handleNewIdea = () => {
    setSearchData({
      input: { idea: '', category: 'Tech', targetUser: 'Developers' },
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
    setCurrentStep('input');
  };

  const handleUpdateQuestions = (updatedQs: DevilsAdvocateQuestion[]) => {
    setSearchData((prev) => ({
      ...prev,
      devilsQuestions: updatedQs,
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
    setCurrentStep('blueprint');
  };

  const handleUpdateMilestones = useCallback((milestoneWeek: number, completed: boolean) => {
    setSearchData((prev) => {
      const updatedMilestones = prev.blueprint.milestones.map((m) =>
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
      
      {/* 0. Collapsible Left Plan History Sidebar */}
      <PlanHistorySidebar
        plans={userPlans}
        currentPlanId={searchData.id}
        onSelectPlan={handleSelectPlan}
        onNewIdea={handleNewIdea}
      />

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
        onSelectStep={setCurrentStep}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        hasInput={hasInput}
        activeTheme={activeTheme}
        onToggleTheme={handleToggleTheme}
        userEmail={session.email}
        isLoggedIn={session.isLoggedIn}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentStep === 'input' && (
          <IdeaInputStep
            onSubmitIdea={handleIdeaSubmit}
            initialInput={searchData.input}
          />
        )}

        {currentStep === 'search' && (
          <DeepSearchStep
            data={searchData}
            onContinue={() => setCurrentStep('gapmap')}
          />
        )}

        {currentStep === 'gapmap' && (
          <GapMapStep
            data={searchData}
            onContinue={() => setCurrentStep('devils')}
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
            onOpenTelegramMentor={() => setCurrentStep('mentor')}
          />
        )}

        {currentStep === 'mentor' && (
          <MentorStep
            blueprint={searchData.blueprint}
            onBackToBlueprint={() => setCurrentStep('blueprint')}
            onUpdateMilestones={handleUpdateMilestones}
            initialMessages={searchData.mentorChatHistory}
            onUpdateMessages={handleUpdateMentorMessages}
          />
        )}
      </main>

      {/* Auth Modal (Magic Link & Telegram Connection Code) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        session={session}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStep={setCurrentStep}
        onLaunchMentor={() => setCurrentStep('mentor')}
      />

      {/* Blueprint Footer */}
      <footer className="border-t border-quenched-steel/20 py-4 text-center text-xs font-mono text-quenched-steel-light">
        IdeaForge AI Research & Innovation Copilot • Research. Build. Impact.
      </footer>
    </div>
  );
}
