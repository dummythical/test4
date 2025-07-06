const { app, BrowserWindow, session } = require('electron');
const crypto = require('crypto');

// Replace with the SHA-256 hash of your server's public key in base64
const PINNED_PUBLIC_KEY_HASH = 'REPLACE_WITH_BASE64_HASH';

function verifyCertificate(request, callback) {
  const { hostname, certificate } = request;
  if (hostname === '192.168.1.21') {
    try {
      const pem = `-----BEGIN CERTIFICATE-----\n${certificate.data.toString('base64')}\n-----END CERTIFICATE-----`;
      const publicKey = crypto.createPublicKey(pem).export({ type: 'spki', format: 'der' });
      const hash = crypto.createHash('sha256').update(publicKey).digest('base64');
      if (hash === PINNED_PUBLIC_KEY_HASH) {
        return callback(0);
      }
      return callback(-2);
    } catch (err) {
      console.error('Certificate verification failed', err);
      return callback(-2);
    }
  }
  return callback(0);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  session.defaultSession.setCertificateVerifyProc(verifyCertificate);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
