import { NextResponse } from 'next/server';
import { fetchArxivPapers } from '@/lib/api/arxiv';
import { fetchGitHubRepos } from '@/lib/api/github';
import { runGeminiSynthesis, generateDynamicFallbackState } from '@/lib/api/gemini';
import { IdeaInputData } from '@/lib/types';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const startTime = Date.now();
  log.info('\n============== [DEEPSEARCH API ROUTE INVOCATION] ==============');

  try {
    const body = await req.json();
    const input: IdeaInputData = body.input;
    const keys = body.apiKeys || {};

    log.info(`[1] EXACT IDEA TEXT RECEIVED: "${input?.idea}"`);
    log.info(`    Category: "${input?.category || 'Not specified'}"`);
    log.info(`    Target User: "${input?.targetUser || 'Not specified'}"`);
    log.info(`    API Keys Provided: Gemini=${keys.geminiKey ? 'YES' : 'NO'}, GitHub=${keys.githubToken ? 'YES' : 'NO'}`);

    if (!input || !input.idea) {
      log.error('[ERROR] Missing idea text in request body.');
      return NextResponse.json({ error: 'Idea text is required' }, { status: 400 });
    }

    // Parallel multi-source fetch with cache: 'no-store'
    log.info('[2] Initiating parallel multi-source fetch (arXiv + GitHub)...');
    const [papers, repos] = await Promise.all([
      fetchArxivPapers(input.idea, 3),
      fetchGitHubRepos(input.idea, keys.githubToken, 3),
    ]);

    log.info(`[3] arXiv returned ${papers.length} papers. GitHub returned ${repos.length} repos.`);

    // Live Gemini AI synthesis
    log.info('[4] Calling Gemini AI Synthesis...');
    const geminiResult = await runGeminiSynthesis(input, papers, repos, keys.geminiKey);

    if (geminiResult) {
      log.info(`[5] SUCCESS: LIVE PATH EXECUTED in ${Date.now() - startTime}ms.`);
      log.info(`    Novelty Score: ${geminiResult.metrics.noveltyScore}`);
      log.info(`    White Space Title: "${geminiResult.metrics.whiteSpaceTitle}"`);
      log.info('=================================================================\n');
      return NextResponse.json({ success: true, data: geminiResult, isLive: true });
    }

    // Dynamic Fallback path when no Gemini API key is configured or Gemini rate-limited
    log.info('[5] NOTICE: DYNAMIC FALLBACK PATH EXECUTED.');
    const dynamicFallback = generateDynamicFallbackState(input, papers, repos);

    log.info(`    Dynamic Fallback Novelty Score: ${dynamicFallback.metrics.noveltyScore}`);
    log.info(`    Dynamic White Space Title: "${dynamicFallback.metrics.whiteSpaceTitle}"`);
    log.info(`    Total execution time: ${Date.now() - startTime}ms.`);
    log.info('=================================================================\n');

    return NextResponse.json({ success: true, data: dynamicFallback, isLive: false });
  } catch (err: any) {
    log.error('[ERROR] Exception in DeepSearch route:', err);
    return NextResponse.json(
      { error: 'Failed to process request', details: err.message },
      { status: 500 }
    );
  }
}
