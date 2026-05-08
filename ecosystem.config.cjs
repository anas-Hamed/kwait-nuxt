module.exports = {
  apps: [
    {
      name: 'mwaqi3',
      script: './.output/server/index.mjs',
      cwd: '/var/www/kwait-nuxt',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000,
        NITRO_PORT: 3000,
      },
      out_file: '/var/log/pm2/mwaqi3.out.log',
      error_file: '/var/log/pm2/mwaqi3.err.log',
      merge_logs: true,
      time: true,
    },
  ],
};
