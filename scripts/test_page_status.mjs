async function checkServer() {
  try {
    const res = await fetch('http://localhost:3000');
    console.log('Page HTTP Status:', res.status);
    const text = await res.text();
    console.log('HTML Length:', text.length);
    console.log('HTML snippet:', text.slice(0, 300));
  } catch (err) {
    console.error('Server check error:', err.message);
  }
}

checkServer();
