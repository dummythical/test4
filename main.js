const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const SERVER_URL = 'https://192.168.1.21';
const PUBLIC_KEY_PATH = path.join(__dirname, 'server-public.pem');

function digestFromCert(certBuffer) {
  const cert = new crypto.X509Certificate(certBuffer);
  const publicKeyDer = cert.publicKey.export({ type: 'spki', format: 'der' });
  return crypto.createHash('sha256').update(publicKeyDer).digest('base64');
}

function digestFromPublicKey(keyBuffer) {
  const key = crypto.createPublicKey(keyBuffer);
  const der = key.export({ type: 'spki', format: 'der' });
  return crypto.createHash('sha256').update(der).digest('base64');
}

function fetchFromServer() {
  const pinnedDigest = digestFromPublicKey(fs.readFileSync(PUBLIC_KEY_PATH));
  return new Promise((resolve, reject) => {
    const req = https.get(
      SERVER_URL,
      {
        rejectUnauthorized: false,
        checkServerIdentity: (hostname, cert) => {
          try {
            const digest = digestFromCert(cert.raw);
            if (digest !== pinnedDigest) {
              return new Error('Public key does not match pinned certificate');
            }
          } catch (e) {
            return new Error('Failed to verify certificate');
          }
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      const data = await fetchFromServer();
      mainWindow.webContents.send('server-data', data);
    } catch (err) {
      mainWindow.webContents.send('server-error', err.message);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
