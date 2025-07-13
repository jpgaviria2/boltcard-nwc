module.exports = {
  apps: [{
    name: 'boltcard-nwc',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './',
    env: {
      DATABASE_URL: 'file:./prod.db',
      NODE_ENV: 'production',
      NEXT_PUBLIC_DOMAIN: 'lnbucks.com',
      NEXT_PUBLIC_ENDPOINT: 'https://lnbucks.com',
      HOSTNAME: '0.0.0.0',
      PORT: 80
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}; 