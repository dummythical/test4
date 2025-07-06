const https = require('https');

function fetchMessage() {
  https.get('https://192.168.1.21', res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      document.getElementById('response').textContent = data;
    });
  }).on('error', err => {
    document.getElementById('response').textContent = `Error: ${err.message}`;
  });
}

window.onload = fetchMessage;
