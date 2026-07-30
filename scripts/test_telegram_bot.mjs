const botToken = '8940073418:AAGaCkmQ7cvUTPKDucMXe77zPPlq8yfj0CA';

async function testTelegramBot() {
  console.log('Testing Telegram Bot API getMe with token from .env.local...');
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await res.json();
    console.log('Telegram API getMe response:', JSON.stringify(data, null, 2));

    console.log('\nChecking for recent updates / chat IDs sent to bot...');
    const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const updatesData = await updatesRes.json();
    console.log('Telegram API getUpdates response:', JSON.stringify(updatesData, null, 2));
  } catch (err) {
    console.error('Error testing Telegram bot:', err);
  }
}

testTelegramBot();
