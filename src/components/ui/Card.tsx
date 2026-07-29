'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'blueprint' | 'interactive' | 'solid';
  hasCrosshair?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'blueprint',
      hasCrosshair = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-blueprint p-6 border transition-all duration-200';

    const variants = {
      blueprint: 'glass-blueprint-card',
      interactive: 'glass-blueprint-card glass-blueprint-card-hover cursor-pointer',
      solid: 'bg-forge-surface border-quenched-steel/25 text-forge-white',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hasCrosshair && 'blueprint-corner-cross',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
