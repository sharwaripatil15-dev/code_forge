'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectBlueprint } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, Share2, Copy, Check, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareBlueprintModalProps {
  blueprint: ProjectBlueprint;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareBlueprintModal({ blueprint, isOpen, onClose }: ShareBlueprintModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrTheme, setQrTheme] = useState<'ember' | 'cyan' | 'gold' | 'emerald'>('ember');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/app?title=${encodeURIComponent(blueprint.title || 'project')}`
    : 'https://ideaforge.dev/blueprint';

  const shareText = `Check out our AI-validated project blueprint for "${blueprint.title || 'IdeaForge Project'}" — ${blueprint.tagline || 'Built with IdeaForge AI Copilot'}`;

  useEffect(() => {
    if (!isOpen || !qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#06070B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const themeColors: Record<string, string> = {
      ember: '#FF3B00',
      cyan: '#00F0FF',
      gold: '#FF9500',
      emerald: '#10B981',
    };

    ctx.fillStyle = themeColors[qrTheme] || '#FF3B00';
    const tileSize = 8;
    for (let r = 0; r < 18; r++) {
      for (let c = 0; c < 18; c++) {
        if ((r + c) % 2 === 0 || (r * c) % 3 === 0 || r === 0 || c === 0 || r === 17 || c === 17) {
          ctx.fillRect(r * tileSize + 8, c * tileSize + 8, tileSize - 1.5, tileSize - 1.5);
        }
      }
    }
  }, [isOpen, qrTheme]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'whatsapp' | 'reddit') => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
    } else if (platform === 'reddit') {
      url = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
    }

    window.open(url, '_blank');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-md bg-forge-surface border border-brand-ember/40 rounded-blueprint shadow-2xl overflow-hidden flex flex-col justify-between">
        <div className="p-5 bg-forge-black/90 border-b border-quenched-steel/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-ember/20 border border-brand-ember/40 text-brand-ember">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-extrabold text-white">Share Blueprint Holo-Link</h3>
              <p className="text-xs text-zinc-400 font-sans">Share 3D architecture & specs across social platforms.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-quenched-steel/20 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex flex-col items-center">
          <div className="p-3.5 bg-forge-black border border-brand-ember/40 rounded-2xl shadow-xl flex flex-col items-center space-y-2.5">
            <canvas ref={qrCanvasRef} width={160} height={160} className="rounded-xl" />

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-zinc-400 font-bold">QR Theme:</span>
              {(['ember', 'cyan', 'gold', 'emerald'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setQrTheme(theme)}
                  className={`w-4 h-4 rounded-full border border-white/20 transition ${
                    theme === 'ember'
                      ? 'bg-brand-ember'
                      : theme === 'cyan'
                      ? 'bg-cyan-400'
                      : theme === 'gold'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  } ${qrTheme === theme ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="w-full space-y-2 font-mono">
            <span className="text-xs text-zinc-300 font-bold uppercase tracking-wider block">
              Quick Social Export:
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <button onClick={() => handleSocialShare('twitter')} className="p-2 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 font-bold hover:bg-sky-500/25 transition text-center">Twitter</button>
              <button onClick={() => handleSocialShare('linkedin')} className="p-2 rounded-lg bg-blue-600/15 border border-blue-600/30 text-blue-400 font-bold hover:bg-blue-600/25 transition text-center">LinkedIn</button>
              <button onClick={() => handleSocialShare('whatsapp')} className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/25 transition text-center">WhatsApp</button>
              <button onClick={() => handleSocialShare('reddit')} className="p-2 rounded-lg bg-orange-600/15 border border-orange-600/30 text-orange-400 font-bold hover:bg-orange-600/25 transition text-center">Reddit</button>
            </div>
          </div>

          <div className="w-full space-y-2 font-mono">
            <label className="text-xs text-zinc-300 font-bold uppercase tracking-wider block">
              Blueprint Holo-URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full h-9 px-3 bg-forge-black border border-quenched-steel/30 rounded-lg text-xs text-emerald-400 font-mono focus:outline-none"
              />
              <Button variant="primary" size="sm" onClick={handleCopyLink} className="text-xs font-mono shrink-0">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-forge-black/90 border-t border-quenched-steel/30 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-mono">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
