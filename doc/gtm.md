## Google Tag Manager support

Zendesk is transitioning to a new Web Widget snippet. You can use either the original or new snippet with [Google Tag Manager][gtm-link] (GTM).

If you're setting up the Web Widget with GTM for the first time, we recommend using the new snippet and following the procedure outlined below.

### Adding the Web Widget via Google Tag Manager

If you're using the new snippet, which looks like the following:

```html
<script>/*<![CDATA[*/window.zE||(function(e,t,s){var n=window.zE=window.zEmbed=function(){n._.push(arguments)},
a=n.s=e.createElement(t),r=e.getElementsByTagName(t)[0];n.set=function(e){
n.set._.push(e)},n._=[],n.set._=[],a.async=true,a.setAttribute("charset","utf-8"),
a.src="https://static.zdassets.com/ekr/asset_composer.js?key="+s,
n.t=+new Date,a.type="text/javascript",r.parentNode.insertBefore(a,r)})(document,"script","xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");/*]]>*/</script>
```

Then follow these steps to get the Web Widget working in GTM:

1. Create a new `Custom HTML Tag` in GTM.
2. Sign in to your Zendesk Support account as an admin and go to **Admin > Channels > Widget**.
3. Select the **Setup** tab and copy the snippet code.

<img alt="An example of the Zendesk widget settings and where to copy the snippet" src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_snippet.png" width="650px" />

5. In the `Configure Tag` step paste the copied snippet code in the `HTML` textbox.
4. Configure the Fire On step to run whenever you'd like on your website.

### Adding the Web Widget via Google Tag Manager (Original snippet)

If you're using the original snipppet, which looks like the following:

```html
<script>/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");
window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",
(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;
try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}
o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",
this.t=+new Date,this.zendeskHost="{{zendeskSubdomain}}",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();/*]]>*/</script>
```

Where `{{zendeskSubdomain}}` is your host e.g. `subdomain.zendesk.com`.

Then follow the instructions outlined below to get the Web Widget working in GTM.

If you're configuring your GTM with the Web Widget for the first time and are experiencing difficulty loading the Web Widget, we have found that using the new snippet mentioned above may help.

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
