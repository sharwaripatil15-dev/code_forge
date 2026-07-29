import { GitHubRepo } from '../types';
import { log } from '../logger';

export async function fetchGitHubRepos(query: string, token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.github.com/search/repositories?q=${encodedQuery}&sort=stars&order=desc&per_page=${maxResults}`;

    log.info(`[DeepSearch GitHub] Querying GitHub API: "${query}"`);
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
