import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRandomSampleIdeas } from '@/lib/mock/mockData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const excludeTitles: string[] = body.excludeTitles || [];
    const language: string = body.language || 'en';

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      const fallbackIdeas = getRandomSampleIdeas(3, excludeTitles);
      return NextResponse.json({ success: true, ideas: fallbackIdeas, isLive: false });
    }

    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
    ];

    const prompt = `You are IdeaForge AI Hackathon Idea Generator. Generate exactly 3 BRAND-NEW, highly creative, technical, non-repeating hackathon project ideas across 3 DIFFERENT technology domains (e.g. AI & Developer Tools, Healthcare & BioTech, CleanTech & IoT, FinTech & Web3, Cybersecurity, Agritech & Sustainability, AR/VR & Gaming, Space & Aerospace, Robotics & Hardware).

DO NOT generate generic or repetitive titles like "Smart App" or "AI Assistant". Make each title punchy (2-5 words) and each description 2 concrete technical sentences referencing real technical mechanisms (e.g., "AST parsing", "zk-SNARKs", "QEMU emulation", "BLE sensor streams", "Vector embeddings").

Avoid these titles if possible: ${JSON.stringify(excludeTitles.slice(0, 10))}

OUTPUT STRICT JSON ONLY (no markdown backticks, no text preamble):
[
  {
    "title": "...",
    "description": "...",
    "category": "...",
    "targetUser": "..."
  },
  {
    "title": "...",
    "description": "...",
    "category": "...",
    "targetUser": "..."
  },
  {
    "title": "...",
    "description": "...",
    "category": "...",
    "targetUser": "..."
  }
]`;

    for (const modelName of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const responseText = (await result.response).text();

        const cleanedJson = responseText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();

        const parsedIdeas = JSON.parse(cleanedJson);

        if (Array.isArray(parsedIdeas) && parsedIdeas.length >= 3) {
          const validIdeas = parsedIdeas.slice(0, 3).map((item: any) => ({
            title: String(item.title || 'Novel AI Project'),
            description: String(item.description || 'Innovative technical implementation.'),
            category: String(item.category || 'AI & Tech'),
            targetUser: String(item.targetUser || 'Developers & Researchers'),
          }));

          return NextResponse.json({ success: true, ideas: validIdeas, isLive: true });
        }
      } catch (err) {
        console.warn(`[API /ideas/generate] Model "${modelName}" error:`, err);
      }
    }

    // Fallback if all AI model calls failed
    const fallbackIdeas = getRandomSampleIdeas(3, excludeTitles);
    return NextResponse.json({ success: true, ideas: fallbackIdeas, isLive: false });
  } catch (err: any) {
    console.error('Error generating AI hackathon ideas:', err);
    const fallbackIdeas = getRandomSampleIdeas(3);
    return NextResponse.json({ success: true, ideas: fallbackIdeas, isLive: false });
  }
}

export async function GET() {
  const fallbackIdeas = getRandomSampleIdeas(3);
  return NextResponse.json({ success: true, ideas: fallbackIdeas, isLive: false });
}
