'use client';

import React, { useState, useEffect } from 'react';
import { ApiKeys } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forge-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card variant="solid" className="w-full max-w-lg space-y-6 relative border-quenched-steel/30 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-quenched-steel-light hover:text-white p-1.5 rounded-lg hover:bg-forge-surface-light transition focus-visible:ring-2 focus-visible:ring-brand-ember"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-ember/15 border border-brand-ember/30 rounded-blueprint text-brand-ember">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-forge-white">
              API Keys Configuration
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Optional keys for live Gemini, GitHub & Telegram APIs
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Google Gemini API Key"
            type="password"
            placeholder="AIzaSy..."
            value={keys.geminiKey || ''}
            onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
            helperText="Used for deep reasoning, devil's advocate, and blueprint generation."
          />

          <Input
            label="GitHub Access Token (Optional)"
            type="password"
            placeholder="ghp_..."
            value={keys.githubToken || ''}
            onChange={(e) => setKeys({ ...keys, githubToken: e.target.value })}
            helperText="Increases rate limit for live repository code searches."
          />

          <Input
            label="Telegram Bot Token (Optional)"
            type="password"
            placeholder="712345678:AAH..."
            value={keys.telegramBotToken || ''}
            onChange={(e) => setKeys({ ...keys, telegramBotToken: e.target.value })}
            helperText="Enables live push messages to your personal Telegram mentor chat."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-quenched-steel/20">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Keys stored locally in browser session</span>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          >
            {savedSuccess ? 'Saved successfully' : 'Save configuration'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
