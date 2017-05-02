## Content Security Policy (CSP) support

The HTTP [Content-Security-Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) response header helps guard against cross-site scripting attacks. The header specifies a whitelist that controls the resources the browser is allowed to load when rendering the page. This section describes how to add the Web Widget to the whitelist.

<p class="alert alert-warning" style="margin-top:20px;"><strong>Note</strong>: If Zendesk Chat is enabled for the widget, see <a href="#whitelisting-the-web-widget-when-chat-is-enabled">Whitelisting the Web Widget when Chat is enabled</a> below.</p>

### Whitelisting the Web Widget

Adding a source to the header's `script-src` directive is not enough to whitelist the Web Widget. You must also include some supporting JavaScript in your site.

**To whitelist the Web Widget**

1. Add `assets.zendesk.com` to the header's `script-src` directive. Example:

    ```
    Content-Security-Policy: script-src 'self' https://assets.zendesk.com
    ```

2. Create a JavaScript file containing the following script and save it in your domain.

    ```js
    window.zEmbed||(function(){
      var queue = [];

      window.zEmbed = function() {
        queue.push(arguments);
      }
      window.zE = window.zE || window.zEmbed;
      document.zendeskHost = 'your_subdomain.zendesk.com';
      document.zEQueue = queue;
    }());
    ```

    Replace `your_subdomain` with your Zendesk Support subdomain.

3. Add the script to your site. Example:

    ```html
    <script type="text/javascript" src="webwidget_csp.js"></script>
    ```

    The link must appear before the `<script>` tag detailed in the next step.

4. Add the following script _after_ the script in step 3:

    ```html
    <script src="//assets.zendesk.com/embeddable_framework/main.js" data-ze-csp="true" async defer></script>
    ```

    **Note**: The additional attributes are required.


### Whitelisting the Web Widget when Chat is enabled

If Zendesk Chat is [enabled](https://support.zendesk.com/hc/en-us/articles/203908456#topic_j1f_4gd_bq) for the Web Widget, the whitelisting solution described in the previous section won't work. The Widget's embed code tries to load additional, chat-related resources from "*.zopim" sources. To give the browser permission to load these resources, you must specify the following 3 sources in the `default-src` directive: 
* `https://*.zopim.com`
* `https://*.zopim.io` 
* `wss://*.zopim.com`

You must also relax your policy for CSS styles in the `style-src `directive by specifying `unsafe-inline` instead of a Zendesk source for CSS files.

Example header:

```
Content-Security-Policy: default-src 'self' https://*.zopim.com wss://*.zopim.com https://*.zopim.io; style-src 'unsafe-inline'
```

For more information, see the discussion named [Content Security Policy](https://chat.zendesk.com/hc/en-us/community/posts/210316137/comments/211646308) in the Zendesk Chat community.
