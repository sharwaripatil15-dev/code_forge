import { GitHubRepo } from '../types';
import { log } from '../logger';

export async function fetchGitHubRepos(query: string, token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const qualityQuery = encodeURIComponent(`${query} stars:>10 archived:false`);
    const url = `https://api.github.com/search/repositories?q=${qualityQuery}&sort=stars&order=desc&per_page=${maxResults}`;

    log.info(`[DeepSearch GitHub] Querying GitHub API (Quality Filtered): "${query}"`);
    log.info(`[DeepSearch GitHub] GITHUB_TOKEN defined: ${!!token} | source: ${token ? (token.startsWith('ghp_') ? 'PAT (ghp_)' : 'other format') : 'MISSING'}`);
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'IdeaForge-Copilot',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, { headers, cache: 'no-store' });
    log.info(`[DeepSearch GitHub] Rate-Limit headers → X-RateLimit-Limit: ${response.headers.get('X-RateLimit-Limit')} | X-RateLimit-Remaining: ${response.headers.get('X-RateLimit-Remaining')} | X-OAuth-Scopes: ${response.headers.get('X-OAuth-Scopes') || '(none — unauthenticated)'}`);
    log.info(`[DeepSearch GitHub] Authorization header SENT: ${!!headers['Authorization']} | Header value prefix: ${headers['Authorization']?.slice(0, 10) || 'N/A'}`);
    if (!response.ok) throw new Error(`GitHub REST API error ${response.status}`);

    const data = await response.json();
    const items = data.items || [];

    const repos = items.slice(0, maxResults).map((item: any, idx: number) => ({
      id: `gh-${item.id}`,
      name: item.name,
      fullName: item.full_name,
      description: item.description || `Open source project related to ${query}`,
      stars: item.stargazers_count || 0,
      url: item.html_url,
      primaryLanguage: item.language || 'TypeScript',
      approachFamily: idx % 2 === 0 ? 'Agentic Workflows' : `${query.slice(0, 15)} Framework`,
    }));

    log.info(`[DeepSearch GitHub] Found ${repos.length} repos for "${query}"`);
    return repos;
  } catch (err) {
    log.warn(`[DeepSearch GitHub] Fetch error for "${query}":`, err);
    return [];
  }
}

export async function fetchBuildResourcesGitHubRepos(techStackKeywords: string[], token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const buildQuery = techStackKeywords.length > 0
      ? `${techStackKeywords.slice(0, 2).join(' ')} starter template SDK boilerplate`
      : 'awesome starter boilerplate SDK';

    log.info(`[Build Resources GitHub] Querying GitHub for build tools & boilerplates: "${buildQuery}"`);
    const repos = await fetchGitHubRepos(buildQuery, token, maxResults);
    
    if (repos && repos.length > 0) {
      return repos.map(r => ({
        ...r,
        approachFamily: 'Developer SDK & Starter Toolkit',
      }));
    }

    return getFallbackBuilderRepos(techStackKeywords);
  } catch (err) {
    log.warn('[Build Resources GitHub] Fetch error:', err);
    return getFallbackBuilderRepos(techStackKeywords);
  }
}

function getFallbackBuilderRepos(keywords: string[]): GitHubRepo[] {
  const kw = keywords.join(' ').toLowerCase();
  if (kw.includes('solar') || kw.includes('energy') || kw.includes('iot')) {
    return [
      {
        id: 'gh-builder-1',
        name: 'HomeAssistant/core',
        fullName: 'home-assistant/core',
        description: 'Open source home & IoT energy automation engine.',
        stars: 71200,
        url: 'https://github.com/home-assistant/core',
        primaryLanguage: 'Python',
        approachFamily: 'Developer SDK & Starter Toolkit',
      },
      {
        id: 'gh-builder-2',
        name: 'influxdata/influxdb',
        fullName: 'influxdata/influxdb',
        description: 'Scalable time-series database for IoT metrics & microgrid sensors.',
        stars: 28500,
        url: 'https://github.com/influxdata/influxdb',
        primaryLanguage: 'Go',
        approachFamily: 'Developer SDK & Starter Toolkit',
      },
    ];
  }

  return [
    {
      id: 'gh-builder-3',
      name: 'vercel/next.js',
      fullName: 'vercel/next.js',
      description: 'The React Framework for Web Applications & Server Actions.',
      stars: 121000,
      url: 'https://github.com/vercel/next.js',
      primaryLanguage: 'TypeScript',
      approachFamily: 'Developer SDK & Starter Toolkit',
    },
    {
      id: 'gh-builder-4',
      name: 'tree-sitter/tree-sitter',
      fullName: 'tree-sitter/tree-sitter',
      description: 'An incremental parsing system & WASM web bindings for programming languages.',
      stars: 17400,
      url: 'https://github.com/tree-sitter/tree-sitter',
      primaryLanguage: 'C / WebAssembly',
      approachFamily: 'Developer SDK & Starter Toolkit',
    },
  ];
}
