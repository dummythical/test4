const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const SERVER_URL = 'https://192.168.1.21';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

function pemFromRaw(raw) {
  const base64 = raw.toString('base64');
  const formatted = base64.match(/.{1,64}/g).join('\n');
  return `-----BEGIN CERTIFICATE-----\n${formatted}\n-----END CERTIFICATE-----\n`;
}

function ensurePinnedCert(certFile) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(certFile)) {
      resolve();
      return;
    }
    const req = https.get(SERVER_URL, { rejectUnauthorized: false }, res => {
      const cert = res.socket.getPeerCertificate();
      if (!cert || !cert.raw) {
        reject(new Error('Unable to retrieve certificate'));
        return;
      }
      fs.writeFileSync(certFile, pemFromRaw(cert.raw));
      res.resume();
      resolve();
    });
    req.on('error', reject);
  });
}

function fetchServerMessage(certFile) {
  return new Promise((resolve, reject) => {
    https
      .get(SERVER_URL, { ca: fs.readFileSync(certFile) }, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.message || data);
          } catch (e) {
            resolve(data);
          }
        });
      })
      .on('error', reject);
  });
}

app.whenReady().then(async () => {
  const certFile = path.join(app.getPath('userData'), 'pinned_cert.pem');
  try {
    await ensurePinnedCert(certFile);
    const message = await fetchServerMessage(certFile);
    createWindow();
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('server-message', message);
    });
  } catch (err) {
    createWindow();
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('server-message', `Error: ${err.message}`);
    });
  }
});
