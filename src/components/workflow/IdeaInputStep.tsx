'use client';

import React, { useState } from 'react';
import { SAMPLE_IDEAS } from '@/lib/mock/mockData';
import { IdeaInputData } from '@/lib/types';
import { Sparkles, Mic, ArrowRight, Lightbulb, Zap, UserCheck, Code, Globe, Shield } from 'lucide-react';

interface IdeaInputStepProps {
  onSubmitIdea: (input: IdeaInputData) => void;
  initialInput?: IdeaInputData;
}

export default function IdeaInputStep({ onSubmitIdea, initialInput }: IdeaInputStepProps) {
  const [ideaText, setIdeaText] = useState(initialInput?.idea || '');
  const [category, setCategory] = useState(initialInput?.category || 'AI & Developer Tools');
  const [targetUser, setTargetUser] = useState(initialInput?.targetUser || 'Developers & Open Source Teams');
  const [isRecording, setIsRecording] = useState(false);

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
      alert('Speech recognition is not supported in this browser. You can type your idea directly!');
      return;
    }
    setIsRecording(!isRecording);
    // Web speech simulation or recognition handler fallback
    if (!isRecording) {
      setTimeout(() => {
        setIdeaText('Autonomous AI Code Reviewer & Security Guardrail with WASM AST validation');
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research Smarter. Build Faster. Innovate Better.</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Turn your one-line idea into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-orange-600">implementation-ready plan</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
          DeepSearch across arXiv papers, GitHub repos, and live web intelligence. Uncover white-space opportunity maps and pressure-test your idea in minutes.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-zinc-200 uppercase tracking-wide flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-brand-500" />
              <span>What is your project idea?</span>
            </label>
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g., An autonomous AI code reviewer that uses WASM Tree-Sitter AST validation to eliminate false positives in pull request comments..."
              className="w-full p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-base text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition resize-none font-medium"
            />
          </div>
        </div>

        {/* Categories & Target Audience Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Domain / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-200 focus:outline-none focus:border-brand-500"
            >
              <option value="AI & Developer Tools">AI & Developer Tools</option>
              <option value="Healthcare & BioTech">Healthcare & BioTech</option>
              <option value="CleanTech & IoT">CleanTech & IoT</option>
              <option value="FinTech & Web3">FinTech & Web3</option>
              <option value="EdTech & Productivity">EdTech & Productivity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Primary Target User
            </label>
            <input
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="e.g. Developers, Researchers, Patients"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!ideaText.trim()}
            className="flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-xl shadow-brand-500/25 transition transform active:scale-95"
          >
            <span>Run DeepSearch Pass</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Sample Quick Start Chips */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          <span>Or pick a pre-loaded hackathon idea template:</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_IDEAS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="p-4 bg-[#121216]/60 border border-zinc-800/80 hover:border-brand-500/50 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                  {sample.category}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-zinc-600 group-hover:text-brand-500 transition" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-brand-400 transition line-clamp-1 mb-1">
                {sample.title}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
