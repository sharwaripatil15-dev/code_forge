import { getTelegramLinkStatus, linkTelegramChatId, saveTelegramLink } from './src/lib/supabase.ts';

async function testLinkingFlow() {
  console.log('--- 1. Registering 1-Time Code FORGE-8421 for builder@ideaforge.ai in Supabase DB ---');
  await saveTelegramLink('builder@ideaforge.ai', 'FORGE-8421');

  console.log('\n--- 2. Checking Supabase Telegram Link Status BEFORE linking ---');
  const initialStatus = await getTelegramLinkStatus('builder@ideaforge.ai');
  console.log('Initial Status for builder@ideaforge.ai:', initialStatus);

  console.log('\n--- 3. Simulating User Start Command (/start FORGE-8421) ---');
  const mockChatId = '8940073418';
  const linkResult = await linkTelegramChatId('FORGE-8421', mockChatId);
  console.log('Linking Result:', linkResult);

  console.log('\n--- 4. Verifying Updated Link Status in Supabase DB AFTER linking ---');
  const updatedStatus = await getTelegramLinkStatus('builder@ideaforge.ai');
  console.log('Updated Status for builder@ideaforge.ai:', updatedStatus);

  if (updatedStatus.isConnected) {
    console.log('\n--- 5. Testing Per-User Targeted Telegram Alert Dispatching via Telegram API ---');
    const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';
    const msgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: updatedStatus.telegramChatId,
        text: `🤖 *IdeaForge AI Mentor Alert*\nProject: GuardRail AI: Deterministic Code Review Agent\n\n🎉 *Account Successfully Linked to builder@ideaforge.ai!*\nYour Telegram Chat ID (${updatedStatus.telegramChatId}) is now bound to your Supabase profile. All milestone reminders will arrive here!`,
        parse_mode: 'Markdown',
      }),
    });
    const msgData = await msgRes.json();
    console.log('Per-User Telegram Message Response:', JSON.stringify(msgData, null, 2));
  }
}

testLinkingFlow();
