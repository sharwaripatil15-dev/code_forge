'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-quenched-steel-light">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-forge-surface-light border border-quenched-steel/30 rounded-blueprint text-sm font-sans text-forge-white placeholder-zinc-500 focus:outline-none focus:border-brand-ember focus:ring-1 focus:ring-brand-ember/30 transition-colors',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-mono text-red-400">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] font-mono text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-quenched-steel-light">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full p-4 bg-forge-surface-light border border-quenched-steel/30 rounded-blueprint text-sm font-sans text-forge-white placeholder-zinc-500 focus:outline-none focus:border-brand-ember focus:ring-1 focus:ring-brand-ember/30 transition-colors resize-none leading-relaxed',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-mono text-red-400">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] font-mono text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-quenched-steel-light">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-forge-surface-light border border-quenched-steel/30 rounded-blueprint text-sm font-sans font-semibold text-forge-white focus:outline-none focus:border-brand-ember focus:ring-1 focus:ring-brand-ember/30 cursor-pointer transition-colors',
            error && 'border-red-500/60',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-[11px] font-mono text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
