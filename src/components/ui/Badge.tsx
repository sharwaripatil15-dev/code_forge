'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'ember' | 'quenched' | 'amber' | 'emerald' | 'mono';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'quenched',
  size = 'md',
  pulse = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-bold rounded-md transition-colors';

  const variants = {
    ember:
      'bg-brand-ember/15 text-brand-ember border border-brand-ember/30',
    quenched:
      'bg-quenched-steel/20 text-quenched-steel-light border border-quenched-steel/30',
    amber:
      'bg-amber-molten/15 text-amber-molten border border-amber-molten/30',
    emerald:
      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    mono:
      'bg-forge-surface-light text-zinc-300 border border-zinc-700/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {pulse && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full animate-ping shrink-0',
            variant === 'ember' && 'bg-brand-ember',
            variant === 'quenched' && 'bg-quenched-steel-light',
            variant === 'emerald' && 'bg-emerald-400',
            variant === 'amber' && 'bg-amber-molten'
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
