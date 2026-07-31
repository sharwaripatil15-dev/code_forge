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

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      });
    }
  } catch (e) {
    log.error('[Telegram Send Exception]:', e);
  }
}

async function handleVerification() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

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
      const firstName: string = msg.chat?.first_name || 'Builder';

      const match = text.match(/(?:FORGE-\d{4})/i);

      if (match && chatId) {
        const connectCode = match[0].toUpperCase();
        log.info(`[Telegram Verify] Detected code "${connectCode}" from Telegram Chat ID ${chatId}`);

        const result = await linkTelegramChatId(connectCode, chatId);
        const emailNotice = result.userEmail ? ` to *${result.userEmail}*` : '';

        const welcomeText = `🤖 *Welcome to IdeaForge AI Mentor!*\n\n🎉 *Account Connected${emailNotice}!*\n\nHello ${firstName}! 👋 Your Telegram chat is now securely bound to your IdeaForge engineering workspace.\n\n✨ *Capabilities Activated*:\n• ⚠️ *Proactive Sprint Alerts*: Real-time alerts when milestone deliverables are due\n• 🛠️ *Grounded Architecture Advice*: Tailored answers to your tech stack & APIs\n• 📊 *Progress Tracking*: Automatic milestone check-offs as you build\n\nAsk me any question about your architecture or roadmap right here! 🚀`;

        await sendTelegramMessage(botToken, chatId, welcomeText);
        if (result.success && result.userEmail) linkedUsers.push(result.userEmail);
      } else if (text.toLowerCase().includes('/start') || text.toLowerCase() === 'start') {
        const welcomeText = `🤖 *Welcome to IdeaForge AI Mentor!*\n\nHello ${firstName}! 👋 I am your autonomous AI Co-Founder & Architecture Copilot.\n\n✨ *What I Can Do For You*:\n• ⚠️ *Proactive Sprint Alerts*: Instant notifications when project milestones are due\n• 🚀 *Blueprint Rationale*: Technical guidance on your exact tech stack & APIs\n• 📊 *Progress Tracking*: Auto-checks off deliverables as you build\n\n💡 *To link your account*:\nOpen your IdeaForge web app, click **Account Auth**, and copy your \`/start FORGE-XXXX\` code!\n\nHappy building! 🛠️`;

        await sendTelegramMessage(botToken, chatId, welcomeText);
      }
    }

    return NextResponse.json({
      success: true,
      processedUpdatesCount: updates.length,
      linkedUsers,
      notice: linkedUsers.length > 0 ? `Successfully linked ${linkedUsers.length} user(s)` : 'Processed Telegram updates successfully.',
    });
  } catch (err: any) {
    log.error('[Telegram Verify Exception]:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error',
    }, { status: 500 });
  }
}
