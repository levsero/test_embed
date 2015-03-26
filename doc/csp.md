## Web Widget CSP support

The Web Widget will not support the [Content-Security-Policy][csp-link] (CSP) header by default.

### How to add support

To avoid adding the `unsafe-inline` and `unsafe-eval` directives follow these instructions:

1. Add `assets.zendesk.com` to your `script-src` whitelist directive.
2. You must create a JavaScript file containing the following:

    ```js
    window.zEmbed||(function(){
      var queue = [];

      window.zEmbed = function() {
        queue.push(arguments);
      }
      window.zE = window.zE || window.zEmbed;
      document.zendeskHost = '{{zendeskSubdomain}}';
      document.zEQueue = queue;
    }());
    ```

    Where `{{zendeskSubdomain}}` is replaced by your host e.g. `subdomain.zendesk.com`.

    This can be minified and bundled into a single JavaScript file but must appear before the `<script>` tag detailed in the next step.
3. Add the following script to to your site:

    ```html
    <script src="//assets.zendesk.com/embeddable_framework/main.js" data-ze-csp="true" async defer></script>
    ```

    **Note**: Please preserve the extra attribute as they're needed for CSP support to function correctly.

[csp-link]: http://www.html5rocks.com/en/tutorials/security/content-security-policy/
