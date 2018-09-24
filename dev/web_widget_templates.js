const fs = require('fs');
const jwt = require('jsonwebtoken');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chunks = require('../webpack/chunks');

const CHUNKS = [
  chunks.RUNTIME_CHUNK,
  chunks.COMMON_VENDOR_CHUNK,
  chunks.TRANSLATIONS_CHUNK,
  chunks.CHAT_VENDOR_CHUNK,
  chunks.TALK_VENDOR_CHUNK,
  chunks.WEB_WIDGET_CHUNK
];
const TEMPLATES_PATH = './dev/templates/web_widget';

module.exports = function(config) {
  const templates = fs.readdirSync(TEMPLATES_PATH);

  return templates.map((template) => {
    return new HtmlWebpackPlugin({
      template: `${TEMPLATES_PATH}/${template}`,
      filename: template,
      chunks: CHUNKS,
      chunksSortMode: 'manual',
      ...config,
      hcJwt: generateHcJwt(config.sharedSecret, config.user),
      chatJwt: generateChatJwt(config.chatSharedSecret, config.user),
      snippet: snippet(config.zendeskHost)
    });
  });
};

function snippet(zendeskHost) {
  return `
    <script>
      window.zEmbed || (function(host) {
        var queue = [];

        window.zEmbed = function() {
          queue.push(arguments);
        };

        window.zE = window.zE || window.zEmbed;
        document.t = +new Date();
        document.zendeskHost = host;
        document.zEQueue = queue;
      }('${zendeskHost}'));
    </script>
  `;
}

function generateHcJwt(sharedSecret, user) {
  const message = {
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    // returns a random int between 0 and 0xFFFFFF, and then converts it to a string in hex format (base 16).
    jti: ((Math.random() * 0xFFFFFF) | 0).toString(16)
  };

  return generateJwt(sharedSecret, message);
}

function generateChatJwt(sharedSecret, user) {
  const message = {
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    external_id: user.externalId // eslint-disable-line camelcase
  };

  return generateJwt(sharedSecret, message);
}

function generateJwt(sharedSecret, message) {
  return jwt.sign(message, sharedSecret);
}
