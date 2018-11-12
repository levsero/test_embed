const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chatSettingsExample = require('./chat_settings_example');

const CHUNKS_MAP = {
  'web_widget_preview.html': 'webWidgetPreview',
  'chat_preview.html': 'chatPreview'
};
const TEMPLATES_PATH = './dev/templates/previews';

module.exports = function() {
  const templates = fs.readdirSync(TEMPLATES_PATH).filter((file) => file.endsWith('.html'));

  return templates.map((template) => {
    return new HtmlWebpackPlugin({
      template: `${TEMPLATES_PATH}/${template}`,
      filename: template,
      chunks: [CHUNKS_MAP[template]],
      chatSettingsExample
    });
  });
};
