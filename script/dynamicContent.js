const http = require('http');
const _ = require('lodash');

const numberToCreate = 50;

const formatDc = (name, var1) => {
  return `{"item": {"name": "${name}", "default_locale_id": 16, "variants": [{"locale_id": 16, "default": true, "content": "${var1}"}]}}`;
};

const options = {
  host: 'dev.zd-dev.com',
  path: '/api/v2/dynamic_content/items.json',
  method: 'POST',
  auth: 'admin@zendesk.com:123456',
  json: true,
  headers: { 'content-type': 'application/json' }
};

function createDynamicContent() {
  console.log('Creating Dynamic Content');

  const idSeed = Math.random();

  for (let i = 0; i < numberToCreate; i++) {
    const dynamicContentReq = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (data) => {
        if (!data.err) {
          console.log(`STATUS: ${res.statusCode}, number: ${i} of ${numberToCreate}`);
        } else {
          console.log('error making request');
        }
      });
    });

    dynamicContentReq.on('error', (e) => {
      console.log(`problem with dynamic content request: ${e.message}`);
    });

    dynamicContentReq.write(formatDc(_.uniqueId(idSeed), _.uniqueId('varient')));
    dynamicContentReq.end();
  }
}

createDynamicContent();
