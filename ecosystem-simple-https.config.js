module.exports = {
  apps: [{
    name: 'simple-https-proxy',
    script: 'simple-https-proxy.js',
    cwd: './',
    env: {
      NODE_ENV: 'production',
      PORT: 8443
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/simple-https-err.log',
    out_file: './logs/simple-https-out.log',
    log_file: './logs/simple-https-combined.log',
    time: true
  }]
}; 