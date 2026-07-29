'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'quenched' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-bold tracking-tight rounded-blueprint transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ember focus-visible:ring-offset-2 focus-visible:ring-offset-forge-black disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-brand-ember hover:bg-brand-ember-hover text-white shadow-lg shadow-brand-ember/20 border border-brand-ember/50',
      quenched:
        'bg-quenched-steel hover:bg-quenched-steel-light text-forge-white shadow-sm border border-quenched-steel/50',
      outline:
        'bg-forge-surface/80 hover:bg-forge-surface-light text-forge-white border border-quenched-steel/30 hover:border-brand-ember/40',
      ghost:
        'bg-transparent hover:bg-forge-surface-light text-zinc-300 hover:text-white',
      danger:
        'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-xs sm:text-sm gap-2',
      lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5 font-extrabold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
