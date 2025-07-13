const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

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

// Start server on port 8080
const server = http.createServer(app);
server.listen(8080, '0.0.0.0', () => {
  console.log('Reverse proxy running on port 8080');
  console.log('Your app is available at: http://lnbucks.com:8080');
  console.log('Make sure your Next.js app is running on port 3000');
});

// Handle WebSocket upgrades
server.on('upgrade', (request, socket, head) => {
  proxy.upgrade(request, socket, head);
});

console.log('Simple reverse proxy started!');
console.log('Install required packages: npm install express http-proxy-middleware'); 