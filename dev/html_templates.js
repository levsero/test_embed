const fs = require('fs');
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
const TEMPLATES_PATH = './dev/templates';

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

module.exports = function(config) {
  const templates = fs.readdirSync(TEMPLATES_PATH);

  return templates.map((template) => {
    return new HtmlWebpackPlugin({
      template: `${TEMPLATES_PATH}/${template}`,
      filename: template,
      chunks: CHUNKS,
      chunksSortMode: 'manual',
      ...config,
      snippet: snippet(config.zendeskHost)
    });
  });
};
