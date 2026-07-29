'use client';

import React, { useState } from 'react';
import { SAMPLE_IDEAS } from '@/lib/mock/mockData';
import { IdeaInputData } from '@/lib/types';
import { Sparkles, Mic, ArrowRight, Lightbulb, Zap, Compass, ChevronRight } from 'lucide-react';

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
    if (!isRecording) {
      setTimeout(() => {
        setIdeaText('Autonomous AI Code Reviewer & Security Guardrail with WASM AST validation');
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10">
      
      {/* Hero Header with Generous Whitespace */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Research Smarter • Build Faster • Innovate Better</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          From a one-line idea to a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-orange-500 to-amber-500">
            validated project plan
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal pt-2">
          DeepSearch across arXiv papers, GitHub repos, and live web intelligence. Pinpoint uncrowded white-space opportunities in minutes.
        </p>
      </div>

      {/* Main Spacious Input Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#121218]/80 border border-zinc-800/90 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-brand-500" />
              <span>Describe Your Project Idea</span>
            </label>
            
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80'
              }`}
            >
              <Mic className="w-4 h-4 text-brand-500" />
              <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
            </button>
          </div>

          <textarea
            rows={4}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g., An autonomous AI code reviewer that uses WASM Tree-Sitter AST validation to eliminate false positives in pull request comments..."
            className="w-full p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-base text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Category & Audience Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Domain / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="AI & Developer Tools">AI & Developer Tools</option>
              <option value="Healthcare & BioTech">Healthcare & BioTech</option>
              <option value="CleanTech & IoT">CleanTech & IoT</option>
              <option value="FinTech & Web3">FinTech & Web3</option>
              <option value="EdTech & Productivity">EdTech & Productivity</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Primary Target User
            </label>
            <input
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="e.g. Developers, Researchers, Patients"
              className="w-full px-5 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!ideaText.trim()}
            className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl text-base shadow-xl shadow-brand-500/25 transition transform active:scale-95"
          >
            <span>Run DeepSearch Pass</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Quick Start Template Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500" />
            <span>Or select a pre-loaded hackathon idea template</span>
          </p>
          <span className="text-xs text-zinc-500 font-mono">3 Domain Examples</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_IDEAS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="p-6 bg-[#121218]/70 border border-zinc-800 hover:border-brand-500/50 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/20">
                  {sample.category}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-500 transition-transform group-hover:translate-x-1" />
              </div>

              <h4 className="text-sm font-extrabold text-white group-hover:text-brand-400 transition leading-snug">
                {sample.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-medium">
                {sample.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
