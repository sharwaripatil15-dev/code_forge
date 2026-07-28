'use client';

import React, { useState } from 'react';
import { DeepSearchState, DevilsAdvocateQuestion } from '@/lib/types';
import { Swords, ShieldAlert, Bot, User, Sparkles, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

interface DevilsAdvocateStepProps {
  data: DeepSearchState;
  onContinue: () => void;
  onUpdateQuestions: (questions: DevilsAdvocateQuestion[]) => void;
}

export default function DevilsAdvocateStep({ data, onContinue, onUpdateQuestions }: DevilsAdvocateStepProps) {
  const [questions, setQuestions] = useState<DevilsAdvocateQuestion[]>(data.devilsQuestions);
  const [activeIdx, setActiveIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);

  const currentQ = questions[activeIdx];

  const handleAnswerSubmit = (qId: string, text?: string) => {
    const answerToUse = text || userInputs[qId] || currentQ.suggestedAnswer;
    setIsAiEvaluating(true);

    setTimeout(() => {
      const updated = questions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            userAnswer: answerToUse,
            aiEvaluation: q.aiEvaluation || 'Verified response. Technical risk mitigated.',
          };
        }
        return q;
      });
      setQuestions(updated);
      onUpdateQuestions(updated);
      setIsAiEvaluating(false);

      if (activeIdx < questions.length - 1) {
        setActiveIdx(activeIdx + 1);
      }
    }, 800);
  };

  const allAnswered = questions.every((q) => !!q.userAnswer);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-zinc-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-bold text-white">Signature Feature: Devil's Advocate Stress-Test</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
              AI Technical Interrogation
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            AI Persona Dr. Vance is stress-testing your idea before generating the Project HUB blueprint.
          </p>
        </div>

        {allAnswered && (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition self-start sm:self-auto"
          >
            <span>Generate Project HUB Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-3 gap-3">
        {questions.map((q, idx) => {
          const isDone = !!q.userAnswer;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={q.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500 text-white'
                  : isDone
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  : 'bg-zinc-950/60 border-zinc-900 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Q{idx + 1}: {q.focusArea}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                )}
              </div>
              <p className="text-xs font-bold truncate">{q.question}</p>
            </div>
          );
        })}
      </div>

      {/* Active Question Dialogue Card */}
      {currentQ && (
        <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          
          {/* Persona Avatar */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-brand-500/40 flex items-center justify-center text-brand-500 shrink-0 shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Dr. Vance (Technical Reviewer Persona)</h3>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono font-bold">
                  Focus: {currentQ.focusArea}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{currentQ.context}</p>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-xl text-sm font-semibold text-white leading-relaxed">
            "{currentQ.question}"
          </div>

          {/* Previous Answered State or Input Box */}
          {currentQ.userAnswer ? (
            <div className="space-y-4">
              <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
                  <User className="w-3.5 h-3.5" />
                  <span>Your Answered Defense:</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">{currentQ.userAnswer}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Technical Evaluation & Verdict:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">{currentQ.aiEvaluation}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Defend your engineering approach or select AI reasoning:
                </label>
                <textarea
                  rows={3}
                  value={userInputs[currentQ.id] || ''}
                  onChange={(e) => setUserInputs({ ...userInputs, [currentQ.id]: e.target.value })}
                  placeholder="Type how your system handles this risk..."
                  className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit(currentQ.id, currentQ.suggestedAnswer)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Let AI Reason Recommended Answer</span>
                </button>

                <button
                  type="button"
                  disabled={isAiEvaluating}
                  onClick={() => handleAnswerSubmit(currentQ.id)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition"
                >
                  {isAiEvaluating ? (
                    <span>Evaluating Defense...</span>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
