import { NextResponse } from 'next/server';
import { fetchArxivPapers } from '@/lib/api/arxiv';
import { fetchGitHubRepos } from '@/lib/api/github';
import { fetchGooglePatents } from '@/lib/api/patents';
import { runGeminiSynthesis, generateDynamicFallbackState } from '@/lib/api/gemini';
import { IdeaInputData } from '@/lib/types';
import { log } from '@/lib/logger';
import { fetchHuggingFaceDatasets } from '@/lib/api/datasets';
import { fetchFoundationalPapers } from '@/lib/api/arxiv';
import { fetchBuildResourcesGitHubRepos } from '@/lib/api/github';
import { fetchLearningResources } from '@/lib/api/resources';
import { generateCitationClaims } from '@/lib/api/citations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  const startTime = Date.now();
  log.info('\n============== [DEEPSEARCH API ROUTE INVOCATION] ==============');

  try {
    const body = await req.json();
    const input: IdeaInputData = body.input;
    const languageCode: string = body.language || 'en';
    const githubToken = process.env.GITHUB_TOKEN;
    const geminiKey = process.env.GEMINI_API_KEY;

    log.info(`[1] EXACT IDEA TEXT RECEIVED: "${input?.idea}" (Language: ${languageCode})`);
    log.info(`    Category: "${input?.category || 'Not specified'}"`);
    log.info(`    Target User: "${input?.targetUser || 'Not specified'}"`);
    log.info(`    Server API Keys Configured: Gemini=${geminiKey ? 'YES' : 'NO'}, GitHub=${githubToken ? 'YES' : 'NO'}`);

    if (!input || !input.idea) {
      log.error('[ERROR] Missing idea text in request body.');
      return NextResponse.json({ error: 'Idea text is required' }, { status: 400 });
    }

    const techKeywords = input.idea.split(' ').filter(w => w.length > 3).slice(0, 2);

    // Parallel multi-source fetch (arXiv + GitHub + Google Patents + Hugging Face Datasets + Builder Repos + Foundational Papers)
    log.info('[2] Initiating parallel multi-source fetch (Competitor Search + Build Resources + HF Datasets)...');
    const [papers, repos, patents, datasets, buildRepos, foundationalPapers] = await Promise.all([
      fetchArxivPapers(input.idea, 3),
      fetchGitHubRepos(input.idea, githubToken, 3),
      fetchGooglePatents(input.idea, 3),
      fetchHuggingFaceDatasets(input.idea, 4),
      fetchBuildResourcesGitHubRepos(techKeywords, githubToken, 3),
      fetchFoundationalPapers(input.idea, 3),
    ]);

    log.info(`[3] arXiv=${papers.length} | Competitor GitHub=${repos.length} | Patents=${patents.length} | HF Datasets=${datasets.length} | Builder Repos=${buildRepos.length}`);

    // Live Gemini AI synthesis
    log.info(`[4] Calling Gemini AI Synthesis for language "${languageCode}"...`);
    let resultState = await runGeminiSynthesis(input, papers, repos, patents, geminiKey, languageCode);
    let isLive = true;

    if (!resultState) {
      log.info('[5] NOTICE: DYNAMIC FALLBACK PATH EXECUTED.');
      resultState = generateDynamicFallbackState(input, papers, repos, patents, languageCode);
      isLive = false;
    }

    // Attach 1:1 Citation-Backed Research Claims
    resultState.citationClaims = generateCitationClaims(papers, repos, patents, resultState.webInsights || []);

    // Attach distinct Build Resources Panel data to blueprint
    const techStackNames = resultState.blueprint.techStack.map(t => t.chosen);
    const learningResources = fetchLearningResources(techStackNames, input.idea);

    resultState.blueprint.buildResources = {
      datasets,
      buildRepos,
      foundationalPapers,
      learningResources,
    };

    log.info(`[6] SUCCESS: Processed in ${Date.now() - startTime}ms. Attached ${resultState.citationClaims.length} Citation Claims & ${datasets.length} HF Datasets.`);
    log.info('=================================================================\n');

    return NextResponse.json({ success: true, data: resultState, isLive });
  } catch (err: any) {
    log.error('[ERROR] Exception in DeepSearch route:', err);
    return NextResponse.json(
      { error: 'Failed to process request', details: err.message },
      { status: 500 }
    );
  }
}
