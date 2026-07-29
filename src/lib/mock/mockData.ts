import { DeepSearchState } from '../types';

export const SAMPLE_IDEAS = [
  {
    title: 'Autonomous AI Code Reviewer & Security Guardrail',
    description: 'An AI agent that inspects pull requests, runs AST analysis, detects security zero-days, and generates verified patch suggestions directly in GitHub PR comments.',
    category: 'AI & Developer Tools',
    targetUser: 'Developers & Open-Source Maintainers'
  },
  {
    title: 'Biotech Health Twin with Multi-Modal Omics',
    description: 'A personal digital twin model predicting metabolic response to nutrition and medication using wearable sensor streams and gut microbiome sequencing.',
    category: 'Healthcare & BioTech',
    targetUser: 'Clinical Researchers & Chronic Patients'
  },
  {
    title: 'Decentralized Micro-Grid Energy Router',
    description: 'Smart P2P solar energy router using IoT micro-controllers and zero-knowledge proofs to trade surplus renewable energy across neighborhood micro-grids.',
    category: 'CleanTech & IoT',
    targetUser: 'Solar Homeowners & Local Energy Cooperatives'
  }
];

export const MOCK_DATASETS: Record<string, DeepSearchState> = {
  default: {
    input: {
      idea: 'Autonomous AI Code Reviewer & Security Guardrail',
      category: 'AI & Developer Tools',
      targetUser: 'Developers & Open-Source Maintainers'
    },
    isLive: false,
    papers: [
      {
        id: 'p1',
        title: 'LMFuzz: Automated Security Vulnerability Discovery via Large Language Model Steering',
        authors: ['Zhang et al.', 'Stanford AI Lab'],
        summary: 'Presents a method for guiding LLMs to construct adversarial unit tests for detecting memory safety and injection flaws in dynamic runtime environments.',
        url: 'https://arxiv.org/abs/2403.11920',
        publishedDate: '2024-03-15',
        citationsCount: 142,
        relevanceScore: 94,
        approachFamily: 'LLM & Static AST Synthesis'
      },
      {
        id: 'p2',
        title: 'Self-Correction in Agentic Software Engineering Workflows: A Benchmarking Study',
        authors: ['Gupta & Chen', 'MIT CSAIL'],
        summary: 'Evaluates iterative self-healing agents on SWE-bench, highlighting failures in multi-file context tracking and long-horizon dependency graphs.',
        url: 'https://arxiv.org/abs/2405.08812',
        publishedDate: '2024-05-10',
        citationsCount: 88,
        relevanceScore: 89,
        approachFamily: 'Agentic Feedback Loops'
      },
      {
        id: 'p3',
        title: 'Zero-Knowledge Verification of Machine Learning Output Integrity in CI/CD',
        authors: ['Kowalski et al.', 'ETH Zurich'],
        summary: 'Proves LLM execution deterministic safety invariants before merging code into critical embedded systems production branches.',
        url: 'https://arxiv.org/abs/2401.04561',
        publishedDate: '2024-01-22',
        citationsCount: 64,
        relevanceScore: 82,
        approachFamily: 'Formal Methods & Verification'
      }
    ],
    repos: [
      {
        id: 'r1',
        name: 'sweepai/sweep',
        fullName: 'sweepai/sweep',
        description: 'Sweep is an AI junior developer that transforms bug reports and feature requests into pull requests.',
        stars: 12400,
        url: 'https://github.com/sweepai/sweep',
        primaryLanguage: 'Python',
        approachFamily: 'Agentic Feedback Loops'
      },
      {
        id: 'r2',
        name: 'CodiumAI/pr-agent',
        fullName: 'CodiumAI/pr-agent',
        description: 'Automated AI-based pull request review and code analysis tool for GitHub, GitLab and BitBucket.',
        stars: 5800,
        url: 'https://github.com/CodiumAI/pr-agent',
        primaryLanguage: 'Python',
        approachFamily: 'LLM & Static AST Synthesis'
      },
      {
        id: 'r3',
        name: 'semgrep/semgrep',
        fullName: 'semgrep/semgrep',
        description: 'Lightweight static analysis engine for searching code, finding bugs, and enforcing code standards.',
        stars: 10200,
        url: 'https://github.com/semgrep/semgrep',
        primaryLanguage: 'OCaml',
        approachFamily: 'Traditional Static Analysis'
      }
    ],
    patents: [
      {
        id: 'pat-US11853401B2',
        patentNumber: 'US11853401B2',
        title: 'System and Method for Automated Code Safety Invariant Proving via Multi-Modal Parsing',
        abstract: 'Computer-implemented system for analyzing pull request diffs and evaluating security AST Invariants prior to code merge into production repositories.',
        assignee: 'Security Automation Technologies Inc.',
        url: 'https://patents.google.com/patent/US11853401B2/en',
        publicationDate: '2023-12-26',
        relevanceScore: 94
      },
      {
        id: 'pat-EP3982104A1',
        patentNumber: 'EP3982104A1',
        title: 'Deterministic LLM Patch Verification Engine for Automated Pull Request Review',
        abstract: 'Methods and apparatus for running WASM Tree-Sitter AST validation on machine-generated code patches before committing changes to CI/CD pipelines.',
        assignee: 'European Software Research AG',
        url: 'https://patents.google.com/patent/EP3982104A1/en',
        publicationDate: '2024-01-18',
        relevanceScore: 89
      }
    ],
    webInsights: [
      {
        id: 'w1',
        title: 'HackerNews Discussion: Why AI Code Review Tools Suffer High False-Positive Rates',
        snippet: 'Developers complain that existing bots post generic style comments rather than discovering architectural edge cases or state mutation bugs.',
        url: 'https://news.ycombinator.com/item?id=39120482',
        source: 'HackerNews',
        approachFamily: 'LLM & Static AST Synthesis'
      },
      {
        id: 'w2',
        title: 'Gartner 2024 Report on DevSecOps AI Integration Risks',
        snippet: '78% of enterprise engineering teams demand deterministic AST validation alongside neural LLM suggestions to prevent hallucinations.',
        url: 'https://gartner.com/research/devsecops-2024',
        source: 'Gartner Research',
        approachFamily: 'Formal Methods & Verification'
      }
    ],
    clusters: [
      {
        id: 'c1',
        name: 'LLM & Static AST Synthesis',
        color: '#f97316', // Orange
        description: 'Combines LLMs with abstract syntax trees for local patch recommendations.',
        itemCount: 4,
        dominantTrend: 'High context window overhead, moderate false positive rate.'
      },
      {
        id: 'c2',
        name: 'Agentic Feedback Loops',
        color: '#3b82f6', // Blue
        description: 'Multi-agent systems executing test suites in sandbox containers.',
        itemCount: 3,
        dominantTrend: 'Slow execution time per PR (3-5 minutes), high API cost.'
      },
      {
        id: 'c3',
        name: 'Formal Methods & Verification',
        color: '#10b981', // Emerald
        description: 'Deterministic rules and mathematical proofs for code safety invariants.',
        itemCount: 2,
        dominantTrend: 'Extremely safe, but rigid and hard to configure for general frameworks.'
      }
    ],
    metrics: {
      noveltyScore: 88,
      feasibilityScore: 92,
      technicalComplexity: 78,
      marketImpact: 95,
      executionSpeed: 85,
      whiteSpaceTitle: 'Deterministic Hybrid AST-LLM Guardrail with Instant In-Memory AST Proofs',
      whiteSpaceDescription: 'Current tools either generate noisy LLM comments or run rigid static linters. The unexplored white space is a hybrid engine that uses lightweight local WASM AST trees to constrain LLM hallucinations BEFORE rendering PR comments, reducing false positives by 90%.',
      keyInnovations: [
        'WASM-compiled Tree-Sitter AST parser running inside GitHub Action runner',
        'Bidirectional feedback loop verifying patch syntax before post',
        'Sub-15 second end-to-end execution budget'
      ]
    },
    nodes: [
      { id: 'n1', label: 'Sweep AI', clusterId: 'c2', type: 'repo', description: 'AI Junior Dev for PR generation', starsOrCitations: '12.4k stars', url: 'https://github.com/sweepai/sweep' },
      { id: 'n2', label: 'PR-Agent', clusterId: 'c1', type: 'repo', description: 'Automated PR commentary', starsOrCitations: '5.8k stars', url: 'https://github.com/CodiumAI/pr-agent' },
      { id: 'n3', label: 'LMFuzz Paper', clusterId: 'c1', type: 'paper', description: 'LLM vulnerability discovery paper', starsOrCitations: '142 citations', url: 'https://arxiv.org/abs/2403.11920' },
      { id: 'n4', label: 'Semgrep Engine', clusterId: 'c3', type: 'repo', description: 'Static AST linter', starsOrCitations: '10.2k stars', url: 'https://github.com/semgrep/semgrep' },
      { id: 'n5', label: 'SWE-bench Agents', clusterId: 'c2', type: 'paper', description: 'Self-correction benchmarks', starsOrCitations: '88 citations', url: 'https://arxiv.org/abs/2405.08812' },
      { id: 'n6', label: 'ZK-Proof CI/CD', clusterId: 'c3', type: 'paper', description: 'Formal verification paper', starsOrCitations: '64 citations', url: 'https://arxiv.org/abs/2401.04561' },
      // Opportunity Node
      { id: 'opp', label: 'YOUR OPPORTUNITY SPACE: Hybrid WASM-AST Guardrail Engine', clusterId: 'opportunity', type: 'opportunity', description: 'Unexplored region: Zero-hallucination deterministic AST constraint wrapper for instant PR patch security.' }
    ],
    devilsQuestions: [
      {
        id: 'dq1',
        question: 'Existing tools like Codium PR-Agent and Sweep AI already post PR reviews. Why won\'t developers just use them?',
        focusArea: 'Existing Overlap',
        context: 'Market saturation in AI coding assistants is high.',
        suggestedAnswer: 'Existing tools suffer from a 40%+ false-positive rate because they lack AST validation. Our solution uses WASM Tree-Sitter to reject halluciated suggestions before posting.',
        userAnswer: '',
        aiEvaluation: 'Strong differentiation. Focusing on zero false-positives via AST grounding solves developer notification fatigue.',
        impactOnScore: +5
      },
      {
        id: 'dq2',
        question: 'How do you handle multi-file context without exceeding Gemini\'s rate limits or context window latency?',
        focusArea: 'Feasibility Risk',
        context: 'Large repos require understanding thousands of cross-file references.',
        suggestedAnswer: 'We index only changed files + immediate AST imports using lightweight tree-sitter symbol graphs rather than feeding whole repos.',
        userAnswer: '',
        aiEvaluation: 'Feasible architecture. Graph-guided chunking avoids token explosion.',
        impactOnScore: +4
      },
      {
        id: 'dq3',
        question: 'What happens if the LLM suggests a security patch that introduces a subtle logic flaw?',
        focusArea: 'Scalability',
        context: 'Automated patch application carries risk of breaking production.',
        suggestedAnswer: 'All suggested patches are automatically dry-run in an isolated sub-process test container before receiving the "Verified Patch" badge.',
        userAnswer: '',
        aiEvaluation: 'Excellent defensive engineering principle.',
        impactOnScore: +6
      }
    ],
    blueprint: {
      title: 'IdeaForge Blueprint: GuardRail AI - Zero-Hallucination PR Reviewer',
      tagline: 'Deterministic AST-Constrained Code Security & Automated Patch Generation',
      problemStatement: 'Engineering teams waste hours wading through noisy AI code review tools that post generic or syntactically invalid comments.',
      executiveSummary: 'GuardRail AI bridges static analysis and neural code LLMs. By running a local WASM AST engine before dispatching prompts to Gemini Flash, it enforces deterministic safety invariants, guaranteeing syntactically valid and zero-false-positive security feedback.',
      uniqueValueProposition: 'Sub-15s PR comments with 0% syntax hallucination rate via WASM Tree-Sitter pre-filtering.',
      architectureNodes: [
        { id: 'arch1', title: 'GitHub Webhook / Action Runner', category: 'Frontend', tech: 'Octokit / Node.js', description: 'Triggers on pull_request.opened and sync events.' },
        { id: 'arch2', title: 'WASM AST Tree-Sitter Parser', category: 'Backend / LLM', tech: 'Tree-Sitter / Rust WASM', description: 'Extracts exact diff symbols, functions, and import trees.' },
        { id: 'arch3', title: 'Gemini 1.5 Flash Reasoning Engine', category: 'Backend / LLM', tech: 'Gemini Flash API', description: 'Generates security risk explanations & fix code chunks.' },
        { id: 'arch4', title: 'Deterministic AST Sanity Validator', category: 'Storage / Vector', tech: 'TypeScript AST Compiler', description: 'Validates generated patches compile cleanly before posting.' },
        { id: 'arch5', title: 'Telegram Alert & PR Comment Dispatcher', category: 'Integration / Agent', tech: 'Telegram Bot API + GitHub API', description: 'Posts formatted PR review and notifies lead dev on Telegram.' }
      ],
      techStack: [
        { category: 'Frontend / Orchestration', chosen: 'Next.js 14 App Router + Octokit', rationale: 'Unified API routes & server actions for fast GitHub API webhooks.', alternatives: ['Express.js', 'FastAPI'] },
        { category: 'LLM Reasoning Engine', chosen: 'Gemini 1.5 Flash', rationale: 'Fast 1M token context window with free tier suitable for live hackathon demo.', alternatives: ['Claude 3.5 Sonnet', 'GPT-4o-mini'] },
        { category: 'AST Parsing', chosen: 'web-tree-sitter (WASM)', rationale: 'Runs directly in Node/Vercel edge environment without installing native binaries.', alternatives: ['Babel Parser', 'ESTree'] },
        { category: 'Database & Embeddings', chosen: 'Supabase Postgres + pgvector', rationale: 'Single service for relational user data and vector embeddings.', alternatives: ['Pinecone', 'ChromaDB'] }
      ],
      apisAndDatasets: [
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
          name: 'SWE-Bench Benchmark Dataset',
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
      ],
      timeline: {
        totalEstimatedWeeks: 4,
        totalEstimatedHours: 64,
        criticalPath: 'Tree-Sitter WASM Diff Chunker → Gemini Patch Reasoning → Sub-process Syntax Test Pass',
        phases: [
          { phaseName: 'Phase 1: Foundations & AST Engine', duration: 'Week 1 (16h)', goal: 'Build deterministic AST parser & diff chunker' },
          { phaseName: 'Phase 2: Gemini Synthesis & Guardrail', duration: 'Week 2 (18h)', goal: 'Implement patch generation & AST sanity validator' },
          { phaseName: 'Phase 3: GitHub PR Bot & Telegram Agent', duration: 'Week 3 (15h)', goal: 'Connect live webhooks & PR inline commenting' },
          { phaseName: 'Phase 4: Benchmarking & Deployment', duration: 'Week 4 (15h)', goal: 'Run SWE-Bench evaluation & deploy to Vercel' },
        ],
      },
      milestones: [
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
      ],
      scaffoldFiles: [
        {
          filePath: 'README.md',
          description: 'Project documentation and quickstart instructions',
          content: `# GuardRail AI — Deterministic Code Review Agent\n\n> Research & Scaffolded by IdeaForge Copilot\n\nGuardRail AI is an open-source GitHub Action agent that eliminates false-positive code review noise using WASM Tree-Sitter AST validation.\n\n## Quickstart\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Architecture\n- **AST Engine**: WASM Web-Tree-Sitter\n- **LLM Engine**: Gemini 1.5 Flash\n- **Alerts**: Telegram Bot Agent\n\n## Required APIs & Datasets\n- **GitHub REST API v4**: Pull request diff ingestion and inline commenting\n- **web-tree-sitter WASM**: Local syntax AST tree parsing\n- **OSV.dev API**: Open-source vulnerability signature lookup\n- **SWE-Bench Dataset**: Benchmark test evaluation\n`
        },
        {
          filePath: 'docs/API_SPECIFICATION.md',
          description: 'Complete API endpoints & payload specifications',
          content: `# GuardRail AI API Specification\n\n## Endpoints\n\n### 1. POST /api/review\nHandles incoming GitHub pull_request webhooks.\n\n**Headers:**\n- \`X-GitHub-Event\`: \`pull_request\`\n- \`Content-Type\`: \`application/json\`\n\n**Response:**\n\`\`\`json\n{\n  "status": "success",\n  "diffFilesParsed": 3,\n  "vulnerabilitiesFound": 0,\n  "patchStatus": "VERIFIED_CLEAN"\n}\n\`\`\`\n\n### 2. POST /api/telegram/notify\nDispatches critical vulnerability alerts to developer Telegram chat.\n`
        },
        {
          filePath: 'src/guardrail/astParser.ts',
          description: 'Local WASM AST tree generator',
          content: `import Parser from 'web-tree-sitter';\n\nexport async function parseDiffToAST(codeSnippet: string) {\n  await Parser.init();\n  const parser = new Parser();\n  // Parse syntax tree\n  return parser.parse(codeSnippet);\n}\n`
        },
        {
          filePath: 'src/app/api/review/route.ts',
          description: 'Next.js API route handling GitHub PR webhook payload',
          content: `import { NextResponse } from 'next/server';\n\nexport async function POST(req: Request) {\n  const payload = await req.json();\n  // Run AST sanity pass + Gemini reasoning\n  return NextResponse.json({ status: 'success', summary: 'Clean review posted' });\n}\n`
        }
      ],
      telegramMentorPrompt: '🤖 *IdeaForge AI Mentor*: Hey there! Your GuardRail AI blueprint is generated. Have you wired up your WASM Tree-Sitter parser yet? Type your question here or reply to check off Milestone 1!'
    }
  }
};
