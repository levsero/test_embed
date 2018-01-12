const cmd = require('node-cmd');
const appRoot = require('app-root-path');
const fs = require('fs');
const http = require('http');
const confPath = appRoot + process.argv[3];
const watchConfPath = fs.existsSync(confPath) ? confPath : appRoot + '/config/.watch.example';
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: watchConfPath });

const version = 'FFFFFF';
const secret = 'abc123';

function updateDevManifest() {
  const subdomain = process.env.WATCH_DOMAIN;
  const postData = JSON.stringify({
    manifest: {
      subdomain,
      products: {
        web_widget: true
      }
    }
  });
  const options = {
    hostname: 'dev.zd-dev.com',
    path: '/embed_key_registry/manifest/dev.zd-dev.com',
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'X-Samson-Token': generateJwt(secret)
    }
  };
  const req = http.request(options, (res) => {
    console.log(`PUT ${options.path} STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  req.on('error', (e) => console.log(`Error releasing dev version: ${e.message}`));
  req.write(postData);
  req.end();
}

function updateWidgetProduct() {
  const postData = JSON.stringify({
    product: {
      name: 'web_widget',
      version,
      base_url: 'http://localhost:1337/dist'
    }
  });
  const options = {
    hostname: 'dev.zd-dev.com',
    path: '/embed_key_registry/release',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'X-Samson-Token': generateJwt(secret)
    }
  };
  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  req.on('error', (e) => console.log(`Error releasing dev version: ${e.message}`));
  req.write(postData);
  req.end();
}

function generateJwt(secret) {
  const now = Math.floor(Date.now() / 1000);
  const options = {
    exp: now + 60 * 5,
    iat: now,
    user: 'zdsamson'
  };

  return jwt.sign(options, secret);
}

cmd.run(`mkdir -p dist/web_widget/${version}`);
cmd.run(`cp manifest.json dist/web_widget/${version}`);
cmd.run(`cp src/translation/\*.js dist/web_widget/${version}`);

updateDevManifest();
updateWidgetProduct();
