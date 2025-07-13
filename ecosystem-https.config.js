module.exports = {
  apps: [{
    name: 'https-proxy',
    script: 'https-proxy.js',
    cwd: './',
    env: {
      NODE_ENV: 'production',
      PORT: 443
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/https-proxy-err.log',
    out_file: './logs/https-proxy-out.log',
    log_file: './logs/https-proxy-combined.log',
    time: true
  }]
}; 