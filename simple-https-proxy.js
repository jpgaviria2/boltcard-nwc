const http = require('http');
const https = require('https');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('Content-Security-Policy', "default-src 'self' http: https: data: blob: 'unsafe-inline'");
  next();
});

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://127.0.0.1:3000',
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  logLevel: 'info',
  onProxyReq: (proxyReq, req, res) => {
    // Add forwarded headers
    proxyReq.setHeader('X-Real-IP', req.connection.remoteAddress);
    proxyReq.setHeader('X-Forwarded-For', req.connection.remoteAddress);
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
  }
};

// Create proxy middleware
const proxy = createProxyMiddleware(proxyOptions);

// Use proxy for all routes
app.use('/', proxy);

// HTTP server (port 80) - redirect to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// Start HTTP server
const httpServer = http.createServer(httpApp);
httpServer.listen(80, '0.0.0.0', () => {
  console.log('HTTP server running on port 80 (redirecting to HTTPS)');
});

// For now, let's run HTTPS on port 8443 to avoid port conflicts
// and use a simple certificate generation
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
}, app);

httpsServer.listen(8443, '0.0.0.0', () => {
  console.log('HTTPS server running on port 8443');
  console.log('Your app is available at: https://lnbucks.com:8443');
  console.log('Note: You may need to accept the security warning in your browser');
});

// Handle WebSocket upgrades
httpsServer.on('upgrade', (request, socket, head) => {
  proxy.upgrade(request, socket, head);
});

httpServer.on('upgrade', (request, socket, head) => {
  proxy.upgrade(request, socket, head);
});

console.log('Simple HTTPS reverse proxy started!');
console.log('Make sure your Next.js app is running on port 3000'); 