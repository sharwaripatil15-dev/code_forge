'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Send, Bot, User, Bell, ArrowLeft } from 'lucide-react';

interface MentorStepProps {
  blueprint: ProjectBlueprint;
  onBackToBlueprint: () => void;
  telegramBotToken?: string;
}

export default function MentorStep({ blueprint, onBackToBlueprint }: MentorStepProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: blueprint.telegramMentorPrompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [pushedTelegram, setPushedTelegram] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText;
    setInputText('');

    setTimeout(() => {
      let botReply = "Great question! For Milestone 1, focus on isolating your core logic modules before connecting neural reasoning. This keeps execution budgets optimal.";
      if (currentQuery.toLowerCase().includes('database') || currentQuery.toLowerCase().includes('supabase')) {
        botReply = "Supabase pgvector is ideal here. Store AST hashes so identical diffs pull cached results instantly!";
      } else if (currentQuery.toLowerCase().includes('deploy') || currentQuery.toLowerCase().includes('vercel')) {
        botReply = "Deploy to Vercel with standard Server Actions. Ensure your environment variables are configured in Vercel settings.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `🤖 ${botReply}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  const handleTriggerLiveTelegramPush = () => {
    setPushedTelegram(true);
    setTimeout(() => setPushedTelegram(false), 3000);
  };

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
            <h2 className="text-2xl font-display font-extrabold text-forge-white flex items-center gap-3">
              <Bot className="w-6 h-6 text-brand-ember" />
              <span>AI Mentor Agent (Telegram Simulator)</span>
            </h2>
            <p className="text-xs font-sans text-zinc-400">
              Milestone check-ins & real-time architectural guidance
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
          {pushedTelegram ? 'Alert dispatched to Telegram!' : 'Dispatch Telegram alert'}
        </Button>
      </Card>

      {/* Chat Simulator Canvas */}
      <Card variant="blueprint" className="flex flex-col h-[560px] p-0 shadow-2xl overflow-hidden">
        
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
                <p>{msg.text}</p>
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
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 sm:p-6 border-t border-quenched-steel/20 bg-forge-black/90 flex items-center gap-3">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Mentor a follow-up question about your architecture..."
            className="flex-1 text-xs"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputText.trim()}
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
