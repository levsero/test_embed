## Web Widget Google Tag Manager support

The Web Widget snippet when used inside [Google Tag Manager][gtm-link] (GTM) won't work in all browsers, to make it work follow the instructions below.

### How to add support

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
