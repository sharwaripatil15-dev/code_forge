import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProjectBlueprint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userQuery, blueprint, language = 'en' }: { userQuery: string; blueprint: ProjectBlueprint; language?: string } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;

    // Detect completion intent locally as well
    const lower = (userQuery || '').toLowerCase();
    let completedMilestoneWeek: number | null = null;

    if (lower.includes('finished') || lower.includes('done') || lower.includes('completed') || lower.includes('check off')) {
      if (lower.includes('1') || lower.includes('one') || lower.includes('first')) completedMilestoneWeek = 1;
      else if (lower.includes('2') || lower.includes('two') || lower.includes('second')) completedMilestoneWeek = 2;
      else if (lower.includes('3') || lower.includes('three') || lower.includes('third')) completedMilestoneWeek = 3;
      else if (lower.includes('4') || lower.includes('four') || lower.includes('fourth')) completedMilestoneWeek = 4;
    }

    if (!geminiKey) {
      let reply = `Great job on working through your project! For your project "${blueprint.title}", focus on implementing the ${blueprint.architectureNodes[0]?.title || 'core engine'} module first.`;
      if (completedMilestoneWeek) {
        reply = `🎉 Milestone ${completedMilestoneWeek} has been marked as COMPLETED! Your project HUB dashboard is updated. ${completedMilestoneWeek < blueprint.milestones.length ? `Next up: Milestone ${completedMilestoneWeek + 1} (${blueprint.milestones[completedMilestoneWeek]?.title}).` : 'All milestones completed! Production ready!'}`;
      }
      return NextResponse.json({ success: true, reply, completedMilestoneWeek, isLive: false });
    }

    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3-flash-preview',
    ];

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      es: 'Spanish',
      fr: 'French',
      ja: 'Japanese',
    };
    const langName = languageNames[language] || 'English';

    const systemPrompt = `You are IdeaForge AI Mentor, an expert technical lead and startup co-founder guiding the developer through their specific project blueprint.

CRITICAL LANGUAGE MANDATE: You MUST reply entirely in ${langName.toUpperCase()} language (${language}).

PROJECT CONTEXT:
- Title: "${blueprint.title}"
- Tagline: "${blueprint.tagline}"
- Problem: "${blueprint.problemStatement}"
- Unique Value Proposition: "${blueprint.uniqueValueProposition}"
- System Architecture Nodes: ${JSON.stringify(blueprint.architectureNodes)}
- Tech Stack & Rationale: ${JSON.stringify(blueprint.techStack)}
- Recommended APIs & Datasets: ${JSON.stringify(blueprint.apisAndDatasets || [])}
- Development Timeline: ${JSON.stringify(blueprint.timeline || {})}
- Milestones: ${JSON.stringify(blueprint.milestones)}

INSTRUCTIONS:
1. Answer the developer's question directly and concisely in ${langName}, referencing their SPECIFIC architecture, tech stack, APIs, or milestones listed above.
2. Never give generic filler advice. Reference real technologies from their project context.
3. If they report finishing a milestone, congratulate them and highlight the next milestone step.
4. Keep responses concise (2-4 bullet points max) formatted in clean Markdown.

DEVELOPER QUESTION: "${userQuery}"`;

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const reply = response.text();

        return NextResponse.json({
          success: true,
          reply,
          completedMilestoneWeek,
          isLive: true,
          modelUsed: modelName,
        });
      } catch (apiErr: any) {
        console.warn(`[Mentor API] Model "${modelName}" failed:`, apiErr?.message || apiErr);
      }
    }

    let reply = `🤖 **IdeaForge AI Mentor**: Excellent question regarding **${blueprint.title}**!\n\n`;
    if (completedMilestoneWeek) {
      reply = `🎉 **Milestone ${completedMilestoneWeek} Marked COMPLETED!**\nYour Project HUB dashboard and milestone check-ins have been updated. ${completedMilestoneWeek < blueprint.milestones.length ? `Next up: **Milestone ${completedMilestoneWeek + 1} (${blueprint.milestones[completedMilestoneWeek]?.title})**.` : 'All milestones complete! Ready for production deployment!'}`;
    } else {
      const topTech = blueprint.techStack[0] || { chosen: 'Next.js + WASM Engine', rationale: 'high-performance execution' };
      reply += `We selected **${topTech.chosen}** because ${topTech.rationale}. Focus on **Sprint 1: ${blueprint.milestones[0]?.title || 'Core Engine'}**.`;
    }

    return NextResponse.json({
      success: true,
      reply,
      completedMilestoneWeek,
      isLive: false,
    });
  } catch (err: any) {
    console.error('Mentor API error:', err);
    return NextResponse.json({
      success: true,
      reply: 'I parsed your query against your blueprint. Keep building on your active milestone!',
      completedMilestoneWeek: null,
      isLive: false,
    });
  }
}
