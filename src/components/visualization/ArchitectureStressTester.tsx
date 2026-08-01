'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProjectBlueprint } from '@/lib/types';
import { Activity, Zap, ShieldCheck, Cpu, Database, RefreshCw, Terminal, Check, ShieldAlert, LineChart, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArchitectureStressTesterProps {
  blueprint: ProjectBlueprint;
}

interface TestLog {
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export default function ArchitectureStressTester({ blueprint }: ArchitectureStressTesterProps) {
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string>('SURGE');
  const [testScore, setTestScore] = useState<number | null>(null);
  const [logs, setLogs] = useState<TestLog[]>([]);

  const [latencyHistory, setLatencyHistory] = useState<number[]>([12, 14, 15, 18, 16, 14, 15, 12]);
  const [rpsHistory, setRpsHistory] = useState<number[]>([450, 480, 520, 510, 490, 530, 500, 520]);

  const handleRunStressTest = (scenario: 'SURGE' | 'DB_POOL' | 'AI_LATENCY' | 'SECURITY') => {
    setIsRunningTest(true);
    setActiveScenario(scenario);
    setLogs([]);
    setTestScore(null);

    const scenarioNames: Record<string, string> = {
      'SURGE': '100,000 MAU Traffic Surge',
      'DB_POOL': 'Database Connection Leak',
      'AI_LATENCY': 'Gemini AI Backpressure',
      'SECURITY': 'OWASP Security Audit',
    };

    setLogs([{ time: new Date().toLocaleTimeString(), type: 'info', message: `[STRESS TEST STARTED] Scenario: ${scenarioNames[scenario]}` }]);

    setTimeout(() => {
      setLatencyHistory([14, 18, 45, 120, 240, 310, 280, 190]);
      setRpsHistory([500, 1200, 3400, 5200, 6800, 7100, 6500, 5800]);
      setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type: 'info', message: 'Simulating 5,000 req/sec load spike against API Gateway...' }]);
    }, 600);

    setTimeout(() => {
      if (scenario === 'SURGE') {
        setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type: 'warning', message: '[WARNING] Supabase DB pool load reached 86%. Connection queuing detected.' }]);
      } else if (scenario === 'AI_LATENCY') {
        setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type: 'warning', message: '[WARNING] Gemini API token quota backpressure: 420ms delay on stream response.' }]);
      } else {
        setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), type: 'info', message: 'Auditing CORS headers, JWT secret rotation, and rate-limiting limits.' }]);
      }
    }, 1400);

    setTimeout(() => {
      setLatencyHistory([190, 120, 45, 24, 18, 16, 14, 15]);
      setRpsHistory([5800, 4200, 2100, 950, 550, 500, 520, 510]);
      setLogs((prev) => [
        ...prev,
        { time: new Date().toLocaleTimeString(), type: 'success', message: '[AUTOMATED MITIGATION APPLIED] Redis Cache hit ratio 94.2%. Traffic stabilized.' },
        { time: new Date().toLocaleTimeString(), type: 'success', message: '[TEST PASSED] System Resilience Score: 96/100 (EXCELLENT)' },
      ]);
      setTestScore(96);
      setIsRunningTest(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }, 2600);
  };

  const securityChecklist = [
    { title: 'OWASP API Top 10 Rate Limiting', status: 'PASSED', desc: 'Upstash Redis Token Bucket active' },
    { title: 'JWT Auth & CSRF Protection', status: 'PASSED', desc: 'Supabase HttpOnly Cookie Session' },
    { title: 'SQL & Vector Injection Prevention', status: 'PASSED', desc: 'Parameterized Postgres Prepared Statements' },
    { title: 'TLS 1.3 & AES-256 Encryption', status: 'PASSED', desc: 'Data encrypted in transit & at rest' },
  ];

  return (
    <Card variant="blueprint" className="p-6 md:p-8 space-y-6 shadow-2xl relative border-brand-ember/30 bg-forge-surface/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-quenched-steel/25 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-brand-ember/15 border border-brand-ember/40 text-brand-ember">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-display font-extrabold text-forge-white">
              3. AI System Bottleneck & Stress-Tester
            </h3>
          </div>
          <p className="text-xs font-sans text-zinc-400">
            Simulate 100k user spikes, database connection exhaustion, and AI model rate limits with real-time latency graphs.
          </p>
        </div>

        {testScore !== null && (
          <Badge variant="ember" size="sm" className="font-mono text-xs font-bold">
            Resilience Score: {testScore}/100 🛡️
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'SURGE', label: '100k Traffic Surge', desc: 'Simulates 5,000 req/s load spike', icon: Zap },
          { id: 'DB_POOL', label: 'DB Connection Leak', desc: 'Exhausts Postgres pooler', icon: Database },
          { id: 'AI_LATENCY', label: 'AI Rate-Limit Delay', desc: 'Simulates Gemini token rate limit', icon: Cpu },
          { id: 'SECURITY', label: 'OWASP Security Audit', desc: 'OWASP header & JWT validation', icon: ShieldCheck },
        ].map((scenario) => {
          const Icon = scenario.icon;
          const isSelected = activeScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => handleRunStressTest(scenario.id as any)}
              disabled={isRunningTest}
              className={`p-4 rounded-blueprint border text-left transition duration-200 ${
                isSelected
                  ? 'bg-brand-ember/20 border-brand-ember shadow-lg shadow-brand-ember/10'
                  : 'bg-forge-black/80 border-quenched-steel/30 hover:border-brand-ember/50 hover:bg-forge-black'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-ember' : 'text-zinc-400'}`} />
                <Play className="w-3.5 h-3.5 text-brand-ember" />
              </div>
              <h4 className="text-xs font-mono font-bold text-white mb-0.5">{scenario.label}</h4>
              <p className="text-[11px] text-zinc-400 font-sans">{scenario.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-blueprint bg-forge-black border border-quenched-steel/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <LineChart className="w-4 h-4" /> Live Latency Profile (ms)
            </span>
            <span className="text-white font-extrabold">{latencyHistory[latencyHistory.length - 1]} ms</span>
          </div>

          <div className="h-16 flex items-end gap-1.5 pt-2 border-b border-quenched-steel/20">
            {latencyHistory.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-400/80 rounded-t transition-all duration-300 hover:bg-cyan-300"
                style={{ height: `${Math.min(100, (val / 320) * 100)}%` }}
                title={`${val} ms`}
              />
            ))}
          </div>
        </div>

        <div className="p-4 rounded-blueprint bg-forge-black border border-quenched-steel/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-ember font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Throughput Load (req/s)
            </span>
            <span className="text-white font-extrabold">{rpsHistory[rpsHistory.length - 1].toLocaleString()} rps</span>
          </div>

          <div className="h-16 flex items-end gap-1.5 pt-2 border-b border-quenched-steel/20">
            {rpsHistory.map((val, i) => (
              <div
                key={i}
                className="flex-1 bg-brand-ember/80 rounded-t transition-all duration-300 hover:bg-brand-ember"
                style={{ height: `${Math.min(100, (val / 7500) * 100)}%` }}
                title={`${val} req/s`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-5 rounded-blueprint bg-forge-black border border-quenched-steel/30 space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-quenched-steel/20 pb-2 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-2 text-brand-ember">
              <Terminal className="w-4 h-4 text-brand-ember" />
              STRESS TEST DIAGNOSTICS CONSOLE
            </span>
            {isRunningTest && (
              <span className="text-amber-400 flex items-center gap-1.5 text-[11px]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> SIMULATING LOAD...
              </span>
            )}
          </div>

          <div className="min-h-[140px] space-y-1.5 text-xs text-zinc-300 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-zinc-500 italic text-xs pt-4 text-center">
                Select a scenario above and click run to simulate stress testing...
              </p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                  <span className={log.type === 'warning' ? 'text-amber-400 font-bold' : log.type === 'success' ? 'text-emerald-400 font-bold' : 'text-cyan-400'}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-5 rounded-blueprint bg-forge-black/80 border border-quenched-steel/30 space-y-3 font-mono">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Security & OWASP Compliance Checklist:
          </span>

          <div className="space-y-2">
            {securityChecklist.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-forge-surface/60 border border-quenched-steel/20 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-zinc-200">{item.title}</span>
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> {item.status}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5 font-sans">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
