# Testing CSP

Firstly, open the `webpack.dev.config.js` and adjust the `devtool` option to be `source-map` instead of `cheap-module-eval-source-map`.

```js
// root.devtool = 'cheap-module-eval-source-map';

// Enable this for testing CSP.
root.devtool = 'source-map';
```

Now run `npm run watch` and navigate to `localhost:1337/csp.html`. Don't use the `webpack-dev-server` path, we need to use inline mode to correctly test CSP.

*Note: You can open `example/csp.js` to edit the zendesk subdomain the Web Widget will use.*

## With chat enabled

Due to how we inject the Zopim snippet into the host page at run-time, we need to enable less strict CSP directives for both scripts and styles.

Open `example/csp.html` and enable the less strict CSP meta tag.

```html
<!-- <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://assets.zendesk.com"> -->

<!-- Use this CSP meta tag when chat is enabled -->
<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://assets.zendesk.com https://*.zopim.com wss://*.zopim.com https://*.zopim.io 'unsafe-inline'; style-src 'unsafe-inline'">
```
