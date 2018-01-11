## Google Tag Manager support (Legacy snippet)

<p class="alert alert-warning" style="margin-top:20px;"><strong>Note</strong>: The snippet code has changed as of late 2017. The original snippet will stil work as outlined below, but we strongly recommend following the new procedure.</p>

Some browsers may experience difficulty loading the Web Widget via [Google Tag Manager][gtm-link] (GTM) using the standard Web Widget code snippet. We recommend using a modified version of the code snippet if you wish to embed the Web Widget via Google Tag Manager.

### Adding the Web Widget via Google Tag Manager

Follow these steps to get the Web Widget working in GTM:

1. Create a new `Custom HTML Tag` inside GTM.
2. In the `Configure Tag` step paste the following code in the `HTML` textbox:

    ```html
    <script>
      window.zEmbed||(function(){
        var queue = [];

        window.zEmbed = function() {
          queue.push(arguments);
        }
        window.zE = window.zE || window.zEmbed;
        document.zendeskHost = '{{zendeskSubdomain}}';
        document.zEQueue = queue;
      }());
    </script>
    <script src="https://assets.zendesk.com/embeddable_framework/main.js" data-ze-csp="true" async defer></script>
    ```

    Where `{{zendeskSubdomain}}` is replaced by your host e.g. `subdomain.zendesk.com`.

    **Note**: Please preserve the extra attributes as they're needed for GTM support to function correctly.
3. Configure the Fire On step to run whenever you'd like on your website.

[gtm-link]: https://www.google.com/tagmanager/
