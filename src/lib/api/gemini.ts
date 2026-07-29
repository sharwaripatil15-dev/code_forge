import { GoogleGenerativeAI } from '@google/generative-ai';
import { DeepSearchState, IdeaInputData, GapNode, DevilsAdvocateQuestion, ArchitectureNode, TechStackRecommendation, ProjectMilestone, ScaffoldFile, RecommendedApiOrDataset, ProjectTimeline } from '../types';
import { MOCK_DATASETS } from '../mock/mockData';
import { log } from '../logger';

import { generateDynamicPatents } from './patents';

// 100% Dynamic Blueprint & Fallback Generator per idea input
export function generateDynamicFallbackState(input: IdeaInputData, papers: any[], repos: any[], patents?: any[]): DeepSearchState {
  const ideaWords = input.idea.split(' ').filter(w => w.length > 3);
  const keyword = ideaWords[0] || 'Core';
  const secondKeyword = ideaWords[1] || 'Engine';
  const thirdKeyword = ideaWords[2] || 'System';

  const charSum = input.idea.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patentList = patents && patents.length > 0 ? patents : generateDynamicPatents(input.idea, 2);
  const patentDeduction = patentList.length * 7;
  const repoDeduction = (repos ? Math.min(repos.length, 3) : 0) * 3;
  const baseNovelty = 96 - (charSum % 6);
  const noveltyScore = Math.max(42, Math.min(98, baseNovelty - patentDeduction - repoDeduction));

  const feasibilityScore = 80 + ((charSum * 3) % 17);
  const technicalComplexity = 70 + ((charSum * 7) % 25);
  const marketImpact = 82 + ((charSum * 5) % 16);
  const executionSpeed = 75 + ((charSum * 2) % 20);

  const whiteSpaceTitle = `Zero-Overhead ${keyword} ${secondKeyword} Optimization Engine`;
  const whiteSpaceDescription = `Existing solutions for "${input.idea}" are fragmented. The uncrowded opportunity space lies in an automated, low-latency ${keyword} pipeline engineered for ${input.targetUser || 'target users'}.`;

  // Domain-Aware Named APIs and Datasets Generation
  const lowerIdea = input.idea.toLowerCase();
  const isCodeDomain = lowerIdea.includes('code') || lowerIdea.includes('review') || lowerIdea.includes('ast') || lowerIdea.includes('git') || lowerIdea.includes('pr') || lowerIdea.includes('security');
  const isSolarDomain = lowerIdea.includes('solar') || lowerIdea.includes('grid') || lowerIdea.includes('energy') || lowerIdea.includes('iot') || lowerIdea.includes('microgrid') || lowerIdea.includes('clean');

  const apisAndDatasets: RecommendedApiOrDataset[] = isCodeDomain
    ? [
        {
          name: 'GitHub REST & GraphQL API v4',
          type: 'Third-Party API',
          description: 'Accesses pull request diffs, code commits, branch trees, and posts inline review comments directly on GitHub PR lines.',
          useCase: 'Primary input/output interface for fetching PR diffs and posting verified security suggestions.',
          accessUrl: 'https://docs.github.com/en/rest',
          licenseOrTier: 'Free (5,000 req/hr authenticated)',
        },
        {
          name: 'web-tree-sitter WASM Engine',
          type: 'SDK / Library',
          description: 'Client and server-side WebAssembly port of Tree-Sitter for incremental AST parsing across 40+ programming languages.',
          useCase: 'Extracts exact function boundaries and syntax nodes before sending prompt context to Gemini.',
          accessUrl: 'https://github.com/tree-sitter/tree-sitter',
          licenseOrTier: 'Open Source (MIT License)',
        },
        {
          name: 'SWE-Bench Public Benchmark Dataset',
          type: 'Public Dataset',
          description: 'Evaluation benchmark dataset containing 2,294 real software engineering problems extracted from GitHub issues and PRs.',
          useCase: 'Benchmarking patch accuracy and self-correction performance against existing AI coding agents.',
          accessUrl: 'https://www.swebench.com',
          licenseOrTier: 'Open Data (CC BY 4.0)',
        },
        {
          name: 'OSV.dev Vulnerability API',
          type: 'Third-Party API',
          description: 'Distributed open-source vulnerability database API providing precise package and commit vulnerability signatures.',
          useCase: 'Queries CVE advisories and zero-day signatures for identified project dependencies.',
          accessUrl: 'https://osv.dev',
          licenseOrTier: 'Free Public REST API',
        },
      ]
    : isSolarDomain
    ? [
        {
          name: 'NREL National Solar Radiation Database (NSRDB)',
          type: 'Public Dataset',
          description: 'Serially complete collection of hourly and half-hourly solar irradiance data across North America.',
          useCase: 'Provides predictive solar generation forecasting models based on geo-location telemetry.',
          accessUrl: 'https://developer.nrel.gov/docs/solar/nsrdb',
          licenseOrTier: 'Free API Key Access',
        },
        {
          name: 'OpenADR 2.0b Protocol Standard API',
          type: 'Protocol Standard',
          description: 'Open Automated Demand Response communication standard for automated grid balancing and load shed signals.',
          useCase: 'Standardized communication layer with regional utility companies for dynamic P2P energy dispatch.',
          accessUrl: 'https://www.openadr.org',
          licenseOrTier: 'Open Industry Standard',
        },
        {
          name: 'US EIA Grid Dispatch & Hourly Generation Dataset',
          type: 'Public Dataset',
          description: 'Real-time regional electricity demand, generation fuel mix, and wholesale pricing data across US ISOs.',
          useCase: 'Feeds market pricing rules for neighborhood solar energy trading algorithms.',
          accessUrl: 'https://www.eia.gov/developer',
          licenseOrTier: 'Free Public Data API',
        },
        {
          name: 'Modbus TCP / MQTT IoT Controller SDK',
          type: 'SDK / Library',
          description: 'Industrial IoT communications library for communicating with solar inverters, smart meters, and battery relays.',
          useCase: 'Telemetry ingestion and remote relay switching for microgrid battery storage nodes.',
          accessUrl: 'https://github.com/stephane/libmodbus',
          licenseOrTier: 'Open Source (LGPL 2.1)',
        },
      ]
    : [
        {
          name: `${keyword} Domain Open Data Index`,
          type: 'Public Dataset',
          description: `Structured repository of historical ${keyword} performance telemetry and benchmarks.`,
          useCase: `Training baseline models for ${input.targetUser || 'target users'}.`,
          accessUrl: 'https://data.gov',
          licenseOrTier: 'Open Data Commons',
        },
        {
          name: `${secondKeyword} Cloud Telemetry API`,
          type: 'Third-Party API',
          description: `Real-time monitoring and event streaming endpoint for ${keyword} operations.`,
          useCase: 'Ingesting operational event telemetry in real time.',
          accessUrl: 'https://developer.google.com',
          licenseOrTier: 'Free Developer Tier',
        },
        {
          name: 'Gemini 1.5 Flash Reasoning API',
          type: 'Third-Party API',
          description: 'Multimodal AI model with 1 million token context window for high-speed inference.',
          useCase: `Synthesizing ${keyword} decisions and generating structured outputs.`,
          accessUrl: 'https://ai.google.dev',
          licenseOrTier: 'Pay-As-You-Go / Free Tier',
        },
      ];

  const timeline: ProjectTimeline = {
    totalEstimatedWeeks: 4,
    totalEstimatedHours: isCodeDomain ? 64 : isSolarDomain ? 72 : 56,
    criticalPath: isCodeDomain
      ? 'WASM AST Chunker → Gemini Security Reasoning → Syntax Sanity Compiler Pass'
      : isSolarDomain
      ? 'Modbus IoT Telemetry → NREL Irradiance Forecast → OpenADR Dispatch Solver'
      : `${keyword} Engine → Gemini Reasoning → Webhook Alert Dispatch`,
    phases: [
      { phaseName: 'Phase 1: Ingestion & Core Engine', duration: 'Week 1 (16h)', goal: `Build core ${keyword} data parser & pipeline` },
      { phaseName: 'Phase 2: AI Reasoning & Verification', duration: 'Week 2 (18h)', goal: 'Implement Gemini synthesis & sanity guardrail' },
      { phaseName: 'Phase 3: Integration & Webhook Agents', duration: 'Week 3 (16h)', goal: 'Connect third-party APIs & real-time alerts' },
      { phaseName: 'Phase 4: Dashboard & Deployment', duration: 'Week 4 (14h)', goal: 'Deploy production service & export documentation' },
    ],
  };

  // Dynamic Architecture Nodes specific to the idea domain
  const architectureNodes: ArchitectureNode[] = isCodeDomain
    ? [
        { id: 'arch1', title: 'GitHub PR Webhook Ingestion', category: 'Frontend', tech: 'Octokit / Node.js', description: 'Receives pull_request events and fetches line diffs.' },
        { id: 'arch2', title: 'WASM AST Syntax Parser', category: 'Backend / LLM', tech: 'Tree-Sitter WASM', description: 'Extracts exact diff functions and import symbol graphs.' },
        { id: 'arch3', title: 'Gemini Security Reasoning Engine', category: 'Backend / LLM', tech: 'Gemini 1.5 Flash API', description: 'Generates zero-day vulnerability checks & fix code.' },
        { id: 'arch4', title: 'OSV Vulnerability Database Lookup', category: 'Storage / Vector', tech: 'OSV.dev REST API', description: 'Queries CVE advisories for identified dependencies.' },
        { id: 'arch5', title: 'GitHub PR Inline Comment Bot', category: 'Integration / Agent', tech: 'GitHub REST API', description: 'Posts verified review comments directly on code diff lines.' },
      ]
    : isSolarDomain
    ? [
        { id: 'arch1', title: 'IoT Microgrid Inverter Telemetry', category: 'Frontend', tech: 'Modbus / MQTT Gateway', description: 'Ingests real-time solar panel and battery state of charge.' },
        { id: 'arch2', title: 'NREL Solar Irradiance Forecaster', category: 'Backend / LLM', tech: 'NREL NSRDB API', description: 'Fetches 30-minute weather and solar irradiance forecasts.' },
        { id: 'arch3', title: 'Gemini Dispatch & Arbitrage Solver', category: 'Backend / LLM', tech: 'Gemini 1.5 Flash API', description: 'Calculates optimal battery charge/discharge trading schedules.' },
        { id: 'arch4', title: 'OpenADR Utility Load Balancing', category: 'Storage / Vector', tech: 'OpenADR 2.0b Protocol', description: 'Communicates demand response signals with local utility.' },
        { id: 'arch5', title: 'P2P Microgrid Ledger Webhook', category: 'Integration / Agent', tech: 'Supabase + Telegram Bot', description: 'Executes peer energy transfers and dispatches islanding alerts.' },
      ]
    : [
        { id: 'arch1', title: `${keyword} Client Interface`, category: 'Frontend', tech: 'Next.js 14 / TypeScript', description: `Interactive portal for ${input.targetUser || 'users'} to submit and monitor ${keyword} operations.` },
        { id: 'arch2', title: `${secondKeyword} Logic Pipeline`, category: 'Backend / LLM', tech: `Node.js / ${keyword} WASM`, description: `Extracts and transforms ${thirdKeyword} data structures before AI processing.` },
        { id: 'arch3', title: 'Gemini Neural Reasoning Engine', category: 'Backend / LLM', tech: 'Gemini 1.5 Flash API', description: `Generates intelligent ${keyword} recommendations and synthesis.` },
        { id: 'arch4', title: `${keyword} Vector & Cache Store`, category: 'Storage / Vector', tech: 'Supabase Postgres + pgvector', description: `Stores embeddings of past ${keyword} solutions to eliminate duplicate processing.` },
        { id: 'arch5', title: 'Telegram Alert & Agent Webhook', category: 'Integration / Agent', tech: 'Telegram Bot API', description: `Notifies developers on Telegram when critical ${secondKeyword} milestones trigger.` },
      ];

  // Dynamic Tech Stack specific to the idea
  const techStack: TechStackRecommendation[] = [
    {
      category: 'Frontend / UI Framework',
      chosen: 'Next.js 14 App Router + Tailwind CSS',
      rationale: `Server components provide instant page loads for ${input.targetUser || 'users'} searching ${keyword} insights.`,
      alternatives: ['Vite + React', 'Remix'],
    },
    {
      category: `${keyword} Processing Layer`,
      chosen: isCodeDomain ? 'web-tree-sitter (WASM)' : isSolarDomain ? 'Python FastAPI + PyVISA' : `${keyword}-WASM / Node.js Engine`,
      rationale: `Runs local deterministic ${secondKeyword} parsing before calling LLM APIs.`,
      alternatives: ['Python FastAPI', 'Rust Microservice'],
    },
    {
      category: 'LLM Reasoning Provider',
      chosen: 'Gemini 1.5 Flash API',
      rationale: 'Fast 1M token context window ideal for processing multi-source research inputs.',
      alternatives: ['Claude 3.5 Sonnet', 'GPT-4o-mini'],
    },
    {
      category: 'Database & Data Store',
      chosen: isSolarDomain ? 'InfluxDB Time-Series + Supabase Postgres' : 'Supabase Postgres + pgvector',
      rationale: `Unified database store tailored for ${isSolarDomain ? 'high-frequency IoT metrics' : `${keyword} embeddings`}.`,
      alternatives: ['Pinecone', 'ChromaDB'],
    },
  ];

  // Dynamic Milestones specific to the idea with Actionable Steps
  const milestones: ProjectMilestone[] = isCodeDomain
    ? [
        {
          week: 1,
          title: 'Phase 1: AST Extraction & Diff Parser Engine',
          duration: '3 Days (16 Hours)',
          actionableSteps: [
            'Task 1.1: Initialize web-tree-sitter WASM bindings inside Node/Edge runtime',
            'Task 1.2: Build Git diff chunker to extract modified AST nodes & scope',
            'Task 1.3: Unit test multi-file AST symbol parsing across TypeScript and Python',
          ],
          deliverables: ['GitHub Action trigger setup', 'WASM Tree-Sitter integration extracting diff context'],
          potentialRisk: 'Large multi-file diffs over-tokenizing request payload',
        },
        {
          week: 2,
          title: 'Phase 2: Gemini Security Prompting & Guardrail',
          duration: '4 Days (18 Hours)',
          actionableSteps: [
            'Task 2.1: Write system prompt steering Gemini 1.5 Flash for code security auditing',
            'Task 2.2: Integrate OSV.dev vulnerability lookup for dependency CVE checks',
            'Task 2.3: Build AST sanity validator to verify generated patches compile cleanly',
          ],
          deliverables: ['Gemini 1.5 Flash prompt pipeline', 'AST sanity checker verifying patch validity'],
          potentialRisk: 'LLM returning Markdown formatting surrounding code blocks',
        },
        {
          week: 3,
          title: 'Phase 3: Telegram Notification Bot & Live PR Comments',
          duration: '3 Days (15 Hours)',
          actionableSteps: [
            'Task 3.1: Register Telegram Bot API webhook listener for critical alert dispatch',
            'Task 3.2: Format markdown review comments with inline code diff suggestions',
            'Task 3.3: Handle GitHub pull_request webhook signatures & security headers',
          ],
          deliverables: ['Telegram bot webhook alert for high-risk vulnerabilities', 'GitHub inline comment poster'],
          potentialRisk: 'Telegram bot API rate limits on fast commits',
        },
        {
          week: 4,
          title: 'Phase 4: Dashboard, Benchmarking & Public Demo',
          duration: '4 Days (15 Hours)',
          actionableSteps: [
            'Task 4.1: Run benchmark accuracy evaluation on SWE-Bench sample subset',
            'Task 4.2: Deploy serverless webhook worker & dashboard to Vercel',
            'Task 4.3: Export complete documentation & starter GitHub repo',
          ],
          deliverables: ['IdeaForge workspace dashboard with analytics', 'Public GitHub repo demonstration'],
          potentialRisk: 'Vercel serverless function timeout on 30s limit',
        },
      ]
    : isSolarDomain
    ? [
        {
          week: 1,
          title: 'Phase 1: IoT Inverter Telemetry & Modbus Gateway',
          duration: '3 Days (18 Hours)',
          actionableSteps: [
            'Task 1.1: Build Modbus TCP telemetry receiver for solar inverter readings',
            'Task 1.2: Connect NREL NSRDB solar radiation API for 30-min irradiance forecast',
            'Task 1.3: Store battery state of charge (SoC) in InfluxDB time-series database',
          ],
          deliverables: ['IoT gateway receiver service', 'NREL solar irradiance connector'],
          potentialRisk: 'Micro-controller connectivity loss under intermittent Wi-Fi',
        },
        {
          week: 2,
          title: 'Phase 2: OpenADR Dispatch & Arbitrage Algorithm',
          duration: '4 Days (20 Hours)',
          actionableSteps: [
            'Task 2.1: Model peak energy tariff rules and US EIA grid dispatch pricing',
            'Task 2.2: Implement Gemini 1.5 Flash microgrid energy arbitrage solver',
            'Task 2.3: Test automated battery discharge signals during peak demand hours',
          ],
          deliverables: ['OpenADR 2.0b dispatch solver', 'Battery charge/discharge relay trigger'],
          potentialRisk: 'Excessive battery cycle degradation during rapid switching',
        },
        {
          week: 3,
          title: 'Phase 3: Peer-to-Peer Solar Trading Canvas',
          duration: '3 Days (18 Hours)',
          actionableSteps: [
            'Task 3.1: Build interactive neighborhood microgrid topology canvas',
            'Task 3.2: Create zero-knowledge P2P energy trade transaction ledger UI',
            'Task 3.3: Wire emergency islanding toggle for blackout resiliency',
          ],
          deliverables: ['P2P solar trading dashboard', 'Telegram microgrid alert bot'],
          potentialRisk: 'Grid interconnect safety disconnect delay',
        },
        {
          week: 4,
          title: 'Phase 4: Field Simulation & Production Release',
          duration: '4 Days (16 Hours)',
          actionableSteps: [
            'Task 4.1: Run hardware-in-the-loop (HIL) islanding simulation',
            'Task 4.2: Deploy telemetry API worker to Vercel / AWS IoT',
            'Task 4.3: Export field deployment documentation & setup guide',
          ],
          deliverables: ['Vercel deployment URL', 'Complete field deployment blueprint'],
          potentialRisk: 'High latency during real-time load shed events',
        },
      ]
    : [
        {
          week: 1,
          title: `Phase 1: ${keyword} Engine Foundations`,
          duration: '3 Days (14 Hours)',
          actionableSteps: [
            `Task 1.1: Define data schema for ${keyword} input processing`,
            `Task 1.2: Build local ${secondKeyword} transformation module`,
            `Task 1.3: Setup initial Next.js 14 workspace and UI primitives`,
          ],
          deliverables: [`${keyword} input schema setup`, `Local ${secondKeyword} parser module`],
          potentialRisk: `Large ${thirdKeyword} inputs exceeding token limits`,
        },
        {
          week: 2,
          title: `Phase 2: Gemini ${secondKeyword} Synthesis`,
          duration: '4 Days (16 Hours)',
          actionableSteps: [
            'Task 2.1: Write Gemini 1.5 Flash reasoning prompt templates',
            `Task 2.2: Implement ${keyword} sanity validator pass`,
            'Task 2.3: Build error handling and fallback state provider',
          ],
          deliverables: [`Gemini Flash reasoning prompts`, `${keyword} sanity validator`],
          potentialRisk: 'LLM response formatting inconsistencies',
        },
        {
          week: 3,
          title: 'Phase 3: Third-Party Webhooks & Alerts',
          duration: '3 Days (14 Hours)',
          actionableSteps: [
            'Task 3.1: Register Telegram Bot API webhook listener',
            'Task 3.2: Build interactive project HUB dashboard',
            'Task 3.3: Implement live real-time score updates',
          ],
          deliverables: ['Telegram bot alert triggers', 'Interactive project dashboard'],
          potentialRisk: 'Telegram bot rate limits during fast iterations',
        },
        {
          week: 4,
          title: 'Phase 4: Documentation & Vercel Deployment',
          duration: '4 Days (12 Hours)',
          actionableSteps: [
            'Task 4.1: Run end-to-end integration test suite',
            'Task 4.2: Deploy production build to Vercel',
            'Task 4.3: Export API specifications and starter GitHub repo',
          ],
          deliverables: ['Public Vercel deployment URL', 'Documentation & scaffold exporter'],
          potentialRisk: 'Serverless function execution timeout limits',
        },
      ];

  // Dynamic Scaffold Boilerplate Files including API Specs
  const scaffoldFiles: ScaffoldFile[] = [
    {
      filePath: 'README.md',
      description: 'Project documentation, architecture overview, and setup instructions',
      content: `# ${keyword} ${secondKeyword} — ${whiteSpaceTitle}\n\n> Generated by IdeaForge AI Copilot for: "${input.idea}"\n\n## Overview\n- **Category**: ${input.category || 'AI & Tech'}\n- **Target User**: ${input.targetUser || 'Developers & Researchers'}\n- **Novelty Rating**: ${noveltyScore}/100\n- **Total Estimated Build Time**: ${timeline.totalEstimatedHours} Hours (${timeline.totalEstimatedWeeks} Weeks)\n\n## Key Innovations\n1. Dynamic ${keyword} processing engine\n2. Automated ${secondKeyword} verification loop\n3. Tailored workflow for ${input.targetUser || 'users'}\n\n## Recommended APIs & Datasets\n${apisAndDatasets.map((a) => `- **${a.name}** (${a.type}): ${a.description} [${a.accessUrl}]`).join('\n')}\n\n## Development Timeline & Critical Path\n- **Critical Path**: ${timeline.criticalPath}\n${timeline.phases.map((p) => `- **${p.phaseName}** (${p.duration}): ${p.goal}`).join('\n')}\n\n## Quickstart\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
    },
    {
      filePath: 'docs/API_SPECIFICATION.md',
      description: 'Complete API endpoints & payload specifications',
      content: `# ${keyword} ${secondKeyword} API Specification\n\n## Base URL\n\`https://api.yourdomain.com/v1\`\n\n## Endpoints\n\n### 1. POST /api/${keyword.toLowerCase()}/process\nIngests and processes raw ${keyword} data.\n\n**Request Body:**\n\`\`\`json\n{\n  "input": "${input.idea.slice(0, 40)}",\n  "category": "${input.category || 'Tech'}"\n}\n\`\`\`\n\n**Response (200 OK):**\n\`\`\`json\n{\n  "success": true,\n  "status": "PROCESSED",\n  "noveltyScore": ${noveltyScore},\n  "timestamp": "${new Date().toISOString()}"\n}\n\`\`\`\n\n### 2. POST /api/telegram/webhook\nReceives live telemetry alerts and dispatches updates.\n`,
    },
    {
      filePath: `src/engine/${keyword.toLowerCase()}Parser.ts`,
      description: `${keyword} logic parser module`,
      content: `export async function parse${keyword}Data(inputData: string) {\n  console.log('Processing ${keyword} pipeline for: ${input.idea.slice(0, 30)}');\n  return {\n    status: 'success',\n    keyword: '${keyword}',\n    timestamp: new Date().toISOString(),\n  };\n}\n`,
    },
    {
      filePath: `src/app/api/${keyword.toLowerCase()}/route.ts`,
      description: `Next.js API route handling ${keyword} requests`,
      content: `import { NextResponse } from 'next/server';\nimport { parse${keyword}Data } from '@/engine/${keyword.toLowerCase()}Parser';\n\nexport async function POST(req: Request) {\n  const payload = await req.json();\n  const result = await parse${keyword}Data(payload.input || '');\n  return NextResponse.json({ success: true, result });\n}\n`,
    },
  ];

  const nodes: GapNode[] = [
    {
      id: 'n1',
      label: repos[0]?.name || `${keyword}-Core`,
      clusterId: 'c1',
      type: 'repo',
      description: repos[0]?.description || `Existing open-source project for ${keyword}`,
      starsOrCitations: repos[0] ? `★ ${repos[0].stars} stars` : '8.4k stars',
      url: repos[0]?.url || 'https://github.com',
    },
    {
      id: 'n2',
      label: papers[0]?.title.slice(0, 20) + '...' || `${keyword} Paper`,
      clusterId: 'c1',
      type: 'paper',
      description: papers[0]?.summary || `Academic research on ${keyword}`,
      starsOrCitations: papers[0] ? `${papers[0].citationsCount} citations` : '110 citations',
      url: papers[0]?.url || 'https://arxiv.org',
    },
    {
      id: 'n3',
      label: repos[1]?.name || `${secondKeyword}-Lib`,
      clusterId: 'c2',
      type: 'repo',
      description: repos[1]?.description || `Library for ${secondKeyword}`,
      starsOrCitations: repos[1] ? `★ ${repos[1].stars} stars` : '4.2k stars',
      url: repos[1]?.url || 'https://github.com',
    },
    {
      id: 'n4',
      label: papers[1]?.title.slice(0, 20) + '...' || `${secondKeyword} Study`,
      clusterId: 'c2',
      type: 'paper',
      description: papers[1]?.summary || `Benchmark study on ${secondKeyword}`,
      starsOrCitations: papers[1] ? `${papers[1].citationsCount} citations` : '76 citations',
      url: papers[1]?.url || 'https://arxiv.org',
    },
    {
      id: 'opp',
      label: `YOUR OPPORTUNITY SPACE: ${whiteSpaceTitle}`,
      clusterId: 'opportunity',
      type: 'opportunity',
      description: whiteSpaceDescription,
    },
  ];

  const devilsQuestions: DevilsAdvocateQuestion[] = [
    {
      id: 'dq1',
      question: `Why wouldn't ${input.targetUser || 'users'} simply stick with existing tools instead of adopting your ${keyword} solution?`,
      focusArea: 'Existing Overlap',
      context: `Market competition for ${input.category || 'tech tools'} is established.`,
      suggestedAnswer: `Existing general tools lack specialized ${keyword} optimization. Our solution delivers 10x faster execution tailored specifically for ${input.targetUser || 'users'}.`,
      userAnswer: '',
      aiEvaluation: 'Strong positioning. Focusing on specialized performance creates a defensible moat.',
      impactOnScore: +5,
    },
    {
      id: 'dq2',
      question: `What is the primary technical bottleneck when scaling "${input.idea.slice(0, 40)}..." in production?`,
      focusArea: 'Feasibility Risk',
      context: 'High concurrency or complex data transformation risk.',
      suggestedAnswer: `We mitigate latency by caching intermediate ${keyword} states and using asynchronous processing pipelines.`,
      userAnswer: '',
      aiEvaluation: 'Technically sound architecture design.',
      impactOnScore: +4,
    },
    {
      id: 'dq3',
      question: `How do you handle edge case failures when ${keyword} inputs are malformed or degraded?`,
      focusArea: 'Scalability',
      context: 'Production error rate and system resilience.',
      suggestedAnswer: 'All inputs pass through a strict validation schema with graceful fallback defaults before hitting core logic.',
      userAnswer: '',
      aiEvaluation: 'Valid defensive design principle.',
      impactOnScore: +6,
    },
  ];

  return {
    input,
    papers: papers.length > 0 ? papers : MOCK_DATASETS.default.papers,
    repos: repos.length > 0 ? repos : MOCK_DATASETS.default.repos,
    patents: patentList,
    webInsights: [
      {
        id: 'w1',
        title: `Industry Trends in ${keyword} & ${input.category || 'Innovation'}`,
        snippet: `Recent market analysis highlights strong demand for automated ${keyword} solutions addressing: ${input.idea}`,
        url: 'https://news.ycombinator.com',
        source: 'Industry Report',
        approachFamily: `${keyword} Systems`,
      },
    ],
    clusters: [
      {
        id: 'c1',
        name: `${keyword} Architectures`,
        color: '#f97316',
        description: `Core systems focused on ${keyword} processing.`,
        itemCount: 3,
        dominantTrend: 'High demand for low latency.',
      },
      {
        id: 'c2',
        name: `${secondKeyword} Frameworks`,
        color: '#3b82f6',
        description: `Supporting libraries and evaluation tools.`,
        itemCount: 2,
        dominantTrend: 'Rapid adoption across open source.',
      },
    ],
    metrics: {
      noveltyScore,
      feasibilityScore,
      technicalComplexity,
      marketImpact,
      executionSpeed,
      whiteSpaceTitle,
      whiteSpaceDescription,
      keyInnovations: [
        `Dynamic ${keyword} processing engine`,
        `Automated ${secondKeyword} verification loop`,
        `Tailored workflow for ${input.targetUser || 'target users'}`,
      ],
    },
    nodes,
    devilsQuestions,
    blueprint: {
      title: `IdeaForge Blueprint: ${keyword} ${secondKeyword}`,
      tagline: `Implementation Blueprint for ${input.idea.slice(0, 45)}`,
      problemStatement: `Engineering challenge for ${input.targetUser || 'users'}: "${input.idea}"`,
      executiveSummary: `This project delivers a specialized ${keyword} platform tailored for ${input.targetUser || 'users'}. It addresses existing gaps by combining lightweight AST parsing with neural reasoning.`,
      uniqueValueProposition: `10x faster ${keyword} execution with zero setup overhead.`,
      architectureNodes,
      techStack,
      apisAndDatasets,
      timeline,
      milestones,
      scaffoldFiles,
      telegramMentorPrompt: `🤖 *IdeaForge AI Mentor*: Milestone 1 checklist for ${keyword} ${secondKeyword} is ready! Have you initialized your repository?`,
    },
    isLive: false,
  };
}

export async function runGeminiSynthesis(
  input: IdeaInputData,
  papers: any[],
  repos: any[],
  patents: any[],
  apiKey?: string
): Promise<DeepSearchState | null> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  log.info(`[DeepSearch Gemini] Request received for idea: "${input.idea}"`);
  if (!geminiKey) {
    log.info('[DeepSearch Gemini] No GEMINI_API_KEY present in process.env. Executing dynamic fallback path.');
    return null;
  }

  const modelsToTry = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];

  const prompt = `You are IdeaForge AI Copilot. Analyze the following project idea and return a JSON object with custom scores, architecture nodes, tech stack, apisAndDatasets, timeline, milestones with actionableSteps, and scaffold files tailored SPECIFICALLY TO THIS IDEA.
Idea: "${input.idea}"
Category: "${input.category || 'Tech'}"
Target User: "${input.targetUser || 'Developers'}"

Papers found: ${JSON.stringify(papers.slice(0, 3))}
Repos found: ${JSON.stringify(repos.slice(0, 3))}
Patents found: ${JSON.stringify(patents.slice(0, 3))}

Output JSON with exact fields:
{
  "clusters": [
    { "id": "c1", "name": "...", "color": "#f97316", "description": "...", "itemCount": 3, "dominantTrend": "..." }
  ],
  "metrics": {
    "noveltyScore": 88,
    "feasibilityScore": 92,
    "technicalComplexity": 75,
    "marketImpact": 90,
    "executionSpeed": 85,
    "whiteSpaceTitle": "...",
    "whiteSpaceDescription": "...",
    "keyInnovations": ["...", "...", "..."]
  },
  "webInsights": [
    { "id": "w1", "title": "...", "snippet": "...", "url": "https://google.com", "source": "Web Intelligence", "approachFamily": "..." }
  ],
  "blueprint": {
    "title": "IdeaForge Blueprint: ...",
    "tagline": "...",
    "problemStatement": "...",
    "executiveSummary": "...",
    "uniqueValueProposition": "...",
    "architectureNodes": [
      { "id": "arch1", "title": "...", "category": "Frontend", "tech": "...", "description": "..." }
    ],
    "techStack": [
      { "category": "Frontend", "chosen": "Next.js 14", "rationale": "...", "alternatives": ["Vite"] }
    ],
    "apisAndDatasets": [
      { "name": "...", "type": "Third-Party API", "description": "...", "useCase": "...", "accessUrl": "...", "licenseOrTier": "..." }
    ],
    "timeline": {
      "totalEstimatedWeeks": 4,
      "totalEstimatedHours": 60,
      "criticalPath": "...",
      "phases": [ { "phaseName": "...", "duration": "...", "goal": "..." } ]
    },
    "milestones": [
      { "week": 1, "title": "...", "duration": "...", "actionableSteps": ["Task 1.1: ...", "Task 1.2: ..."], "deliverables": ["..."], "potentialRisk": "..." }
    ],
    "scaffoldFiles": [
      { "filePath": "README.md", "description": "...", "content": "..." }
    ],
    "telegramMentorPrompt": "🤖 IdeaForge Mentor: ..."
  }
}`;

  for (const modelName of modelsToTry) {
    try {
      log.info(`[DeepSearch Gemini] Trying model "${modelName}" with key (${geminiKey.slice(0, 6)}...)...`);
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      log.info(`[DeepSearch Gemini] SUCCESS with model "${modelName}" (${responseText.length} chars)`);

      const cleanedJson = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanedJson);
      const fallbackDynamic = generateDynamicFallbackState(input, papers, repos, patents);

      return {
        input,
        papers: papers.length > 0 ? papers : fallbackDynamic.papers,
        repos: repos.length > 0 ? repos : fallbackDynamic.repos,
        patents: patents.length > 0 ? patents : fallbackDynamic.patents,
        webInsights: parsed.webInsights || fallbackDynamic.webInsights,
        clusters: parsed.clusters || fallbackDynamic.clusters,
        metrics: parsed.metrics || fallbackDynamic.metrics,
        nodes: fallbackDynamic.nodes,
        devilsQuestions: fallbackDynamic.devilsQuestions,
        blueprint: {
          ...fallbackDynamic.blueprint,
          ...(parsed.blueprint || {}),
          apisAndDatasets: parsed.blueprint?.apisAndDatasets || fallbackDynamic.blueprint.apisAndDatasets,
          timeline: parsed.blueprint?.timeline || fallbackDynamic.blueprint.timeline,
          milestones: parsed.blueprint?.milestones || fallbackDynamic.blueprint.milestones,
        },
        isLive: true,
      };
    } catch (err: any) {
      log.warn(`[DeepSearch Gemini] Model "${modelName}" error: ${err?.message || err}`);
    }
  }

  log.warn('[DeepSearch Gemini] All Gemini model names exhausted or key unauthorized. Executing dynamic fallback path.');
  return null;
}
