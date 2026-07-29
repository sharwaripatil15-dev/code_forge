'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ApiKeyModal from '@/components/layout/ApiKeyModal';
import { CommandPalette } from '@/components/ui/CommandPalette';
import IdeaInputStep from '@/components/workflow/IdeaInputStep';
import DeepSearchStep from '@/components/workflow/DeepSearchStep';
import GapMapStep from '@/components/workflow/GapMapStep';
import DevilsAdvocateStep from '@/components/workflow/DevilsAdvocateStep';
import ProjectHubStep from '@/components/workflow/ProjectHubStep';
import MentorStep from '@/components/workflow/MentorStep';
import ForgeTransformation from '@/components/workflow/ForgeTransformation';

import { MOCK_DATASETS } from '@/lib/mock/mockData';
import { StepId, IdeaInputData, DeepSearchState, ApiKeys, DevilsAdvocateQuestion, GapMetrics } from '@/lib/types';

export default function WorkspacePage() {
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [searchData, setSearchData] = useState<DeepSearchState>(MOCK_DATASETS.default);
  const [hasInput, setHasInput] = useState(true);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'forge' | 'blueprint' | 'cyberpunk'>('forge');
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

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
        body: JSON.stringify({ input, apiKeys }),
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

  return (
    <div className="min-h-screen bg-forge-black text-forge-white flex flex-col selection:bg-brand-ember selection:text-white font-sans">
      
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
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        hasInput={hasInput}
        activeTheme={activeTheme}
        onToggleTheme={handleToggleTheme}
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
            githubToken={apiKeys.githubToken}
          />
        )}

        {currentStep === 'mentor' && (
          <MentorStep
            blueprint={searchData.blueprint}
            onBackToBlueprint={() => setCurrentStep('blueprint')}
            telegramBotToken={apiKeys.telegramBotToken}
          />
        )}
      </main>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectStep={setCurrentStep}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onLaunchMentor={() => setCurrentStep('mentor')}
      />

      {/* API Key Modal Drawer */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={(keys) => setApiKeys(keys)}
        currentKeys={apiKeys}
      />

      {/* Blueprint Footer */}
      <footer className="border-t border-quenched-steel/20 py-4 text-center text-xs font-mono text-quenched-steel-light">
        IdeaForge AI Research & Innovation Copilot • Research. Build. Impact.
      </footer>
    </div>
  );
}
