'use client';

import React, { useState } from 'react';
import { TechStackRecommendation, ArchitectureNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, CheckCircle2, UserPlus, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeamSkillMatrixProps {
  projectTitle: string;
  techStack: TechStackRecommendation[];
  architectureNodes: ArchitectureNode[];
}

export default function TeamSkillMatrix({
  projectTitle,
  techStack,
  architectureNodes,
}: TeamSkillMatrixProps) {
  // Derive roles from stack and nodes
  const roles = [
    {
      id: 'role-llm',
      title: 'AI / LLM Prompt & Steering Engineer',
      skills: ['Gemini API', 'Prompt Engineering', 'Vector Embeddings'],
      requiredFor: techStack.find((t) => t.category.includes('LLM'))?.chosen || 'Gemini 1.5 Flash',
    },
    {
      id: 'role-backend',
      title: 'Backend Systems & Parser Specialist',
      skills: ['WASM / Rust / Node.js', 'AST Tree Parsing', 'REST APIs'],
      requiredFor: architectureNodes[1]?.title || 'Core Engine Pipeline',
    },
    {
      id: 'role-frontend',
      title: 'Full-Stack UI / Product Engineer',
      skills: ['Next.js 14 App Router', 'Tailwind CSS', 'TypeScript'],
      requiredFor: techStack[0]?.chosen || 'Next.js 14',
    },
    {
      id: 'role-devops',
      title: 'DevOps & Integration Specialist',
      skills: ['Telegram Bot API', 'GitHub Webhooks', 'Vercel Deployment'],
      requiredFor: architectureNodes[4]?.title || 'Integration Webhook',
    },
  ];

  const [coveredSkills, setCoveredSkills] = useState<Record<string, boolean>>({
    'role-frontend': true,
    'role-llm': true,
  });
  const [copiedPost, setCopiedPost] = useState(false);

  const coveredCount = Object.values(coveredSkills).filter(Boolean).length;
  const totalRoles = roles.length;
  const readinessPercentage = Math.round((coveredCount / totalRoles) * 100);

  const missingRoles = roles.filter((r) => !coveredSkills[r.id]);

  const cofounderPostText = `🚀 *Building ${projectTitle}*

We are recruiting co-founders / hackathon team members!

💡 **Project Overview**: Building a high-impact platform leveraging ${techStack[0]?.chosen || 'Next.js'} and ${techStack[1]?.chosen || 'Gemini 1.5 Flash'}.

🎯 **Roles We Need**:
${missingRoles.map((r) => `- **${r.title}** (${r.skills.join(', ')})`).join('\n')}

Interested? DM me to review our complete IdeaForge blueprint and join the repository!`;

  const handleCopyPost = () => {
    navigator.clipboard.writeText(cofounderPostText);
    setCopiedPost(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setCopiedPost(false), 2500);
  };

  return (
    <Card variant="blueprint" className="p-8 space-y-6 shadow-xl border-brand-ember/20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
        <div>
          <h3 className="text-lg font-display font-extrabold text-forge-white flex items-center gap-3">
            <Users className="w-5 h-5 text-brand-ember" />
            <span>Team Readiness & Skill-Gap Matrix</span>
          </h3>
          <p className="text-xs font-sans text-zinc-400">
            Check off the skills you possess to calculate team coverage and generate a co-founder recruitment post.
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-mono font-extrabold text-brand-ember">{readinessPercentage}%</div>
          <p className="text-[10px] font-mono text-quenched-steel-light uppercase tracking-wider">Team Readiness Index</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
          <span>Role Coverage ({coveredCount}/{totalRoles} Roles Filled)</span>
          <span className={readinessPercentage >= 75 ? 'text-emerald-400' : 'text-amber-molten'}>
            {readinessPercentage >= 75 ? 'Strong Team Foundation' : 'Hiring / Co-Founder Recommended'}
          </span>
        </div>
        <div className="w-full bg-forge-black h-3 rounded-full overflow-hidden border border-quenched-steel/30">
          <div
            className="bg-gradient-to-r from-brand-ember via-amber-molten to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${readinessPercentage}%` }}
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {roles.map((role) => {
          const isCovered = !!coveredSkills[role.id];

          return (
            <Card
              key={role.id}
              variant="solid"
              onClick={() =>
                setCoveredSkills({
                  ...coveredSkills,
                  [role.id]: !isCovered,
                })
              }
              className={`p-5 space-y-3 cursor-pointer transition-all border ${
                isCovered
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-forge-white'
                  : 'bg-forge-surface/60 border-quenched-steel/30 text-zinc-400 hover:border-brand-ember/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-quenched-steel-light">
                  Required Role
                </span>
                <Badge variant={isCovered ? 'emerald' : 'ember'} size="sm">
                  {isCovered ? 'I Can Build This' : 'Need Co-Founder'}
                </Badge>
              </div>

              <h4 className="text-xs font-display font-extrabold text-forge-white">{role.title}</h4>

              <div className="text-[11px] font-mono text-zinc-300">
                <span className="font-bold text-brand-ember">For Component: </span>{role.requiredFor}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {role.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded bg-forge-black/60 border border-quenched-steel/20 text-[10px] font-mono text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recruitment Post Generator */}
      {missingRoles.length > 0 && (
        <Card variant="blueprint" className="p-6 bg-brand-ember/10 border-brand-ember/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-forge-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-ember" />
                <span>Auto-Generated Co-Founder Recruitment Post</span>
              </h4>
              <p className="text-xs font-sans text-zinc-400">
                Post this on Discord, Twitter/X, or LinkedIn to recruit teammates matching your skill gaps:
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyPost}
              leftIcon={copiedPost ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              className="w-full sm:w-auto justify-center min-h-[44px] shrink-0"
            >
              {copiedPost ? 'Copied Post to Clipboard!' : 'Copy Recruitment Post'}
            </Button>
          </div>

          <pre className="p-4 bg-forge-black border border-quenched-steel/30 rounded-blueprint text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed shadow-inner">
            {cofounderPostText}
          </pre>
        </Card>
      )}
    </Card>
  );
}
