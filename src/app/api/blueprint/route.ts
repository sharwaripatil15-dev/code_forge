import { NextResponse } from 'next/server';
import { runBlueprintSynthesis, generateDynamicBlueprintOnly } from '@/lib/api/gemini';
import { IdeaInputData } from '@/lib/types';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  const startTime = Date.now();
  log.info('\n============== [LAZY BLUEPRINT API ROUTE INVOCATION] ==============');

  try {
    const body = await req.json();
    const input: IdeaInputData = body.input;
    const papers = body.papers || [];
    const repos = body.repos || [];
    const patents = body.patents || [];
    const languageCode: string = body.language || 'en';
    const geminiKey = process.env.GEMINI_API_KEY;

    log.info(`[Blueprint API] Generating Lazy 3D Architecture & Scaffold for: "${input?.idea}" (Lang: ${languageCode})`);

    if (!input || !input.idea) {
      return NextResponse.json({ error: 'Idea text is required' }, { status: 400 });
    }

    let blueprint = await runBlueprintSynthesis(input, papers, repos, patents, geminiKey, languageCode);

    if (!blueprint) {
      log.info('[Blueprint API] Executing dynamic fallback blueprint path.');
      blueprint = generateDynamicBlueprintOnly(input, papers, repos, patents, languageCode);
    }

    log.info(`[Blueprint API] SUCCESS: Generated in ${Date.now() - startTime}ms.`);
    log.info('=================================================================\n');

    return NextResponse.json({ success: true, blueprint });
  } catch (err: any) {
    log.error('[Blueprint API Error] Exception in blueprint route:', err);
    return NextResponse.json(
      { error: 'Failed to generate blueprint', details: err.message },
      { status: 500 }
    );
  }
}
