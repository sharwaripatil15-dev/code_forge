const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

async function waitForTelegramMessage() {
  console.log('Polling Telegram Bot (@Loopideaforgebot) for incoming messages...');
  console.log('--> Open Telegram, search @Loopideaforgebot, and tap START or type /start FORGE-8421 now!\n');

  for (let i = 1; i <= 10; i++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        console.log(`\n🎉 INCOMING TELEGRAM MESSAGE DETECTED (Attempt ${i}):`);
        console.log(JSON.stringify(data.result, null, 2));

        const lastMsg = data.result[data.result.length - 1];
        const chatId = lastMsg.message?.chat?.id || lastMsg.my_chat_member?.chat?.id;
        const fromUser = lastMsg.message?.from?.username || lastMsg.message?.from?.first_name || 'User';
        const text = lastMsg.message?.text || 'Started Bot';

        if (chatId) {
          console.log(`\nDispatched live alert to Chat ID ${chatId} (${fromUser})...`);
          const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `🤖 *IdeaForge AI Mentor Alert*\nProject: GuardRail AI: Deterministic Code Review Agent\n\n🎉 *Connection Verified!*\nHello ${fromUser}! Your Telegram chat (ID: ${chatId}) is now active. All sprint alerts and milestone notifications will be sent directly here!`,
              parse_mode: 'Markdown',
            }),
          });
          const sendData = await sendRes.json();
          console.log('Telegram API sendMessage result:', JSON.stringify(sendData, null, 2));
          return;
        }
      } else {
        console.log(`[Attempt ${i}/10] Waiting for user to send /start or message to @Loopideaforgebot...`);
      }
    } catch (err) {
      console.error('Error polling Telegram:', err);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log('\nTimed out polling getUpdates. No new messages detected in the last 30 seconds.');
}

waitForTelegramMessage();
