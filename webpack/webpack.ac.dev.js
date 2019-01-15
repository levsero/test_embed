const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.ac.common.js');
const fs = require('fs');
const webWidgetTemplates = require('../dev/web_widget_templates');
const I18nPlugin = require('./i18nPlugin.js');

const CWD = process.cwd();
const CSP_HEADER = "\
  object-src 'none';\
  script-src 'nonce-abc123' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;\
  base-uri 'none'\
";

module.exports = () => {
  const userConfig = process.env.USER_CONFIG || 'example-template';
  const config = JSON.parse(
    fs.readFileSync(`./dev/configs/${userConfig}.json`)
  );

  return merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
      webWidgetPreview: path.join(CWD, '/src/webWidgetPreview.js'),
      chatPreview: path.join(CWD, '/src/chatPreview.js')
    },
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    devServer: {
      host: '0.0.0.0',
      port: 1337,
      disableHostCheck: true,
      headers: {
        'Cache-Control': 'no-cache, no-store',
        'Content-Security-Policy': CSP_HEADER
      }
    },
    plugins: [
      ...webWidgetTemplates(config),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true)
      }),
      new webpack.WatchIgnorePlugin([
        path.resolve(__dirname, './test/'),
        path.resolve(__dirname, './node_modules/')
      ]),
      new ProgressBarPlugin({
        format: 'Build [:bar] :percent (:elapsed seconds)',
        clear: false
      }),
      I18nPlugin
    ]
  });
};
