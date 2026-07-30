import { NextResponse } from 'next/server';
import { linkTelegramChatId } from '@/lib/supabase';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  return handleVerification();
}

export async function POST(req: Request) {
  return handleVerification();
}

async function handleVerification() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({
      success: false,
      error: 'TELEGRAM_BOT_TOKEN not configured in .env.local',
    }, { status: 400 });
  }

  try {
    log.info('[Telegram Verify] Querying Telegram Bot API getUpdates...');
    const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
      cache: 'no-store',
    });
    const updatesData = await updatesRes.json();

    if (!updatesData.ok || !Array.isArray(updatesData.result)) {
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve updates from Telegram Bot API',
        details: updatesData,
      }, { status: 400 });
    }

    const updates = updatesData.result;
    const linkedUsers: string[] = [];

    for (const update of updates) {
      const msg = update.message || update.edited_message;
      if (!msg || !msg.text) continue;

      const text: string = msg.text.trim();
      const chatId: string = String(msg.chat?.id || '');

      // Regex matching connection codes like FORGE-1234 or /start FORGE-1234
      const match = text.match(/(?:FORGE-\d{4})/i);
      if (match && chatId) {
        const connectCode = match[0].toUpperCase();
        log.info(`[Telegram Verify] Detected code "${connectCode}" from Telegram Chat ID ${chatId}`);

        const result = await linkTelegramChatId(connectCode, chatId);
        if (result.success && result.userEmail) {
          linkedUsers.push(result.userEmail);

          // Dispatch immediate confirmation message to user's Telegram chat
          const confirmText = `🎉 *IdeaForge Account Linked!*\n\nYour Telegram chat is now securely linked to *${result.userEmail}*.\n\nYou will now receive live progress alerts, PR review notifications, and milestone reminders directly here!`;
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: confirmText,
              parse_mode: 'Markdown',
            }),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedUpdatesCount: updates.length,
      linkedUsers,
      notice: linkedUsers.length > 0 ? `Successfully linked ${linkedUsers.length} user(s)` : 'No new link requests in recent Telegram updates',
    });
  } catch (err: any) {
    log.error('[Telegram Verify Exception]:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error',
    }, { status: 500 });
  }
}
