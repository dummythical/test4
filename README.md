# test4

This project demonstrates how to perform public key pinning in an Electron
application. The main process uses Electron's `session.setCertificateVerifyProc`
to compare the server's public key hash against a pinned value.

## Generating the public key hash
1. Locate your server certificate (for example `/etc/ssl/certs/server.crt`).
2. Run the following command to compute the SHA-256 hash of its public key:
   ```bash
   openssl x509 -pubkey -noout -in /path/to/server.crt | \
     openssl pkey -pubin -outform der | \
     sha256sum
   ```
3. Take the resulting hash and update `PINNED_PUBLIC_KEY_HASH` in `main.js`.
   The value should be in the form `sha256/<base64-encoded-hash>`.

## Running the app
Install dependencies and start the Electron application:

```bash
npm install
npm start
```

The app will only trust connections whose certificate matches the pinned public
key hash.

