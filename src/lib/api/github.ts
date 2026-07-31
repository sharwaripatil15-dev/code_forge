import { GitHubRepo } from '../types';
import { log } from '../logger';

// Common stop-words to clean out natural language filler
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when',
  'at', 'by', 'from', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'of', 'in',
  'on', 'off', 'over', 'under', 'again', 'further', 'this', 'that', 'these',
  'those', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'having', 'do', 'does', 'did', 'doing', 'app', 'application', 'software',
  'system', 'tool', 'platform', 'create', 'make', 'build', 'want', 'need', 'like'
]);

/**
 * Clean natural language sentence into high-value GitHub search keywords
 */
export function extractGitHubSearchKeywords(idea: string): string {
  if (!idea) return 'open-source-tool';

  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));

  if (words.length === 0) {
    return idea.slice(0, 30);
  }

  // Take top 3 most relevant terms
  return words.slice(0, 3).join(' ');
}

export async function fetchGitHubRepos(query: string, token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  const cleanKeywords = extractGitHubSearchKeywords(query);
  log.info(`[DeepSearch GitHub] Extracted Search Keywords for "${query}" -> "${cleanKeywords}"`);

  // Attempt 1: High Quality Filter (stars > 10)
  let repos = await executeGitHubApiQuery(`${cleanKeywords} stars:>10`, token, maxResults);

  // Attempt 2: Relaxed Search (if 0 results returned)
  if (!repos || repos.length === 0) {
    log.info(`[DeepSearch GitHub] 0 results with stars filter. Trying relaxed query for "${cleanKeywords}"...`);
    repos = await executeGitHubApiQuery(cleanKeywords, token, maxResults);
  }

  // Attempt 3: Category Fallback (if GitHub rate-limited or API offline)
  if (!repos || repos.length === 0) {
    log.warn(`[DeepSearch GitHub] API returned 0 repos for "${query}". Using dynamic category fallbacks.`);
    repos = getCategoryFallbackRepos(query);
  }

  return repos.slice(0, maxResults);
}

async function executeGitHubApiQuery(searchQuery: string, token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const encodedQuery = encodeURIComponent(`${searchQuery} archived:false`);
    const url = `https://api.github.com/search/repositories?q=${encodedQuery}&sort=stars&order=desc&per_page=${maxResults * 2}`;

    log.info(`[DeepSearch GitHub] Querying API: "${url}"`);
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'IdeaForge-Copilot',
    };

    if (token && token.trim().length > 0) {
      headers['Authorization'] = token.startsWith('ghp_') || token.startsWith('github_pat_') ? `token ${token}` : `Bearer ${token}`;
    }

    const response = await fetch(url, { headers, cache: 'no-store' });

    if (!response.ok) {
      log.warn(`[DeepSearch GitHub] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any, idx: number) => ({
      id: `gh-${item.id}`,
      name: item.name,
      fullName: item.full_name,
      description: (item.description || `Open-source production architecture for ${searchQuery}`)
        .replace(/\s+/g, ' ')
        .slice(0, 130)
        .trim() + (item.description && item.description.length > 130 ? '...' : ''),
      stars: item.stargazers_count || 0,
      url: item.html_url,
      primaryLanguage: item.language || 'TypeScript',
      approachFamily: idx % 2 === 0 ? 'Production Core Architecture' : 'Starter SDK & Integration Framework',
    }));
  } catch (err) {
    log.warn(`[DeepSearch GitHub] Execution error for query "${searchQuery}":`, err);
    return [];
  }
}

export async function fetchBuildResourcesGitHubRepos(techStackKeywords: string[], token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const query = techStackKeywords.length > 0
      ? techStackKeywords.join(' ')
      : 'starter template SDK boilerplate';

    log.info(`[Build Resources GitHub] Querying GitHub for build tools & SDKs: "${query}"`);
    const repos = await fetchGitHubRepos(`${query} boilerplate starter`, token, maxResults);
    
    if (repos && repos.length > 0) {
      return repos.map(r => ({
        ...r,
        approachFamily: 'Developer SDK & Starter Toolkit',
      }));
    }

    return getCategoryFallbackRepos(techStackKeywords.join(' '));
  } catch (err) {
    log.warn('[Build Resources GitHub] Fetch error:', err);
    return getCategoryFallbackRepos(techStackKeywords.join(' '));
  }
}

function getCategoryFallbackRepos(query: string): GitHubRepo[] {
  const q = query.toLowerCase();

  // Cloud / DevOps / Infrastructure / Management
  if (q.includes('cloud') || q.includes('management') || q.includes('devops') || q.includes('log') || q.includes('server')) {
    return [
      {
        id: 'gh-fallback-cloud-1',
        name: 'open-telemetry/opentelemetry-collector',
        fullName: 'open-telemetry/opentelemetry-collector',
        description: 'Vendor-agnostic proxy receiver, processor, and exporter for cloud metrics & logs.',
        stars: 4800,
        url: 'https://github.com/open-telemetry/opentelemetry-collector',
        primaryLanguage: 'Go',
        approachFamily: 'Cloud Infrastructure & Telemetry',
      },
      {
        id: 'gh-fallback-cloud-2',
        name: 'localstack/localstack',
        fullName: 'localstack/localstack',
        description: 'A fully functional local AWS cloud stack for cloud management & serverless testing.',
        stars: 54200,
        url: 'https://github.com/localstack/localstack',
        primaryLanguage: 'Python',
        approachFamily: 'Cloud Emulation & Management',
      },
      {
        id: 'gh-fallback-cloud-3',
        name: 'grafana/loki',
        fullName: 'grafana/loki',
        description: 'Like Prometheus, but for logs. Scalable, multi-tenant cloud log aggregation system.',
        stars: 23100,
        url: 'https://github.com/grafana/loki',
        primaryLanguage: 'Go',
        approachFamily: 'Cloud Log Management Engine',
      },
    ];
  }

  // AI / ML / LLM / Agent
  if (q.includes('ai') || q.includes('agent') || q.includes('llm') || q.includes('chat') || q.includes('model') || q.includes('bot')) {
    return [
      {
        id: 'gh-fallback-ai-1',
        name: 'langchain-ai/langchain',
        fullName: 'langchain-ai/langchain',
        description: 'Building applications with LLMs through composability & agent chains.',
        stars: 93400,
        url: 'https://github.com/langchain-ai/langchain',
        primaryLanguage: 'Python / TypeScript',
        approachFamily: 'AI Reasoning Framework',
      },
      {
        id: 'gh-fallback-ai-2',
        name: 'run-llama/llama_index',
        fullName: 'run-llama/llama_index',
        description: 'Data framework for LLM applications to ingest, structure, and query private data.',
        stars: 35100,
        url: 'https://github.com/run-llama/llama_index',
        primaryLanguage: 'Python',
        approachFamily: 'RAG & Vector Knowledge Engine',
      },
    ];
  }

  // Default Web App / Enterprise Starter
  return [
    {
      id: 'gh-fallback-default-1',
      name: 'vercel/next.js',
      fullName: 'vercel/next.js',
      description: 'The React Framework for Web Applications, API routes & Server Actions.',
      stars: 124000,
      url: 'https://github.com/vercel/next.js',
      primaryLanguage: 'TypeScript',
      approachFamily: 'Web Application Core Framework',
    },
    {
      id: 'gh-fallback-default-2',
      name: 'supabase/supabase',
      fullName: 'supabase/supabase',
      description: 'The open source Firebase alternative. Postgres DB, Auth, Storage, and Realtime.',
      stars: 72100,
      url: 'https://github.com/supabase/supabase',
      primaryLanguage: 'TypeScript / Elixir',
      approachFamily: 'Backend Infrastructure & Auth',
    },
  ];
}
