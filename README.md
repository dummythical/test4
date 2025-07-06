# Certificate Pinning Electron App

This example Electron application fetches data from `https://192.168.1.21` on the
local network using public key pinning. The server uses a self-signed
certificate generated via `mkcert` and the app verifies the public key of that
certificate before displaying the response.

## Setup

1. Place your server's certificate file as `server-cert.pem` in the project
   directory. This should be the same certificate used by your server.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

When the window loads, it will request data from the server and display the
response. If the server's public key does not match `server-cert.pem`, the app
will show an error.
