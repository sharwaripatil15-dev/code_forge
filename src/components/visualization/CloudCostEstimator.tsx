'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProjectBlueprint } from '@/lib/types';
import { DollarSign, Users, Server, Database, Cpu, HardDrive, Sparkles, PiggyBank } from 'lucide-react';

interface CloudCostEstimatorProps {
  blueprint: ProjectBlueprint;
}

export default function CloudCostEstimator({ blueprint }: CloudCostEstimatorProps) {
  const [mau, setMau] = useState<number>(10000);
  const [aiQueriesPerUser] = useState<number>(15);
  const [pricingPerUser] = useState<number>(9);
  const [infraModel, setInfraModel] = useState<'serverless' | 'dedicated'>('serverless');

  const rawHostingCost = Math.max(0, Math.ceil((mau / 1000) * 0.45));
  const rawDatabaseCost = Math.max(25, Math.ceil(25 + (mau > 25000 ? (mau - 25000) * 0.0012 : 0)));
  const rawAiTokenCost = Math.ceil((mau * aiQueriesPerUser * 1500 * 0.0000005));
  const rawCacheCost = Math.max(0, Math.ceil((mau / 5000) * 2.5));

  const multiplier = infraModel === 'dedicated' ? 0.68 : 1.0;
  const baseBaseline = infraModel === 'dedicated' ? 120 : 0;

  const hostingCost = Math.ceil(rawHostingCost * multiplier) + (infraModel === 'dedicated' ? 40 : 0);
  const databaseCost = Math.ceil(rawDatabaseCost * multiplier) + (infraModel === 'dedicated' ? 50 : 0);
  const aiTokenCost = rawAiTokenCost;
  const cacheStorageCost = Math.ceil(rawCacheCost * multiplier);

  const totalMonthlyCost = hostingCost + databaseCost + aiTokenCost + cacheStorageCost + baseBaseline;
  const annualCost = totalMonthlyCost * 12;

  const paidUsers = Math.ceil(mau * 0.04);
  const grossMonthlyRevenue = paidUsers * pricingPerUser;
  const netMonthlyProfit = grossMonthlyRevenue - totalMonthlyCost;
  const profitMarginPercent = grossMonthlyRevenue > 0 ? Math.round((netMonthlyProfit / grossMonthlyRevenue) * 100) : 0;

  const presets = [
    { label: '🚀 MVP (1k MAU)', val: 1000 },
    { label: '📈 Seed (25k MAU)', val: 25000 },
    { label: '🔥 Growth (100k MAU)', val: 100000 },
    { label: '🦄 Scale (500k MAU)', val: 500000 },
  ];

  const costBreakdown = [
    { name: 'AI Reasoning (Gemini API)', cost: aiTokenCost, color: 'bg-brand-ember', icon: Cpu, desc: `${(mau * aiQueriesPerUser).toLocaleString()} queries/mo` },
    { name: 'Database (Supabase Postgres)', cost: databaseCost, color: 'bg-emerald-500', icon: Database, desc: 'Storage & Pooler connections' },
    { name: 'Edge Hosting (Vercel / Cloudflare)', cost: hostingCost, color: 'bg-cyan-500', icon: Server, desc: 'Serverless execution & static CDN' },
    { name: 'Caching & Memory (Redis)', cost: cacheStorageCost, color: 'bg-amber-500', icon: HardDrive, desc: 'Fast cache response layer' },
  ];

  return (
    <Card variant="blueprint" className="p-6 md:p-8 space-y-6 shadow-2xl relative border-quenched-steel/30 bg-forge-surface/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/25 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-extrabold text-forge-white">
              2. Cloud Infrastructure & Unit Economics Calculator
            </h3>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Real-time monthly cloud budget projection, serverless vs dedicated architecture comparison, and SaaS profit margin analytics.
          </p>
        </div>

        <div className="flex items-center bg-forge-black p-1 rounded-lg border border-quenched-steel/30 text-xs font-mono">
          <button
            onClick={() => setInfraModel('serverless')}
            className={`px-3 py-1.5 rounded-md transition ${infraModel === 'serverless' ? 'bg-brand-ember text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Serverless Edge
          </button>
          <button
            onClick={() => setInfraModel('dedicated')}
            className={`px-3 py-1.5 rounded-md transition ${infraModel === 'dedicated' ? 'bg-brand-ember text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            AWS Dedicated
          </button>
        </div>
      </div>

      <div className="p-5 rounded-blueprint bg-forge-black/80 border border-quenched-steel/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wider">
            <Users className="w-4 h-4 text-cyan-400" />
            Scale Presets & Monthly Active Users:
          </label>

          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map((p) => (
              <button
                key={p.val}
                onClick={() => setMau(p.val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                  mau === p.val
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-forge-surface/60 text-zinc-400 hover:text-white border border-quenched-steel/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="range"
          min="500"
          max="500000"
          step="500"
          value={mau}
          onChange={(e) => setMau(Number(e.target.value))}
          className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-ember"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-blueprint bg-gradient-to-br from-forge-black to-forge-surface border border-brand-ember/40 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-brand-ember uppercase font-bold tracking-widest block mb-1">
              Estimated Monthly Cloud Spend
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-white font-mono">
                ${totalMonthlyCost.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-zinc-400">/ month</span>
            </div>
            <div className="text-xs font-mono text-zinc-400 mt-2">
              Annual Cloud Spend: <span className="text-emerald-400 font-bold">${annualCost.toLocaleString()} / year</span>
            </div>
          </div>

          <div className="pt-4 border-t border-quenched-steel/30 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <PiggyBank className="w-3.5 h-3.5" /> Gross Revenue (4% Conv):
              </span>
              <span className="text-white font-extrabold">${grossMonthlyRevenue.toLocaleString()}/mo</span>
            </div>

            <div className="flex items-center justify-between text-zinc-300">
              <span>Net Monthly Profit:</span>
              <span className={`font-bold ${netMonthlyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${netMonthlyProfit.toLocaleString()}/mo ({profitMarginPercent}%)
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span>Itemized Resource Allocation ({infraModel.toUpperCase()})</span>
            <span className="text-cyan-400 font-normal">{(totalMonthlyCost / (mau || 1)).toFixed(4)}$ per MAU</span>
          </h4>

          <div className="space-y-3">
            {costBreakdown.map((item, idx) => {
              const Icon = item.icon;
              const percentage = Math.round((item.cost / (totalMonthlyCost || 1)) * 100);

              return (
                <div key={idx} className="p-3.5 rounded-blueprint bg-forge-black/60 border border-quenched-steel/25 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-zinc-200 font-bold">
                      <Icon className="w-4 h-4 text-brand-ember" />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 font-normal">{item.desc}</span>
                      <span className="text-white font-extrabold">${item.cost.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${Math.max(4, percentage)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-blueprint bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs font-sans text-zinc-300 space-y-1">
          <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            AI Infrastructure Optimization Advice
          </span>
          <p className="leading-relaxed">
            By enabling **Gemini prompt caching** and **PgBouncer connection pooling** on Supabase, you can trim serverless execution overhead by up to **35%**, saving **${Math.ceil(totalMonthlyCost * 0.35).toLocaleString()}/month**.
          </p>
        </div>
      </div>
    </Card>
  );
}
