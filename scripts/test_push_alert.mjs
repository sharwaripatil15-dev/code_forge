const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';
const chatId = '5398360379';

async function testPushAlert() {
  console.log(`Sending live push alert to Telegram Chat ID ${chatId}...`);
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '🤖 *IdeaForge AI Mentor Alert*\nProject: GuardRail AI: Deterministic Code Review Agent\n\n⚠️ *Sprint 1*: AST Extraction & Diff Parser Engine is currently due!\n- *Deliverables*: GitHub Action trigger setup, WASM Tree-Sitter integration extracting diff context\n- *Risk*: Tree-sitter WASM memory overhead in Vercel Edge Runtime',
      parse_mode: 'Markdown',
    }),
  });

  const resJson = await response.json();
  console.log('Telegram API sendMessage result:', JSON.stringify(resJson, null, 2));
}

testPushAlert();
