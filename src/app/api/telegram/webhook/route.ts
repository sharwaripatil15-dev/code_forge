import { NextResponse } from 'next/server';
import { linkTelegramChatId } from '@/lib/supabase';
import { log } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/telegram/webhook: Helper endpoint to register or check Vercel Webhook status
export async function GET(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('setWebhook');

  try {
    if (targetUrl) {
      log.info(`[Telegram Webhook] Registering webhook URL: ${targetUrl}`);
      const setRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      const setData = await setRes.json();
      return NextResponse.json({ success: setData.ok, result: setData });
    }

    // Check current Webhook info
    const infoRes = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const infoData = await infoRes.json();
    return NextResponse.json({ success: infoData.ok, webhookInfo: infoData.result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/telegram/webhook: Serverless Telegram Push Webhook Receiver (Vercel-Native)
export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ success: false, error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 400 });
  }

  try {
    const update = await req.json();
    log.info('[Telegram Webhook] Received incoming update:', update);

    const msg = update.message || update.edited_message;
    if (!msg || !msg.text || !msg.chat?.id) {
      return NextResponse.json({ success: true, notice: 'No text message in update' });
    }

    const text: string = msg.text.trim();
    const chatId: string = String(msg.chat.id);

    // Match connection code pattern: FORGE-1234, /start FORGE-1234, /connect FORGE-1234
    const match = text.match(/(?:FORGE-\d{4})/i);
    if (match) {
      const connectCode = match[0].toUpperCase();
      log.info(`[Telegram Webhook] Linking code "${connectCode}" to Telegram Chat ID ${chatId}...`);

      const result = await linkTelegramChatId(connectCode, chatId);
      if (result.success && result.userEmail) {
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

        return NextResponse.json({
          success: true,
          linked: true,
          userEmail: result.userEmail,
          chatId,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error || 'Connection code not found or expired',
        }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, notice: 'Message received without connection code' });
  } catch (err: any) {
    log.error('[Telegram Webhook Exception]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
