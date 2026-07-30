async function testVerifyEndpoint() {
  console.log('Testing /api/telegram/verify route on dev server http://localhost:3001...');
  try {
    const res = await fetch('http://localhost:3001/api/telegram/verify');
    const data = await res.json();
    console.log('Verification Route Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error calling /api/telegram/verify:', err);
  }
}

testVerifyEndpoint();
