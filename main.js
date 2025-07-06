const { app, session } = require('electron');
const crypto = require('crypto');

// Replace with your server's pinned public key hash (base64 encoded)
const PINNED_PUBLIC_KEY_HASH = 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

app.on('ready', () => {
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    try {
      const x509 = new crypto.X509Certificate(request.certificate.data);
      const publicKey = x509.publicKey.export({ type: 'spki', format: 'der' });
      const hash = crypto.createHash('sha256').update(publicKey).digest('base64');

      if (`sha256/${hash}` === PINNED_PUBLIC_KEY_HASH) {
        callback(0); // Trust this certificate
      } else {
        callback(-2); // Reject this certificate
      }
    } catch (err) {
      callback(-2); // Reject on error
    }
  });
});

