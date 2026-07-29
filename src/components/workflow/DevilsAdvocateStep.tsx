'use client';

import React, { useState } from 'react';
import { DeepSearchState, DevilsAdvocateQuestion } from '@/lib/types';
import { Swords, Bot, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    }, 700);
  };

  const allAnswered = questions.every((q) => !!q.userAnswer);

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#121218]/90 border border-zinc-800/90 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-500">
              <Swords className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Devil's Advocate Stress-Test</h2>
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[10px] font-bold uppercase tracking-widest">
              AI Persona Interrogation
            </span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            AI Persona Dr. Vance is stress-testing your architecture before generating the blueprint.
          </p>
        </div>

        {allAnswered && (
          <button
            onClick={onContinue}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-500/20 transition self-start md:self-auto shrink-0"
          >
            <span>Generate Project HUB Blueprint</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questions.map((q, idx) => {
          const isDone = !!q.userAnswer;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={q.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                  : isDone
                  ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                  : 'bg-zinc-950/60 border-zinc-900 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Q0{idx + 1}: {q.focusArea}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
                )}
              </div>
              <p className="text-xs font-extrabold truncate">{q.question}</p>
            </div>
          );
        })}
      </div>

      {/* Active Question Dialogue Box */}
      {currentQ && (
        <div className="bg-[#121218]/90 border border-zinc-800/90 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl relative">
          
          {/* Persona Header */}
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-brand-500/40 flex items-center justify-center text-brand-500 shrink-0 shadow-lg">
              <Bot className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-extrabold text-white">Dr. Vance (Technical Reviewer Persona)</h3>
                <span className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Focus: {currentQ.focusArea}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">{currentQ.context}</p>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl text-base font-bold text-white leading-relaxed shadow-inner">
            "{currentQ.question}"
          </div>

          {/* User Answer / Defense State */}
          {currentQ.userAnswer ? (
            <div className="space-y-4">
              <div className="bg-brand-500/10 border border-brand-500/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Your Technical Defense:</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">{currentQ.userAnswer}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Technical Evaluation Verdict:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">{currentQ.aiEvaluation}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Defend your engineering approach or select recommended reasoning:
                </label>
                <textarea
                  rows={3}
                  value={userInputs[currentQ.id] || ''}
                  onChange={(e) => setUserInputs({ ...userInputs, [currentQ.id]: e.target.value })}
                  placeholder="Type how your system handles this technical risk..."
                  className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit(currentQ.id, currentQ.suggestedAnswer)}
                  className="flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition"
                >
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span>Use Recommended AI Reasoning</span>
                </button>

                <button
                  type="button"
                  disabled={isAiEvaluating}
                  onClick={() => handleAnswerSubmit(currentQ.id)}
                  className="flex items-center gap-3 px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-brand-500/20 transition"
                >
                  {isAiEvaluating ? (
                    <span>Evaluating Defense...</span>
                  ) : (
                    <>
                      <span>Submit Technical Defense</span>
                      <ArrowRight className="w-4 h-4" />
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
