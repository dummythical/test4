const { net } = require('electron');

function fetchMessage() {
  const request = net.request('https://192.168.1.21');
  request.on('response', res => {
    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      document.getElementById('response').textContent = data;
    });
  });
  request.on('error', err => {
    document.getElementById('response').textContent = `Error: ${err.message}`;
  });
  request.end();
}

window.onload = fetchMessage;
