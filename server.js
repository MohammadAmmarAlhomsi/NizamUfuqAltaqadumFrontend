// server.js
import fs from 'fs';
import https from 'https';
import { handler } from './build/handler.js'; // SvelteKit Node adapter output

const PORT = 8443; // your custom port
const HOST = '0.0.0.0'
const SSL_CERT = '/etc/letsencrypt/live/dawrtna.com/fullchain.pem';
const SSL_KEY = '/etc/letsencrypt/live/dawrtna.com/privkey.pem';

const options = {
    cert: fs.readFileSync(SSL_CERT),
    key: fs.readFileSync(SSL_KEY)
};

// Create HTTPS server
https.createServer(options, handler).listen(PORT, HOST, () => {
    console.log(`🚀 SvelteKit running on https://${HOST}:${PORT}`);
});