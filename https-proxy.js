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
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
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

// Check if SSL certificates exist
const certPath = path.join(__dirname, 'ssl', 'cert.pem');
const keyPath = path.join(__dirname, 'ssl', 'key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  // Start HTTPS server (port 443)
  const httpsServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }, app);

  httpsServer.listen(443, '0.0.0.0', () => {
    console.log('HTTPS server running on port 443');
    console.log('Your app is available at: https://lnbucks.com');
  });

  // Handle WebSocket upgrades for HTTPS
  httpsServer.on('upgrade', (request, socket, head) => {
    proxy.upgrade(request, socket, head);
  });
} else {
  console.log('SSL certificates not found. Running HTTP only on port 8080');
  
  // Fallback to HTTP on port 8080
  const fallbackServer = http.createServer(app);
  fallbackServer.listen(8080, '0.0.0.0', () => {
    console.log('Fallback HTTP server running on port 8080');
    console.log('Your app is available at: http://lnbucks.com:8080');
  });

  // Handle WebSocket upgrades for fallback
  fallbackServer.on('upgrade', (request, socket, head) => {
    proxy.upgrade(request, socket, head);
  });
}

// Handle WebSocket upgrades for HTTP
httpServer.on('upgrade', (request, socket, head) => {
  proxy.upgrade(request, socket, head);
});

console.log('HTTPS reverse proxy started!');
console.log('Make sure your Next.js app is running on port 3000'); 