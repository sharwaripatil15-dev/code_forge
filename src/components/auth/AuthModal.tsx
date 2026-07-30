'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { UserSession, sendMagicLink } from '@/lib/supabase';
import { Mail, ShieldCheck, Copy, Check, Bot, X, Sparkles, Send } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  onLoginSuccess: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, session, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    setNotice(null);

    const res = await sendMagicLink(email.trim());
    setIsLoading(false);

    if (res.success) {
      setNotice({ type: 'success', text: res.message });
      onLoginSuccess(email.trim());
    } else {
      setNotice({ type: 'error', text: res.message });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`/connect ${session.telegramConnectCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forge-black/80 backdrop-blur-md animate-fade-in">
      <Card variant="blueprint" className="max-w-md w-full p-6 space-y-6 shadow-2xl relative border-brand-ember/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-forge-surface-light transition min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-ember/20 border border-brand-ember/40 rounded-blueprint text-brand-ember">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-extrabold text-forge-white">
              Lightweight Supabase Auth
            </h3>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Log in via passwordless Magic Link to save your Project HUB blueprints & link your Telegram chat.
          </p>
        </div>

        {/* Status Badge */}
        {session.isLoggedIn ? (
          <div className="p-4 rounded-blueprint bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Logged In as {session.email}</span>
              </div>
              <Badge variant="emerald" size="sm">Active Session</Badge>
            </div>
            <p className="text-[11px] font-sans text-zinc-300">
              Your generated blueprints are auto-saved to this account. Refreshing your browser will restore your workspace state.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-300">Enter Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@ideaforge.ai"
                required
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !email.trim()}
              className="w-full justify-center font-bold"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {isLoading ? 'Dispatching Magic Link...' : 'Send Passwordless Magic Link'}
            </Button>
          </form>
        )}

        {/* Notice Display */}
        {notice && (
          <div className={`p-3 rounded-blueprint text-xs font-sans border ${
            notice.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {notice.text}
          </div>
        )}

        {/* Telegram Chat Linking Section */}
        <div className="pt-4 border-t border-quenched-steel/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-display font-bold text-forge-white">
              <Bot className="w-4 h-4 text-brand-ember" />
              <span>Link Telegram AI Mentor Chat</span>
            </div>
            <Badge variant="quenched" size="sm">Per-User Account Sync</Badge>
          </div>

          <p className="text-[11px] font-sans text-zinc-400">
            Click the button below to connect your Telegram account to your IdeaForge Supabase profile in 1-click:
          </p>

          <div className="flex flex-col gap-2">
            <a
              href={`https://t.me/Loopideaforgebot?start=${session.telegramConnectCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-blueprint bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>⚡ Connect Telegram Bot (@Loopideaforgebot)</span>
            </a>

            <div className="p-3 bg-forge-black border border-quenched-steel/30 rounded-blueprint flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-brand-ember font-bold">
                /start {session.telegramConnectCode}
              </code>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                leftIcon={copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                className="h-7 text-[11px] font-mono px-2"
              >
                {copiedCode ? 'Copied' : 'Copy Code'}
              </Button>
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
}
