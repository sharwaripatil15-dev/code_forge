import { ResearchPaper, GitHubRepo, PatentRecord, WebInsight, CitationClaim } from '../types';

export function generateCitationClaims(
  papers: ResearchPaper[],
  repos: GitHubRepo[],
  patents: PatentRecord[],
  webInsights: WebInsight[] = []
): CitationClaim[] {
  const claims: CitationClaim[] = [];

  // 1. arXiv Papers (1:1 claim mapping)
  papers.forEach((paper, idx) => {
    const authorsStr = paper.authors && paper.authors.length > 0 ? paper.authors.join(', ') : 'arXiv Researchers';
    const cleanSummary = (paper.summary || '').replace(/\s+/g, ' ').slice(0, 140).trim();
    claims.push({
      id: `claim-paper-${idx}`,
      claimSentence: `Academic research highlights that ${paper.title.replace(/^Title:\s*/i, '')} introduces a methodology for ${cleanSummary.toLowerCase()}...`,
      sourceType: 'arXiv Paper',
      sourceTitle: paper.title,
      sourceUrl: paper.url,
      authorOrMeta: `Authors: ${authorsStr} (${paper.publishedDate})`,
      citationBadge: `[Paper ${idx + 1}]`,
    });
  });

  // 2. GitHub Repositories (1:1 claim mapping)
  repos.forEach((repo, idx) => {
    const cleanDesc = (repo.description || '').replace(/\s+/g, ' ').slice(0, 140).trim();
    claims.push({
      id: `claim-repo-${idx}`,
      claimSentence: `Existing open-source implementation in ${repo.fullName} demonstrates ${cleanDesc.toLowerCase()}... utilizing ${repo.primaryLanguage}.`,
      sourceType: 'GitHub Repository',
      sourceTitle: repo.fullName,
      sourceUrl: repo.url,
      authorOrMeta: `GitHub ⭐ ${repo.stars.toLocaleString()} stars | ${repo.primaryLanguage}`,
      citationBadge: `[Repo ${idx + 1}]`,
    });
  });

  // 3. Patent Records (1:1 claim mapping)
  patents.forEach((patent, idx) => {
    const cleanAbstract = (patent.abstract || '').replace(/\s+/g, ' ').slice(0, 140).trim();
    claims.push({
      id: `claim-patent-${idx}`,
      claimSentence: `IP prior-art record ${patent.patentNumber} (${patent.title}) covers proprietary claims for ${cleanAbstract.toLowerCase()}...`,
      sourceType: 'Patent Record',
      sourceTitle: `${patent.patentNumber}: ${patent.title}`,
      sourceUrl: patent.url,
      authorOrMeta: `Assignee: ${patent.assignee || 'Patent Office'} (${patent.publicationDate})`,
      citationBadge: `[Patent ${idx + 1}]`,
    });
  });

  // 4. Web Search Grounding (1:1 claim mapping)
  webInsights.slice(0, 2).forEach((web, idx) => {
    const cleanSnippet = (web.snippet || '').replace(/\s+/g, ' ').slice(0, 140).trim();
    claims.push({
      id: `claim-web-${idx}`,
      claimSentence: `Live web research confirms that ${cleanSnippet}...`,
      sourceType: 'Web Search Grounding',
      sourceTitle: web.title,
      sourceUrl: web.url,
      authorOrMeta: `Domain: ${new URL(web.url).hostname}`,
      citationBadge: `[Web ${idx + 1}]`,
    });
  });

  return claims;
}
