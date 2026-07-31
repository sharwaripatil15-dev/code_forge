async function testVerifyWelcome() {
  console.log('Calling http://localhost:3000/api/telegram/verify to process Telegram start messages...');
  try {
    const res = await fetch('http://localhost:3000/api/telegram/verify');
    const data = await res.json();
    console.log('Verify Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error calling verify endpoint:', err);
  }
}

testVerifyWelcome();
