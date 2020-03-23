const fs = require('fs')
const jwt = require('jsonwebtoken')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

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
        ...config,
        hcJwt: generateHcJwt(config.sharedSecret, config.user),
        chatJwt: generateChatJwt(config.chatSharedSecret, config.user),
        snippet: jsAssets => snippet(config.zendeskHost, jsAssets),
        nonce: NONCE,
        links: generateTemplateLinks(templates, template),
        inject: false
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

function snippet(zendeskHost, webpackJsAssets) {
  return `
    <script nonce="${NONCE}">
      window.zEmbed || (function(host, iframeAssets) {
        var queue = []
        window.zEmbed = function() {
          queue.push(arguments)
        }
        window.zE = window.zE || window.zEmbed
        window.zEmbed.t = +new Date()
        
        function iframeReady () {
          return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe')
            iframe.dataset.product = this.name
            iframe.title = 'No content'
            iframe.role = 'presentation'
            iframe.tabIndex = -1
            iframe.setAttribute('aria-hidden', true)
            iframe.style.cssText = 'width: 0; height: 0; border: 0; position: absolute; top: -9999px'
            // The dynamically created iframe must be loaded before we can get a reference to its document
            iframe.addEventListener('load', () => {
              const { contentWindow } = iframe
              if (contentWindow && contentWindow.document) {
                resolve(iframe)
              } else {
                reject("nah didn't work")
              }
            })
            iframe.src = 'about:blank'
            document.body.appendChild(iframe)
          })
        }
        
        iframeReady().then(({ contentWindow }) => { 
          const iframeDocument = contentWindow.document
          const iframeHead = iframeDocument.getElementsByTagName('head')[0]
          
          iframeDocument.zendeskHost = host
          iframeDocument.zEQueue = queue
          
          contentWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          contentWindow.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__
          
          iframeAssets.forEach(jsPath => {
            const script = iframeDocument.createElement('script')
            script.type = 'text/javascript'
            script.src = jsPath
            iframeHead.appendChild(script)
          })
        })
      }('${zendeskHost}', ${JSON.stringify(webpackJsAssets)}))
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
