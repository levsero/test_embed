## Content Security Policy (CSP) support

The HTTP [Content-Security-Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) response header helps guard against cross-site scripting attacks. The header specifies a whitelist that controls the resources the browser is allowed to load when rendering the page. This section describes how to add the Web Widget to the whitelist.

<p class="alert alert-warning" style="margin-top:20px;"><strong>Note</strong>: This security policy works with the new version of the Zendesk Web Widget snippet. Please ensure that your snippet looks like <a href="#using-the-new-snippet">the example</a> below or see <a href="#using-the-new-snippet">the details to change it</a>.</p>

<p class="alert alert-warning" style="margin-top:20px;"><strong>Note</strong>: If Zendesk Chat is enabled for the widget, see <a href="#whitelisting-the-web-widget-when-chat-is-enabled">Whitelisting the Web Widget when Chat is enabled</a> below.</p>

Zendesk uses a third-party library named [Rollbar.js](https://rollbar.com/) to track exceptions on sites that embed the widget. See [Rollbar.js](https://developer.zendesk.com/embeddables/docs/widget/legal#rollbar.js) in the Legal notices.

### Whitelisting the Web Widget

**To whitelist the Web Widget**

#### Using an HTTP Header

Add `static.zdassets.com` and `ekr.zdassets.com` to the header's `script-src` directive. Example:

```
Content-Security-Policy: script-src 'self' https://static.zdassets.com https://ekr.zdassets.com
```

Note if you use the `connect-src` directive, add your Zendesk domain. Example:

```
Content-Security-Policy: connect-src 'self' https://static.zdassets.com https://ekr.zdassets.com https://{subdomain}.zendesk.com
```

Whitelisting the widget with an HTTP header is the recommended way.

#### Using a `<meta>` Tag

If you can't modify or edit your server's headers, you may alternatively add the policy using a `<meta>` tag. Example:

 ```html
 <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://static.zdassets.com https://ekr.zdassets.com">
 ```

### Using the new snippet

To implement the CSP as described in this document, you need to use the new Zendesk snippet, which has been optimized for performance. The new snippet is much shorter and looks like this:

```html
<!-- Start of Zendesk Widget script -->
<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"> </script>
<!-- End of Zendesk Widget script -->
```

If your snippet looks longer than the one above, you can replace it with the new one. In Zendesk Support, go to *Admin* > *Widget*, click the *Setup* tab for your brand, and safely replace your snippet with the one shown in the installation instructions.

### Whitelisting the Web Widget when Chat is enabled

If Zendesk Chat is [enabled](https://support.zendesk.com/hc/en-us/articles/203908456#topic_j1f_4gd_bq) for the Web Widget, the whitelisting solution described in the previous section won't work. The Widget's embed code tries to load additional, chat-related resources from "\*.zopim" sources. To give the browser permission to load these resources, you must specify the following 3 sources in the `default-src` directive:

* `https://*.zopim.com`
* `https://*.zopim.io`
* `wss://*.zopim.com`

You must also relax your policy for inline scripts and CSS styles by specifying `'unsafe-inline'` in both the `script-src` and `style-src` directives. This is because the snippet and styles for chat are injected into the host page at runtime.

Example header:

```
Content-Security-Policy: script-src 'self' https://static.zdassets.com https://ekr.zdassets.com https://*.zopim.com wss://*.zopim.com https://*.zopim.org https://*.zopim.io 'unsafe-inline'; style-src 'unsafe-inline'
```

For more information, see the discussion named [Content Security Policy](https://chat.zendesk.com/hc/en-us/community/posts/210316137/comments/211646308) in the Zendesk Chat community.
