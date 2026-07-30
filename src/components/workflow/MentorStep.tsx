'use client';

import React, { useState, useEffect } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Send, Bot, User, Bell, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MentorStepProps {
  blueprint: ProjectBlueprint;
  onBackToBlueprint: () => void;
  onUpdateMilestones?: (milestoneWeek: number, completed: boolean) => void;
  initialMessages?: Array<{ sender: 'bot' | 'user'; text: string; time: string }>;
  onUpdateMessages?: (msgs: Array<{ sender: 'bot' | 'user'; text: string; time: string }>) => void;
}

export default function MentorStep({
  blueprint,
  onBackToBlueprint,
  onUpdateMilestones,
  initialMessages,
  onUpdateMessages,
}: MentorStepProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>(() => {
    if (initialMessages && initialMessages.length > 0) return initialMessages;
    return [
      {
        sender: 'bot',
        text: blueprint.telegramMentorPrompt || `🤖 *IdeaForge AI Mentor*: Welcome! Your blueprint for "${blueprint.title}" is ready. Ask me any question about your architecture, tech stack, or milestones!`,
        time: '10:00 AM',
      },
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pushedTelegram, setPushedTelegram] = useState(false);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (onUpdateMessages) {
      onUpdateMessages(messages);
    }
  }, [messages, onUpdateMessages]);

  // Reminders Capability: Automatically send proactive reminder for active due milestone on mount
  useEffect(() => {
    const activeMilestone = blueprint.milestones.find((m) => !m.completed) || blueprint.milestones[0];
    if (activeMilestone) {
      const reminderText = `⚠️ *Milestone Reminder*: Sprint ${activeMilestone.week} (${activeMilestone.title}) is currently due! Deliverables: ${activeMilestone.deliverables.join(', ')}`;
      
      // Add proactive reminder to chat stream
      setMessages((prev) => {
        if (prev.some((m) => m.text.includes('Milestone Reminder'))) return prev;
        return [
          ...prev,
          {
            sender: 'bot',
            text: reminderText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }
  }, [blueprint.milestones]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userQuery = inputText;
    const userMsg = {
      sender: 'user' as const,
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery, blueprint }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Progress Tracking Capability: Check off milestone if detected
        if (data.completedMilestoneWeek && onUpdateMilestones) {
          onUpdateMilestones(data.completedMilestoneWeek, true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I parsed your input. Keep progressing on your active milestones!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTriggerLiveTelegramPush = async () => {
    setPushedTelegram(true);
    const activeMilestone = blueprint.milestones.find((m) => !m.completed) || blueprint.milestones[0];
    const message = `🤖 *IdeaForge AI Mentor Alert*\nProject: ${blueprint.title}\n\n⚠️ Sprint ${activeMilestone.week}: ${activeMilestone.title} is currently due!\n- **Deliverables**: ${activeMilestone.deliverables.join(', ')}\n- **Risk**: ${activeMilestone.potentialRisk}`;

    let email = 'builder@ideaforge.ai';
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ideaforge_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email) email = parsed.email;
        }
      } catch (e) {}
    }

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
        }),
      });
    } catch (e) {
      console.warn('Telegram push warning:', e);
    }

    setTimeout(() => setPushedTelegram(false), 3000);
  };

  const completedCount = blueprint.milestones.filter((m) => m.completed).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Top Bar */}
      <Card variant="blueprint" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToBlueprint}
            aria-label="Back to project blueprint"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display font-extrabold text-forge-white flex items-center gap-3">
                <Bot className="w-6 h-6 text-brand-ember" />
                <span>AI Mentor Agent (Telegram Engine)</span>
              </h2>
              <Badge variant="emerald" size="sm">
                Progress: {completedCount}/{blueprint.milestones.length} Milestones Completed
              </Badge>
            </div>
            <p className="text-xs font-sans text-zinc-400">
              Proactive milestone reminders, progress tracking & grounded Gemini assistance
            </p>
          </div>
        </div>

        <Button
          variant="quenched"
          size="md"
          onClick={handleTriggerLiveTelegramPush}
          leftIcon={<Bell className="w-4 h-4 text-forge-white" />}
          className="self-start sm:self-auto shrink-0"
        >
          {pushedTelegram ? 'Alert Pushed to Telegram!' : 'Push Live Telegram Alert'}
        </Button>
      </Card>

      {/* Chat Simulator Canvas */}
      <Card variant="blueprint" className="flex flex-col h-[580px] p-0 shadow-2xl overflow-hidden">
        
        {/* Chat Stream */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-blueprint flex items-center justify-center shrink-0 ${
                  msg.sender === 'bot'
                    ? 'bg-brand-ember/15 border border-brand-ember/30 text-brand-ember shadow-md'
                    : 'bg-quenched-steel/30 text-forge-white'
                }`}
              >
                {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-lg p-4 sm:p-5 rounded-blueprint text-xs font-sans leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-brand-ember text-white rounded-tr-none shadow-lg shadow-brand-ember/15'
                    : 'bg-forge-surface-light border border-quenched-steel/25 text-zinc-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] font-mono ${
                    msg.sender === 'user' ? 'text-white/80 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-brand-ember animate-pulse pl-12">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Mentor is thinking & analyzing your blueprint...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 sm:p-6 border-t border-quenched-steel/20 bg-forge-black/90 flex items-center gap-3">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Mentor about your architecture, stack, or report 'I finished milestone 1'..."
            className="flex-1 text-xs"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isTyping}
            className="shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

