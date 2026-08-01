'use client';

import React, { useState, useEffect } from 'react';
import { SAMPLE_IDEAS } from '@/lib/mock/mockData';
import { IdeaInputData } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { Mic, ArrowRight, Lightbulb, Zap, ChevronRight } from 'lucide-react';

import { LanguageCode, getTranslation } from '@/lib/translations';

interface IdeaInputStepProps {
  onSubmitIdea: (input: IdeaInputData) => void;
  initialInput?: IdeaInputData;
  activeLanguage?: LanguageCode;
  isLoading?: boolean;
}

export default function IdeaInputStep({ onSubmitIdea, initialInput, activeLanguage = 'en', isLoading = false }: IdeaInputStepProps) {
  const t = getTranslation(activeLanguage).ideaInput;
  const [ideaText, setIdeaText] = useState(initialInput?.idea || '');
  const [category, setCategory] = useState(initialInput?.category || 'AI & Developer Tools');
  const [targetUser, setTargetUser] = useState(initialInput?.targetUser || 'Developers & Open Source Teams');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (initialInput) {
      setIdeaText(initialInput.idea || '');
      setCategory(initialInput.category || 'AI & Developer Tools');
      setTargetUser(initialInput.targetUser || 'Developers & Open Source Teams');
    }
  }, [initialInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    onSubmitIdea({ idea: ideaText, category, targetUser });
  };

  const handleSelectSample = (sample: typeof SAMPLE_IDEAS[0]) => {
    setIdeaText(sample.description);
    setCategory(sample.category);
    setTargetUser(sample.targetUser);
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your project idea directly!');
      return;
    }
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIdeaText('Autonomous AI Code Reviewer & Security Guardrail with WASM AST validation');
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      
      {/* Hero Header with Industrial Typography */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-forge-white leading-tight">
          {t.headlineStart} <br />
          <span className="text-brand-ember">
            {t.headlineHighlight}
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-sans pt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Main Blueprint Form Card */}
      <Card variant="blueprint" className="p-6 sm:p-10 space-y-8 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-forge-white uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-ember" />
                <span>{t.describeLabel}</span>
              </label>
              
              <Button
                variant={isRecording ? 'danger' : 'outline'}
                size="sm"
                onClick={toggleRecording}
                leftIcon={<Mic className="w-3.5 h-3.5 text-brand-ember" />}
              >
                {isRecording ? t.listening : t.voiceInput}
              </Button>
            </div>

            <Textarea
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder={t.describePlaceholder}
              className="text-base"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              disabled={!ideaText.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto justify-center min-h-[44px]"
            >
              {isLoading ? t.submittingButton : t.submitButton}
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Start Template Section */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono font-bold text-quenched-steel-light uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-ember" />
            <span>Or select a pre-loaded hackathon idea template</span>
          </p>
          <span className="text-xs text-zinc-500 font-mono">3 Domain Examples</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_IDEAS.map((sample, idx) => (
            <Card
              key={idx}
              variant="interactive"
              onClick={() => handleSelectSample(sample)}
              className="space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <Badge variant="quenched" size="sm">
                  {sample.category}
                </Badge>
                <ChevronRight className="w-4 h-4 text-quenched-steel-light group-hover:text-brand-ember transition-transform group-hover:translate-x-1" />
              </div>

              <h3 className="text-sm font-display font-bold text-forge-white group-hover:text-brand-ember transition leading-snug">
                {sample.title}
              </h3>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                {sample.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
