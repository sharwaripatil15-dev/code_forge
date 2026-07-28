import { GitHubRepo } from '../types';
import { log } from '../logger';

export async function fetchGitHubRepos(query: string, token?: string, maxResults: number = 3): Promise<GitHubRepo[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.github.com/search/repositories?q=${encodedQuery}&sort=stars&order=desc&per_page=${maxResults}`;

    log.info(`[DeepSearch GitHub] Querying GitHub API: "${query}"`);
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'IdeaForge-Copilot',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(url, { headers, cache: 'no-store' });
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
