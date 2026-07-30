const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

async function clearWebhook() {
  console.log('Clearing Webhook on Telegram Bot...');
  const res = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`);
  const data = await res.json();
  console.log('deleteWebhook response:', JSON.stringify(data, null, 2));

  console.log('\nTesting getUpdates after webhook deletion...');
  const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
  const updatesData = await updatesRes.json();
  console.log('getUpdates response:', JSON.stringify(updatesData, null, 2));
}

clearWebhook();
