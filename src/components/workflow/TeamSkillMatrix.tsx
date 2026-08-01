'use client';

import React, { useState } from 'react';
import { TechStackRecommendation, ArchitectureNode } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, UserPlus, Copy, Check, Plus, Trash2, Sliders, UserCheck, UserX, Settings2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomRole {
  id: string;
  title: string;
  assignee: string;
  skills: string[];
  requiredFor: string;
  isCovered: boolean;
}

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
  // AI Suggestions derived from tech stack & architecture
  const defaultRoles: CustomRole[] = [
    {
      id: 'role-1',
      title: 'AI / LLM Steering Engineer',
      assignee: 'Me',
      skills: ['Gemini API', 'Prompt Engineering', 'Vector Embeddings'],
      requiredFor: techStack.find((t) => t.category.includes('LLM'))?.chosen || 'Gemini 1.5 Flash',
      isCovered: true,
    },
    {
      id: 'role-2',
      title: 'Full-Stack UI Engineer',
      assignee: 'Me',
      skills: ['Next.js 14 App Router', 'Tailwind CSS', 'TypeScript'],
      requiredFor: techStack[0]?.chosen || 'Next.js 14',
      isCovered: true,
    },
    {
      id: 'role-3',
      title: 'Backend Systems & API Lead',
      assignee: 'Unassigned',
      skills: ['Node.js / WASM', 'AST Tree Parsing', 'REST APIs'],
      requiredFor: architectureNodes[1]?.title || 'Core Processing Pipeline',
      isCovered: false,
    },
    {
      id: 'role-4',
      title: 'DevOps & Integration Specialist',
      assignee: 'Unassigned',
      skills: ['Telegram Bot API', 'GitHub Webhooks', 'Vercel / Cloud'],
      requiredFor: architectureNodes[4]?.title || 'Integration Webhook',
      isCovered: false,
    },
  ];

  const [roles, setRoles] = useState<CustomRole[]>(defaultRoles);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // Handle Team Size changes
  const handleTeamSizeChange = (newSize: number) => {
    const clampedSize = Math.max(1, Math.min(8, newSize));
    setTeamSize(clampedSize);

    if (clampedSize > roles.length) {
      const additional: CustomRole[] = [];
      for (let i = roles.length + 1; i <= clampedSize; i++) {
        additional.push({
          id: `role-custom-${Date.now()}-${i}`,
          title: `Role ${i}: Specialized Engineer / Strategist`,
          assignee: 'Unassigned',
          skills: ['Domain Expertise', 'Rapid Prototyping'],
          requiredFor: `Project Module ${i}`,
          isCovered: false,
        });
      }
      setRoles([...roles, ...additional]);
    } else if (clampedSize < roles.length) {
      setRoles(roles.slice(0, clampedSize));
    }
  };

  const toggleRoleCovered = (id: string) => {
    setRoles(
      roles.map((r) =>
        r.id === id
          ? {
              ...r,
              isCovered: !r.isCovered,
              assignee: !r.isCovered ? (r.assignee === 'Unassigned' ? 'Me' : r.assignee) : 'Unassigned',
            }
          : r
      )
    );
  };

  const handleAddRole = () => {
    const newId = `role-${Date.now()}`;
    const newRole: CustomRole = {
      id: newId,
      title: `Custom Role ${roles.length + 1}`,
      assignee: 'Unassigned',
      skills: ['Custom Skill'],
      requiredFor: 'Key Module',
      isCovered: false,
    };
    setRoles([...roles, newRole]);
    setTeamSize(roles.length + 1);
  };

  const handleRemoveRole = (id: string) => {
    if (roles.length <= 1) return;
    const updated = roles.filter((r) => r.id !== id);
    setRoles(updated);
    setTeamSize(updated.length);
  };

  const handleUpdateRoleTitle = (id: string, newTitle: string) => {
    setRoles(roles.map((r) => (r.id === id ? { ...r, title: newTitle } : r)));
  };

  const handleUpdateRoleAssignee = (id: string, newAssignee: string) => {
    setRoles(
      roles.map((r) =>
        r.id === id
          ? {
              ...r,
              assignee: newAssignee,
              isCovered: newAssignee.trim() !== '' && newAssignee.toLowerCase() !== 'unassigned',
            }
          : r
      )
    );
  };

  const handleAddSkillToRole = (id: string, skill: string) => {
    if (!skill.trim()) return;
    setRoles(
      roles.map((r) => (r.id === id ? { ...r, skills: [...r.skills, skill.trim()] } : r))
    );
    setNewSkillInput('');
  };

  const handleRemoveSkillFromRole = (id: string, skillIdx: number) => {
    setRoles(
      roles.map((r) =>
        r.id === id ? { ...r, skills: r.skills.filter((_, idx) => idx !== skillIdx) } : r
      )
    );
  };

  const coveredCount = roles.filter((r) => r.isCovered).length;
  const totalRoles = roles.length;
  const readinessPercentage = Math.round((coveredCount / totalRoles) * 100);
  const missingRoles = roles.filter((r) => !r.isCovered);

  const cofounderPostText = `🚀 *Building ${projectTitle}* (Team of ${teamSize})

We are actively forming our hackathon squad! Target team size: ${teamSize} members.

💡 **Project Overview**: Building a high-impact platform leveraging ${techStack[0]?.chosen || 'Next.js'} and ${techStack[1]?.chosen || 'Gemini AI'}.

🎯 **Open Roles We are Recruiting**:
${missingRoles.length > 0 ? missingRoles.map((r) => `- **${r.title}** (${r.skills.join(', ')})`).join('\n') : '• All core roles currently covered! Looking for extra mentors or designers.'}

Interested in joining our hackathon team? DM me to view our full IdeaForge project blueprint!`;

  const handleCopyPost = () => {
    navigator.clipboard.writeText(cofounderPostText);
    setCopiedPost(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setCopiedPost(false), 2500);
  };

  return (
    <Card variant="blueprint" className="p-8 space-y-6 shadow-xl border-brand-ember/20">
      
      {/* Header with AI Suggestions & Customize Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-extrabold text-forge-white flex items-center gap-3">
              <Users className="w-5 h-5 text-brand-ember" />
              <span>Team Readiness & Skill-Gap Matrix</span>
            </h3>
            <Badge variant="quenched" size="sm" className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" /> AI Suggestions Active
            </Badge>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Check off skills you possess to calculate coverage, or click <span className="text-forge-white font-bold">Customize Team</span> to adjust team size & roles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
          <Button
            variant={isCustomizing ? 'primary' : 'quenched'}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            leftIcon={<Sliders className="w-3.5 h-3.5 text-brand-ember" />}
            className="text-xs font-mono font-bold"
          >
            {isCustomizing ? 'Done Customizing' : 'Customize Team Members'}
          </Button>

          <div className="text-right">
            <div className="text-2xl font-mono font-extrabold text-brand-ember">{readinessPercentage}%</div>
            <p className="text-[10px] font-mono text-quenched-steel-light uppercase tracking-wider">Readiness Index</p>
          </div>
        </div>
      </div>

      {/* Flexible Customization Controls Panel (shown when Customize Team Members is toggled ON) */}
      {isCustomizing && (
        <Card variant="solid" className="p-4 bg-forge-black/90 border-brand-ember/40 space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-brand-ember" />
              <div>
                <span className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider flex items-center gap-2">
                  <span>Custom Team Headcount:</span>
                  <span className="text-brand-ember font-extrabold text-sm bg-brand-ember/15 px-2 py-0.5 rounded border border-brand-ember/30">
                    {teamSize} {teamSize === 1 ? 'Member' : 'Members'}
                  </span>
                </span>
                <p className="text-[11px] font-sans text-zinc-400 pt-0.5">
                  Adjust headcount for Solo, Duo, Squad, or custom hackathon teams
                </p>
              </div>
            </div>

            {/* Quick Presets & Counter */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border border-quenched-steel/40 rounded-blueprint overflow-hidden bg-forge-surface">
                <button
                  onClick={() => handleTeamSizeChange(teamSize - 1)}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:bg-quenched-steel/20 transition disabled:opacity-30"
                  disabled={teamSize <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono font-bold text-brand-ember">{teamSize}</span>
                <button
                  onClick={() => handleTeamSizeChange(teamSize + 1)}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-zinc-300 hover:bg-quenched-steel/20 transition disabled:opacity-30"
                  disabled={teamSize >= 8}
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={teamSize === 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleTeamSizeChange(1)}
                  className="text-[11px] font-mono py-1 px-2.5"
                >
                  Solo (1)
                </Button>
                <Button
                  variant={teamSize === 2 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleTeamSizeChange(2)}
                  className="text-[11px] font-mono py-1 px-2.5"
                >
                  Duo (2)
                </Button>
                <Button
                  variant={teamSize === 4 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleTeamSizeChange(4)}
                  className="text-[11px] font-mono py-1 px-2.5"
                >
                  Squad (4)
                </Button>
              </div>

              <Button
                variant="quenched"
                size="sm"
                onClick={handleAddRole}
                leftIcon={<Plus className="w-3.5 h-3.5 text-brand-ember" />}
                className="text-xs font-mono text-brand-ember hover:bg-brand-ember/10 border-brand-ember/40"
              >
                Add Custom Role
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Role Coverage Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
          <span>Role Coverage ({coveredCount}/{totalRoles} Roles Filled)</span>
          <span className={readinessPercentage >= 75 ? 'text-emerald-400' : 'text-amber-molten'}>
            {readinessPercentage >= 75 ? 'Strong Team Coverage' : 'Recruiting / Skill-Gap Action Recommended'}
          </span>
        </div>
        <div className="w-full bg-forge-black h-3 rounded-full overflow-hidden border border-quenched-steel/30">
          <div
            className="bg-gradient-to-r from-brand-ember via-amber-molten to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${readinessPercentage}%` }}
          />
        </div>
      </div>

      {/* Roles Grid (AI Suggestions Default vs Full Customizer Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {roles.map((role, idx) => {
          return (
            <Card
              key={role.id}
              variant="solid"
              className={`p-5 space-y-3 transition-all border ${
                role.isCovered
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-forge-white'
                  : 'bg-forge-surface/60 border-quenched-steel/30 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-quenched-steel-light flex items-center gap-1.5">
                  <span>Slot #{idx + 1}</span>
                  {role.isCovered ? (
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <UserX className="w-3.5 h-3.5 text-brand-ember" />
                  )}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleRoleCovered(role.id)}
                    className="cursor-pointer"
                  >
                    <Badge variant={role.isCovered ? 'emerald' : 'ember'} size="sm">
                      {role.isCovered ? 'I Can Build This' : 'Need Co-Founder'}
                    </Badge>
                  </button>

                  {isCustomizing && (
                    <button
                      onClick={() => handleRemoveRole(role.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 transition"
                      title="Remove Role Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Role Title: Input when customizing, header text when in default suggestion view */}
              <div className="space-y-1">
                {isCustomizing ? (
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => handleUpdateRoleTitle(role.id, e.target.value)}
                    className="w-full bg-forge-black/80 border border-quenched-steel/30 rounded px-2.5 py-1 text-xs font-display font-extrabold text-forge-white focus:outline-none focus:border-brand-ember"
                    placeholder="Role Title (e.g. AI Engineer)"
                  />
                ) : (
                  <h4 className="text-xs font-display font-extrabold text-forge-white">{role.title}</h4>
                )}
              </div>

              {/* Component Rationale or Teammate Name */}
              {isCustomizing ? (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-400 text-[11px] shrink-0 font-bold">Assigned To:</span>
                  <input
                    type="text"
                    value={role.assignee}
                    onChange={(e) => handleUpdateRoleAssignee(role.id, e.target.value)}
                    className="w-full bg-forge-black/60 border border-quenched-steel/20 rounded px-2 py-0.5 text-[11px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                    placeholder="e.g. Me, Alex, Unassigned"
                  />
                </div>
              ) : (
                <div className="text-[11px] font-mono text-zinc-300">
                  <span className="font-bold text-brand-ember">For Component: </span>{role.requiredFor}
                </div>
              )}

              {/* Skills Tags */}
              <div className="space-y-1.5 pt-1 border-t border-quenched-steel/15">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {role.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-forge-black/80 border border-quenched-steel/30 text-[10px] font-mono text-zinc-200"
                    >
                      <span>{skill}</span>
                      {isCustomizing && (
                        <button
                          onClick={() => handleRemoveSkillFromRole(role.id, sIdx)}
                          className="text-zinc-500 hover:text-red-400 text-[11px] leading-none ml-0.5"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Skill Tag Input (shown when customizing) */}
                {isCustomizing && (
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="text"
                      placeholder="+ Add required skill (e.g. Rust, PyTorch)"
                      value={editingRoleId === role.id ? newSkillInput : ''}
                      onFocus={() => setEditingRoleId(role.id)}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillToRole(role.id, newSkillInput);
                        }
                      }}
                      className="w-full bg-forge-black/50 border border-quenched-steel/25 rounded px-2 py-0.5 text-[10px] font-mono text-zinc-300 focus:outline-none focus:border-brand-ember"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSkillToRole(role.id, newSkillInput)}
                      className="text-[10px] font-mono px-2 py-0.5 h-auto shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                )}
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
