'use client';

import React, { useState } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Send, Bot, User, Sparkles, CheckCircle2, MessageSquare, Bell, ArrowLeft } from 'lucide-react';

interface MentorStepProps {
  blueprint: ProjectBlueprint;
  onBackToBlueprint: () => void;
  telegramBotToken?: string;
}

export default function MentorStep({ blueprint, onBackToBlueprint, telegramBotToken }: MentorStepProps) {
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

    // Simulate AI Mentor reply
    setTimeout(() => {
      let botReply = "Great question! For Milestone 1, focus on isolating the AST diff nodes before sending to Gemini. This keeps your token count under 2,000 per check.";
      if (currentQuery.toLowerCase().includes('database') || currentQuery.toLowerCase().includes('supabase')) {
        botReply = "Supabase pgvector is ideal here. Store tree-sitter node hashes so identical diffs pull cached reviews instantly!";
      } else if (currentQuery.toLowerCase().includes('deploy') || currentQuery.toLowerCase().includes('vercel')) {
        botReply = "Deploy to Vercel with standard Server Actions. Ensure your WASM tree-sitter file is bundled in public/ directory.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `🤖 ${botReply}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handleTriggerLiveTelegramPush = () => {
    setPushedTelegram(true);
    setTimeout(() => setPushedTelegram(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#121216] border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBlueprint}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-500" />
              <span>AI Mentor Agent (Telegram Simulator)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Ongoing milestone check-ins & project guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerLiveTelegramPush}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg transition"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{pushedTelegram ? 'Pushed to Telegram!' : 'Dispatch Telegram Alert'}</span>
        </button>
      </div>

      {/* Chat Box Interface */}
      <div className="bg-[#121216] border border-zinc-800 rounded-2xl flex flex-col h-[480px] shadow-2xl overflow-hidden">
        
        {/* Chat Stream */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'bot'
                    ? 'bg-brand-500/10 border border-brand-500/30 text-brand-500'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`text-[9px] font-mono ${
                    msg.sender === 'user' ? 'text-brand-200 text-right' : 'text-zinc-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Mentor a follow-up question about your architecture or tech stack..."
            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl shadow-lg transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
