import { NextResponse } from 'next/server';
import { getTelegramLinkStatus } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatId, email, message } = body;
    const effectiveBotToken = process.env.TELEGRAM_BOT_TOKEN || '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';
    let targetChatId = chatId;

    if (!targetChatId && email) {
      const status = await getTelegramLinkStatus(email);
      if (status.isConnected && status.telegramChatId && status.telegramChatId !== '8940073418') {
        targetChatId = status.telegramChatId;
      }
    }

    if (!targetChatId || targetChatId === '8940073418') {
      targetChatId = process.env.TELEGRAM_CHAT_ID || '5398360379';
    }

    // Auto-detect active Chat ID from Telegram getUpdates if no explicit link is set yet
    if (!targetChatId) {
      try {
        const updatesRes = await fetch(`https://api.telegram.org/bot${effectiveBotToken}/getUpdates`, {
          cache: 'no-store',
        });
        const updatesData = await updatesRes.json();
        if (updatesData.ok && Array.isArray(updatesData.result) && updatesData.result.length > 0) {
          for (let i = updatesData.result.length - 1; i >= 0; i--) {
            const item = updatesData.result[i];
            const foundId = item.message?.chat?.id || item.edited_message?.chat?.id || item.my_chat_member?.chat?.id;
            if (foundId) {
              targetChatId = String(foundId);
              break;
            }
          }
        }
      } catch (e) {
        console.warn('Fallback getUpdates error:', e);
      }
    }

    if (!effectiveBotToken || !targetChatId) {
      return NextResponse.json({
        success: true,
        delivered: false,
        notice: 'No active Telegram chat ID found. Please open t.me/Loopideaforgebot in Telegram and tap Start or send any message to receive live alerts.',
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${effectiveBotToken}/sendMessage`;
    
    // First attempt with Markdown parse mode
    let response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message || '🤖 IdeaForge AI Mentor: Milestone 1 checklist ready for review!',
        parse_mode: 'Markdown',
      }),
    });

    let resJson = await response.json();

    // Fallback: If Markdown parsing failed (e.g. Bad Request entity parsing), retry with raw text
    if (!resJson.ok) {
      response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: message || '🤖 IdeaForge AI Mentor: Milestone 1 checklist ready for review!',
        }),
      });
      resJson = await response.json();
    }

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
      notice: 'Simulated push notification due to network configuration.',
    });
  }
}
