const { net } = require('electron');

function fetchMessage() {
  const request = net.request('https://192.168.1.21');
  let data = '';

  request.on('response', res => {
    res.on('data', chunk => (data += chunk.toString()));
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
