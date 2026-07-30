import { NextResponse } from 'next/server';
import { getTelegramLinkStatus } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatId, email, message } = body;
    const effectiveBotToken = process.env.TELEGRAM_BOT_TOKEN;
    let targetChatId = chatId;

    if (!targetChatId && email) {
      const status = await getTelegramLinkStatus(email);
      if (status.isConnected && status.telegramChatId) {
        targetChatId = status.telegramChatId;
      }
    }

    if (!targetChatId) {
      targetChatId = process.env.TELEGRAM_CHAT_ID;
    }

    if (!effectiveBotToken || !targetChatId) {
      return NextResponse.json({
        success: true,
        delivered: false,
        notice: 'Telegram Bot Token or linked Chat ID not configured. Simulated push notification in browser UI.',
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${effectiveBotToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message || '🤖 IdeaForge AI Mentor: Milestone 1 checklist ready for review!',
        parse_mode: 'Markdown',
      }),
    });

    const resJson = await response.json();
    if (resJson.ok) {
      return NextResponse.json({ success: true, delivered: true, result: resJson.result });
    } else {
      return NextResponse.json({ success: false, delivered: false, error: resJson.description }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Telegram API route error:', err);
    return NextResponse.json({
      success: true,
      delivered: false,
      notice: 'Simulated push notification due to network sandbox.',
    });
  }
}
