const cmd=require('node-cmd');
const name = process.argv[2] || 'dev';

cmd.run('npm config set engagement_framework:watchConfigPath=/config/.watch-' + name);
