module.exports = {
  apps: [{
    name: 'reverse-proxy',
    script: 'simple-proxy.js',
    cwd: './',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/proxy-err.log',
    out_file: './logs/proxy-out.log',
    log_file: './logs/proxy-combined.log',
    time: true
  }]
}; 