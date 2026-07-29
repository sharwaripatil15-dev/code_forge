'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';

interface ForgeTransformationProps {
  ideaText: string;
  onComplete: () => void;
}

export default function ForgeTransformation({ ideaText, onComplete }: ForgeTransformationProps) {
  const [phase, setPhase] = useState<'disintegrate' | 'reassemble' | 'done'>('disintegrate');

  useEffect(() => {
    // Phase 1: Disintegrate raw idea text (1.2s)
    const t1 = setTimeout(() => {
      setPhase('reassemble');
    }, 1300);

    // Phase 2: Reassemble into structural blueprint (1.2s)
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Particle positions generator
  const particleCount = 28;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 80 + (i % 5) * 25;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: (i % 4) * 0.05,
      size: 4 + (i % 3) * 2,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forge-black/90 backdrop-blur-md p-6">
      <div className="max-w-2xl w-full text-center space-y-8 relative">
        
        {/* Status Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-ember/15 border border-brand-ember/30 text-brand-ember font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forge Transformation Sequence</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forge-white">
            {phase === 'disintegrate'
              ? 'Disintegrating Raw Concept...'
              : 'Forging Validated System Architecture...'}
          </h2>
        </div>

        {/* Central Particle Animation Canvas */}
        <div className="relative h-64 flex items-center justify-center border border-quenched-steel/20 bg-forge-surface/60 rounded-blueprint p-8 overflow-hidden blueprint-corner-cross">
          
          <AnimatePresence mode="wait">
            {phase === 'disintegrate' ? (
              <motion.div
                key="raw-text"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="max-w-md p-5 bg-forge-surface-light/80 border border-quenched-steel/30 rounded-lg text-xs font-mono text-zinc-300 leading-relaxed"
              >
                <div className="text-[10px] font-bold text-brand-ember uppercase mb-1">Raw Input Data</div>
                "{ideaText || 'Autonomous AI Code Reviewer & Security Guardrail'}"
              </motion.div>
            ) : (
              <motion.div
                key="blueprint-mesh"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="w-full max-w-lg space-y-3"
              >
                <div className="text-[10px] font-mono font-bold text-quenched-steel-light uppercase">
                  Synthesized Blueprint Mesh • 5 Architecture Nodes Connected
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {['Parser', 'Analyzer', 'Synthesizer', 'Sandbox', 'Exporter'].map((node, idx) => (
                    <motion.div
                      key={node}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.2, duration: 0.4 }}
                      className="p-3 bg-brand-ember/10 border border-brand-ember/40 rounded-md text-center space-y-1"
                    >
                      <Layers className="w-4 h-4 text-brand-ember mx-auto" />
                      <div className="text-[10px] font-mono font-bold text-forge-white truncate">{node}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ember Particles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                animate={
                  phase === 'disintegrate'
                    ? { x: p.x, y: p.y, opacity: 1, scale: 1.4 }
                    : { x: 0, y: 0, opacity: 0, scale: 0.2 }
                }
                transition={{
                  duration: 1.1,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
                style={{ width: p.size, height: p.size }}
                className="absolute rounded-full bg-brand-ember shadow-md shadow-brand-ember/50"
              />
            ))}
          </div>

        </div>

        <p className="text-xs font-mono text-zinc-500">
          Transforming unstructured requirements into high-reliability implementation modules
        </p>

      </div>
    </div>
  );
}
