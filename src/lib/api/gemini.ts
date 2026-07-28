import { GoogleGenerativeAI } from '@google/generative-ai';
import { DeepSearchState, IdeaInputData, GapNode, DevilsAdvocateQuestion } from '../types';
import { MOCK_DATASETS } from '../mock/mockData';
import { log } from '../logger';

export function generateDynamicFallbackState(input: IdeaInputData, papers: any[], repos: any[]): DeepSearchState {
  const ideaWords = input.idea.split(' ').filter(w => w.length > 3);
  const keyword = ideaWords[0] || 'Innovation';
  const secondKeyword = ideaWords[1] || 'Engine';

  const charSum = input.idea.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const noveltyScore = 78 + (charSum % 18);
  const feasibilityScore = 80 + ((charSum * 3) % 17);
  const technicalComplexity = 70 + ((charSum * 7) % 25);
  const marketImpact = 82 + ((charSum * 5) % 16);
  const executionSpeed = 75 + ((charSum * 2) % 20);

  const whiteSpaceTitle = `Zero-Overhead ${keyword} ${secondKeyword} Optimization Layer`;
  const whiteSpaceDescription = `Current solutions for "${input.idea}" are fragmented across generic tools. The uncrowded opportunity space lies in building an integrated, automated ${keyword} pipeline for ${input.targetUser || 'target users'}.`;

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
      question: `Why wouldn't ${input.targetUser || 'users'} simply stick with existing general tools instead of adopting your ${keyword} solution?`,
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
    webInsights: [
      {
        id: 'w1',
        title: `Industry Trends in ${keyword} & ${input.category || 'Innovation'}`,
        snippet: `Recent discussions highlight high demand for automated solutions addressing ${input.idea}`,
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
      problemStatement: `Targeted solution for ${input.targetUser || 'users'}: "${input.idea}"`,
      executiveSummary: `This project delivers a specialized ${keyword} platform tailored for ${input.targetUser || 'users'}. It addresses existing gaps by combining lightweight AST parsing with neural reasoning.`,
      uniqueValueProposition: `10x faster ${keyword} execution with zero setup overhead.`,
      architectureNodes: [
        { id: 'arch1', title: 'Input Trigger & Webhook', category: 'Frontend', tech: 'Next.js 14', description: 'Receives user requests and events.' },
        { id: 'arch2', title: `${keyword} Processing Engine`, category: 'Backend / LLM', tech: 'Node.js / WASM', description: 'Executes core transformation pipeline.' },
        { id: 'arch3', title: 'Gemini Flash Reasoning Layer', category: 'Backend / LLM', tech: 'Gemini API', description: 'Generates intelligent recommendations.' },
        { id: 'arch4', title: 'Storage & Vector Embeddings', category: 'Storage / Vector', tech: 'Supabase pgvector', description: 'Indexes solution representations.' },
        { id: 'arch5', title: 'Telegram Mentor & Alerts', category: 'Integration / Agent', tech: 'Telegram Bot API', description: 'Dispatches milestone updates to team.' },
      ],
      techStack: [
        { category: 'Frontend', chosen: 'Next.js 14 App Router', rationale: 'Server components & unified API routes.', alternatives: ['Vite', 'Remix'] },
        { category: 'LLM Engine', chosen: 'Gemini 1.5 Flash', rationale: 'Fast response times with 1M token context.', alternatives: ['Claude 3.5', 'GPT-4o'] },
        { category: 'Database', chosen: 'Supabase Postgres + pgvector', rationale: 'Single service for relational and vector data.', alternatives: ['Pinecone'] },
      ],
      milestones: [
        { week: 1, title: `Phase 1: ${keyword} Foundation`, duration: '3 Days', deliverables: ['Core pipeline setup', 'Input parser'], potentialRisk: 'Input parsing edge cases' },
        { week: 2, title: `Phase 2: ${secondKeyword} Integration`, duration: '4 Days', deliverables: ['LLM reasoning pipeline', 'Validation engine'], potentialRisk: 'LLM response latency' },
        { week: 3, title: 'Phase 3: Telegram Agent & Alerts', duration: '3 Days', deliverables: ['Telegram bot alerts', 'Dashboard UI'], potentialRisk: 'API rate limits' },
        { week: 4, title: 'Phase 4: Public Demo & Deployment', duration: '4 Days', deliverables: ['Vercel deployment', 'Documentation'], potentialRisk: 'Serverless timeout limits' },
      ],
      scaffoldFiles: [
        {
          filePath: 'README.md',
          description: 'Project documentation',
          content: `# ${keyword} ${secondKeyword}\n\n> Generated by IdeaForge AI Copilot for: ${input.idea}\n\n## Overview\nTarget User: ${input.targetUser || 'Developers'}\nCategory: ${input.category || 'Tech'}\n`,
        },
        {
          filePath: `src/core/${keyword.toLowerCase()}Engine.ts`,
          description: 'Core logic pipeline',
          content: `export async function process${keyword}(inputData: string) {\n  // Execute core logic for ${input.idea}\n  return { status: 'success', keyword: '${keyword}' };\n}\n`,
        },
      ],
      telegramMentorPrompt: `🤖 *IdeaForge AI Mentor*: Milestone 1 checklist for ${keyword} ${secondKeyword} is ready! Have you initialized your repository?`,
    },
    isLive: false,
  };
}

export async function runGeminiSynthesis(
  input: IdeaInputData,
  papers: any[],
  repos: any[],
  apiKey?: string
): Promise<DeepSearchState | null> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  log.info(`[DeepSearch Gemini] Request received for idea: "${input.idea}"`);
  if (!geminiKey) {
    log.info('[DeepSearch Gemini] No GEMINI_API_KEY present in process.env. Executing dynamic fallback path.');
    return null;
  }

  const modelsToTry = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];

  const prompt = `You are IdeaForge AI Copilot. Analyze the following project idea and return a JSON object with custom scores and blueprint for THIS SPECIFIC IDEA.
Idea: "${input.idea}"
Category: "${input.category || 'Tech'}"
Target User: "${input.targetUser || 'Developers'}"

Papers found: ${JSON.stringify(papers.slice(0, 3))}
Repos found: ${JSON.stringify(repos.slice(0, 3))}

Output JSON with exact fields:
{
  "clusters": [
    { "id": "c1", "name": "...", "color": "#f97316", "description": "...", "itemCount": 3, "dominantTrend": "..." },
    { "id": "c2", "name": "...", "color": "#3b82f6", "description": "...", "itemCount": 2, "dominantTrend": "..." }
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
    "milestones": [
      { "week": 1, "title": "...", "duration": "3 Days", "deliverables": ["..."], "potentialRisk": "..." }
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
      const fallbackDynamic = generateDynamicFallbackState(input, papers, repos);

      return {
        input,
        papers: papers.length > 0 ? papers : fallbackDynamic.papers,
        repos: repos.length > 0 ? repos : fallbackDynamic.repos,
        webInsights: parsed.webInsights || fallbackDynamic.webInsights,
        clusters: parsed.clusters || fallbackDynamic.clusters,
        metrics: parsed.metrics || fallbackDynamic.metrics,
        nodes: fallbackDynamic.nodes,
        devilsQuestions: fallbackDynamic.devilsQuestions,
        blueprint: parsed.blueprint || fallbackDynamic.blueprint,
        isLive: true,
      };
    } catch (err: any) {
      log.warn(`[DeepSearch Gemini] Model "${modelName}" error: ${err?.message || err}`);
    }
  }

  log.warn('[DeepSearch Gemini] All Gemini model names exhausted or key unauthorized. Executing dynamic fallback path.');
  return null;
}
