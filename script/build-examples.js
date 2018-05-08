const appRoot = require('app-root-path');
const fs = require('fs');
const inline = require('inline-source').sync;
const glob = require('glob');
const confPath = appRoot + process.argv[3];
const watchConfPath = fs.existsSync(confPath) ? confPath : appRoot + '/config/.watch.example';
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: watchConfPath });

function generateJWT(sharedSecret) {
  const message = {
    name: 'zenguy',
    email: 'zenguy@zendesk.com',
    iat: Math.floor(Date.now() / 1000),
    // returns a random int between 0 and 0xFFFFFF, and then converts it to a string in hex format (base 16).
    jti: ((Math.random() * 0xFFFFFF) | 0).toString(16)
  };

  return jwt.sign(message, sharedSecret);
}

function generateChatJWT(sharedSecret) {
  const message = {
    name: 'zenguy',
    email: 'zenguy@zendesk.com',
    iat: Math.floor(Date.now() / 1000),
    external_id: 'zguy'
  };

  return jwt.sign(message, sharedSecret);
}

glob('./example/*-template.html', function(err, files) {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(function(file) {
    const html = inline(file, {
      ignore: ['css', 'png']
    });
    const replaceMap = {
      'zendeskFrameworkUrl': '/dist/main.js',
      'zendeskHost': process.env.WATCH_DOMAIN,
      'zopimId': process.env.WATCH_ZOPIM_ID,
      'talkIntegration': process.env.WATCH_TALK_INTEGRATION,
      'talkNickname': process.env.WATCH_TALK_NICKNAME,
      'jwt': generateJWT(process.env.WATCH_SHARED_SECRET),
      'chatJwt': generateChatJWT(process.env.WATCH_CHAT_SHARED_SECRET || 'abc')
    };
    const resultHtml = html.replace(/{{(\w+)}}/g, function(match, key) {
      return replaceMap[key];
    });
    const newFileName = file.replace('-template', '');

    fs.writeFile(newFileName, resultHtml, function(err) {
      if (err) {
        console.error(err);
      }
    });
  });
});
