'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ApiKeyModal from '@/components/layout/ApiKeyModal';
import IdeaInputStep from '@/components/workflow/IdeaInputStep';
import DeepSearchStep from '@/components/workflow/DeepSearchStep';
import GapMapStep from '@/components/workflow/GapMapStep';
import DevilsAdvocateStep from '@/components/workflow/DevilsAdvocateStep';
import ProjectHubStep from '@/components/workflow/ProjectHubStep';
import MentorStep from '@/components/workflow/MentorStep';

import { MOCK_DATASETS } from '@/lib/mock/mockData';
import { StepId, IdeaInputData, DeepSearchState, ApiKeys, DevilsAdvocateQuestion } from '@/lib/types';

export default function WorkspacePage() {
  const [currentStep, setCurrentStep] = useState<StepId>('input');
  const [searchData, setSearchData] = useState<DeepSearchState>(MOCK_DATASETS.default);
  const [hasInput, setHasInput] = useState(true);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isLoading, setIsLoading] = useState(false);

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
        // Fallback
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasInput={hasInput}
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
            onContinue={() => setCurrentStep('blueprint')}
            onUpdateQuestions={handleUpdateQuestions}
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
            telegramBotToken={apiKeys.telegramBotToken}
          />
        )}
      </main>

      {/* API Key Modal Drawer */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={(keys) => setApiKeys(keys)}
        currentKeys={apiKeys}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        IdeaForge AI Research & Innovation Copilot • iNSIGHTS Hackathon MVP
      </footer>
    </div>
  );
}
