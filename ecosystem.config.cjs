module.exports = {
  apps: [{
    name: 'education-platform',
    script: 'npx',
    args: ['serve', '-s', 'dist', '-p', '3000'],
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/education-platform-error.log',
    out_file: '/var/log/pm2/education-platform-out.log',
    log_file: '/var/log/pm2/education-platform-combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    instance_var: 'INSTANCE_ID'
  }]
}