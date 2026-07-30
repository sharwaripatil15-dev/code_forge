async function testLocalApi() {
  console.log('Sending request to http://localhost:3000/api/telegram...');
  try {
    const res = await fetch('http://localhost:3000/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'builder@ideaforge.ai',
        message: '🤖 *IdeaForge AI Mentor Alert*\nTesting live button press from browser UI!',
      }),
    });

    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to reach http://localhost:3000/api/telegram:', err.message);
  }
}

testLocalApi();
