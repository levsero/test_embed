const fs = require('fs')
const jwt = require('jsonwebtoken')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const chunks = require('../webpack/chunks')

const CHUNKS = [
  chunks.RUNTIME_CHUNK,
  chunks.COMMON_VENDOR_CHUNK,
  chunks.CHAT_VENDOR_CHUNK,
  chunks.TALK_VENDOR_CHUNK,
  chunks.WEB_WIDGET_CHUNK
]
const TEMPLATES_PATH = './dev/templates/web_widget'
const NONCE = 'abc123'

module.exports = function(config, options = {}) {
  const templatesFilter = options.templatesFilter || filterHtmlOnly
  const templates = fs.readdirSync(TEMPLATES_PATH).filter(templatesFilter)
  const plugins = templates.map(template => {
    return [
      new HtmlWebpackPlugin({
        template: `${TEMPLATES_PATH}/${template}`,
        filename: template,
        chunks: CHUNKS,
        chunksSortMode: 'manual',
        ...config,
        hcJwt: generateHcJwt(config.sharedSecret, config.user),
        chatJwt: generateChatJwt(config.chatSharedSecret, config.user),
        snippet: snippet(config.zendeskHost),
        nonce: NONCE,
        links: generateTemplateLinks(templates, template)
      }),
      new ScriptExtHtmlWebpackPlugin({
        custom: {
          test: /\.js$/,
          attribute: 'nonce',
          value: NONCE
        }
      })
    ]
  })

  return [].concat(...plugins)
}

function filterHtmlOnly(file) {
  return file.endsWith('.html')
}

function snippet(zendeskHost) {
  return `
    <script nonce="${NONCE}">
      window.zEmbed || (function(host) {
        var queue = [];

        window.zEmbed = function() {
          queue.push(arguments);
        };

        window.zE = window.zE || window.zEmbed;
        window.zEmbed.t = +new Date();
        document.zendeskHost = host;
        document.zEQueue = queue;
      }('${zendeskHost}'));
    </script>
  `
}

function generateHcJwt(sharedSecret, user) {
  const message = {
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    // returns a random float between 0 and 1 in hex format (base 16).
    jti: Math.random()
      .toString(16)
      .slice(2)
  }

  return generateJwt(sharedSecret, message)
}

function generateChatJwt(sharedSecret, user) {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const message = {
    name: user.name,
    email: user.email,
    iat: nowInSeconds,
    exp: nowInSeconds + 300, // 5min JWT expiry time
    external_id: user.externalId.toString() // eslint-disable-line camelcase
  }

  return generateJwt(sharedSecret, message)
}

function generateJwt(sharedSecret, message) {
  return jwt.sign(message, sharedSecret)
}

function generateTemplateLinks(allTemplates, currentTemplate) {
  return `
    <style>
      a,
      a:visited {
        color: inherit;
      }

      .template-links ul {
        padding: 0;
      }

      .template-links li {
        display: inline-block;
        margin-right: 2px;
      }

      .template-links a {
        text-decoration: none;
        padding: 3px 3px 2px;
        display: block;
        border: 1px solid white;
        border-radius: 3px;
      }

      .selected,
      .template-links a:hover {
        background-color: gainsboro;
        border-color: grey!important;
      }
    </style>

    <nav class="template-links">
      <ul>
        ${allTemplates
          .map(template => {
            return `
              <li>
                <a href="/${template}" ${template === currentTemplate ? 'class="selected"' : ''}>
                  ${template.split('.')[0].replace('_', ' ')}
                </a>
              </li>
            `
          })
          .join('')}
      </ul>
    </nav>
  `
}
