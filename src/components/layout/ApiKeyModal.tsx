'use client';

import React, { useState, useEffect } from 'react';
import { ApiKeys } from '@/lib/types';
import { Key, ShieldCheck, X, Sparkles, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: ApiKeys) => void;
  currentKeys: ApiKeys;
}

export default function ApiKeyModal({ isOpen, onClose, onSave, currentKeys }: ApiKeyModalProps) {
  const [keys, setKeys] = useState<ApiKeys>(currentKeys);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeys(currentKeys);
  }, [currentKeys]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(keys);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#121216] border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-xl text-brand-500">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              API Keys Configuration
            </h3>
            <p className="text-xs text-zinc-400">
              Optional keys for live Gemini, GitHub & Telegram APIs. Zero-latency mock fallback is active by default!
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Google Gemini API Key (Flash / Flash-Lite)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keys.geminiKey || ''}
              onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">Used for deep reasoning, devil's advocate, and blueprinting.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              GitHub Access Token (Optional)
            </label>
            <input
              type="password"
              placeholder="ghp_..."
              value={keys.githubToken || ''}
              onChange={(e) => setKeys({ ...keys, githubToken: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">Increases rate limit for live repository code searches.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Telegram Bot Token (Optional)
            </label>
            <input
              type="password"
              placeholder="712345678:AAH..."
              value={keys.telegramBotToken || ''}
              onChange={(e) => setKeys({ ...keys, telegramBotToken: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">Enables live push messages to your personal Telegram mentor chat.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Keys stored locally in browser session</span>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-brand-500/20 transition"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
