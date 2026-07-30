const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

async function checkUpdates() {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
  const data = await res.json();
  console.log('Current Telegram Updates:', JSON.stringify(data, null, 2));

  if (data.ok && data.result.length > 0) {
    const lastMsg = data.result[data.result.length - 1];
    const chatId = lastMsg.message?.chat?.id || lastMsg.my_chat_member?.chat?.id;
    console.log(`FOUND CHAT ID: ${chatId}`);

    if (chatId) {
      console.log(`Sending real test message to Chat ID ${chatId}...`);
      const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🤖 *IdeaForge AI Mentor*: Real test notification dispatched successfully via Telegram Bot API!',
          parse_mode: 'Markdown',
        }),
      });
      const sendData = await sendRes.json();
      console.log('Telegram API sendMessage Response:', JSON.stringify(sendData, null, 2));
    }
  } else {
    console.log('No messages sent to @Loopideaforgebot yet. (To test live message delivery: open Telegram, search @Loopideaforgebot, press Start or send any message, then re-run script).');
  }
}

checkUpdates();
