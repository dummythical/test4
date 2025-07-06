# Electron Public Key Pinning Example

This example shows how to pin the public key of a server in an Electron
application. The application connects to `https://192.168.1.21` only when the
server's public key matches the pinned hash.

## Generating the Pinned Public Key

Run the following command to extract and hash the server's public key (replace
`192.168.1.21:443` with your server if different):

```bash
openssl s_client -connect 192.168.1.21:443 -showcerts </dev/null 2>/dev/null \
  | openssl x509 -pubkey -noout \
  | openssl pkey -pubin -outform DER \
  | openssl dgst -sha256 -binary \
  | openssl base64
```

Copy the resulting base64 hash and place it in `main.js` by replacing the value
of `PINNED_PUBLIC_KEY_HASH`.

## Running the App

Install dependencies and start the application:

```bash
npm install
npm start
```

When the certificate matches the pinned key, the response from the server will
be shown in the application window.
