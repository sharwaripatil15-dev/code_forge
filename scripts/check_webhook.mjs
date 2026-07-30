const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

async function check() {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
  const data = await res.json();
  console.log('Webhook Info:', JSON.stringify(data, null, 2));

  const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
  const meData = await meRes.json();
  console.log('\nGet Me:', JSON.stringify(meData, null, 2));
}

check();
