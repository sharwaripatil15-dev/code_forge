'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
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
        botReply = "Supabase pgvector is ideal here. Store hashes so identical diffs pull cached results instantly!";
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
    }, 900);
  };

  const handleTriggerLiveTelegramPush = () => {
    setPushedTelegram(true);
    setTimeout(() => setPushedTelegram(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121218]/90 border border-zinc-800/90 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToBlueprint}
            className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-zinc-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <Bot className="w-6 h-6 text-brand-500" />
              <span>AI Mentor Agent (Telegram Simulator)</span>
            </h2>
            <p className="text-xs text-zinc-400 font-medium">
              Milestone check-ins & real-time architectural guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerLiveTelegramPush}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs shadow-xl transition self-start sm:self-auto shrink-0"
        >
          <Bell className="w-4 h-4" />
          <span>{pushedTelegram ? 'Alert Pushed to Telegram!' : 'Dispatch Telegram Alert'}</span>
        </button>
      </div>

      {/* Chat Simulator Canvas */}
      <div className="bg-[#121218]/90 border border-zinc-800 rounded-3xl flex flex-col h-[560px] shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Chat Stream */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'bot'
                    ? 'bg-brand-500/10 border border-brand-500/30 text-brand-500 shadow-md'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-lg p-5 rounded-3xl text-xs leading-relaxed space-y-2 font-medium ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-500 to-orange-600 text-white rounded-tr-none shadow-lg shadow-brand-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`text-[10px] font-mono ${
                    msg.sender === 'user' ? 'text-brand-200 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-6 border-t border-zinc-800/80 bg-zinc-950/90 flex items-center gap-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Mentor a follow-up question about your architecture..."
            className="flex-1 px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-2xl shadow-xl transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
