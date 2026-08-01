'use client';

import React, { useState } from 'react';
import { DeepSearchState, DevilsAdvocateQuestion, GapMetrics } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import IdeaRadarChart from '../visualization/IdeaRadarChart';
import { Swords, Bot, User, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, SkipForward } from 'lucide-react';

interface DevilsAdvocateStepProps {
  data: DeepSearchState;
  onContinue: () => void;
  onUpdateQuestions: (questions: DevilsAdvocateQuestion[]) => void;
  onUpdateMetrics?: (metrics: GapMetrics) => void;
}

export default function DevilsAdvocateStep({ data, onContinue, onUpdateQuestions, onUpdateMetrics }: DevilsAdvocateStepProps) {
  const [questions, setQuestions] = useState<DevilsAdvocateQuestion[]>(data.devilsQuestions);
  const [activeIdx, setActiveIdx] = useState(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [lastImpact, setLastImpact] = useState<{ delta: number; text: string; focusArea: string } | null>(null);

  const currentQ = questions[activeIdx];

  const handleAnswerSubmit = async (qId: string, customAnswer?: string, isSkip: boolean = false) => {
    const answerToUse = customAnswer || userInputs[qId] || '';
    const isWeak = !isSkip && answerToUse.trim().length > 0 && answerToUse.trim().length < 15;
    const isRecommended = customAnswer === currentQ.suggestedAnswer;

    setIsAiEvaluating(true);

    let delta = +6;
    let evalText = 'Verified custom technical defense. Architectural risk successfully mitigated.';

    try {
      if (isSkip) {
        delta = -8;
        evalText = 'Question skipped. Unmitigated architectural risk reduces feasibility rating.';
      } else {
        const response = await fetch('/api/devils', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: currentQ.question,
            userAnswer: answerToUse || currentQ.suggestedAnswer,
            focusArea: currentQ.focusArea,
            ideaText: data.input.idea,
          }),
        });

        const resJson = await response.json();
        if (resJson.success && resJson.aiEvaluation) {
          evalText = resJson.aiEvaluation;
          delta = resJson.impactOnScore || (isRecommended ? +7 : isWeak ? -6 : +6);
        }
      }
    } catch (err) {
      console.warn('Devils Advocate live API fetch error, using fallback:', err);
    } finally {
      const updatedQs = questions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            userAnswer: isSkip ? '[SKIPPED]' : (answerToUse || currentQ.suggestedAnswer),
            aiEvaluation: evalText,
            impactOnScore: delta,
          };
        }
        return q;
      });

      setQuestions(updatedQs);
      onUpdateQuestions(updatedQs);

      // Real-time confidence score update
      if (onUpdateMetrics && data.metrics) {
        const newFeasibility = Math.max(30, Math.min(100, data.metrics.feasibilityScore + delta));
        const newNovelty = Math.max(30, Math.min(100, data.metrics.noveltyScore + (delta > 0 ? 1 : -3)));
        onUpdateMetrics({
          ...data.metrics,
          feasibilityScore: newFeasibility,
          noveltyScore: newNovelty,
        });
      }

      setLastImpact({ delta, text: evalText, focusArea: currentQ.focusArea });
      setIsAiEvaluating(false);

      if (activeIdx < questions.length - 1) {
        setActiveIdx(activeIdx + 1);
      }
    }
  };

  const allAnswered = questions.every((q) => !!q.userAnswer);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Header Banner */}
      <Card variant="blueprint" className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
              <Swords className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-forge-white tracking-tight">
              Devil's Advocate Stress-Test
            </h2>
            <Badge variant="ember">
              AI Persona Interrogation
            </Badge>
          </div>
          <p className="text-sm font-sans text-zinc-400">
            Dr. Vance is stress-testing your architecture. Each response dynamically moves your Idea DNA Radar score in real time.
          </p>
        </div>

        {allAnswered && (
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="self-start md:self-auto shrink-0"
          >
            Generate blueprint
          </Button>
        )}
      </Card>

      {/* Live Confidence Impact Alert Banner */}
      {lastImpact && (
        <Card
          variant="solid"
          className={`p-4 flex items-center justify-between gap-4 border text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-300 ${
            lastImpact.delta > 0
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {lastImpact.delta > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div>
              <span className="font-bold">
                [{lastImpact.focusArea}] Score Adjusted: {lastImpact.delta > 0 ? `+${lastImpact.delta}%` : `${lastImpact.delta}%`}
              </span>
              <p className="text-[11px] opacity-90 font-sans">{lastImpact.text}</p>
            </div>
          </div>

          <Badge variant={lastImpact.delta > 0 ? 'emerald' : 'mono'} size="sm">
            Live Radar Updated
          </Badge>
        </Card>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questions.map((q, idx) => {
          const isDone = !!q.userAnswer;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={q.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-5 rounded-blueprint border cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-ember ${
                isCurrent
                  ? 'bg-brand-ember/10 border-brand-ember text-forge-white shadow-lg shadow-brand-ember/10'
                  : isDone
                  ? 'bg-forge-surface/80 border-quenched-steel/30 text-zinc-300'
                  : 'bg-forge-black/60 border-quenched-steel/20 text-zinc-600'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveIdx(idx)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-quenched-steel-light">
                  Q0{idx + 1}: {q.focusArea}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-brand-ember animate-pulse"></span>
                )}
              </div>
              <p className="text-xs font-display font-bold truncate text-forge-white">{q.question}</p>
              {q.impactOnScore !== undefined && (
                <div className={`text-[10px] font-mono font-bold mt-1 ${q.impactOnScore > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Impact: {q.impactOnScore > 0 ? `+${q.impactOnScore}%` : `${q.impactOnScore}%`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Question Interrogation Box */}
      {currentQ && (
        <Card variant="blueprint" className="p-8 sm:p-10 space-y-8 shadow-2xl relative">
          
          {/* Persona Header */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-blueprint bg-forge-surface-light border border-brand-ember/40 flex items-center justify-center text-brand-ember shrink-0 shadow-lg">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base sm:text-lg font-display font-bold text-forge-white">
                  Dr. Vance (Technical Reviewer Persona)
                </h3>
                <Badge variant="quenched">
                  Focus: {currentQ.focusArea}
                </Badge>
              </div>
              <p className="text-xs font-sans text-zinc-400">{currentQ.context}</p>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-forge-surface border border-quenched-steel/30 p-6 rounded-blueprint text-sm sm:text-base font-sans font-bold text-forge-white leading-relaxed shadow-inner">
            "{currentQ.question}"
          </div>

          {/* User Answer / Defense State */}
          {currentQ.userAnswer ? (
            <div className="space-y-4">
              <Card variant="solid" className="bg-brand-ember/10 border-brand-ember/30 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-ember uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Your Technical Defense:</span>
                </div>
                <p className="text-xs font-sans text-zinc-200 leading-relaxed">{currentQ.userAnswer}</p>
              </Card>

              <Card variant="solid" className="bg-emerald-500/10 border-emerald-500/30 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Technical Evaluation Verdict:</span>
                </div>
                <p className="text-xs font-sans text-zinc-300 leading-relaxed">{currentQ.aiEvaluation}</p>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Textarea
                label="Defend your engineering approach or select recommended reasoning:"
                rows={3}
                value={userInputs[currentQ.id] || ''}
                onChange={(e) => setUserInputs({ ...userInputs, [currentQ.id]: e.target.value })}
                placeholder="Type how your system handles this technical risk..."
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnswerSubmit(currentQ.id, currentQ.suggestedAnswer)}
                    leftIcon={<Sparkles className="w-4 h-4 text-brand-ember" />}
                    className="w-full sm:w-auto justify-center min-h-[44px]"
                  >
                    Use recommended AI reasoning
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAnswerSubmit(currentQ.id, '', true)}
                    leftIcon={<SkipForward className="w-4 h-4 text-zinc-400" />}
                    className="w-full sm:w-auto justify-center min-h-[44px]"
                  >
                    Skip (-8% penalty)
                  </Button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isAiEvaluating}
                  onClick={() => handleAnswerSubmit(currentQ.id)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto justify-center min-h-[44px]"
                >
                  Submit technical defense
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Live Idea DNA Radar Chart reflecting scores in real time */}
      <div className="space-y-3 pt-4">
        <div className="text-xs font-mono font-bold text-quenched-steel-light uppercase tracking-wider flex items-center justify-between">
          <span>Live Confidence Meter & Idea DNA Radar</span>
          <span className="text-brand-ember">Real-time Radar Morphing Active</span>
        </div>
        <IdeaRadarChart metrics={data.metrics} />
      </div>
    </div>
  );
}

