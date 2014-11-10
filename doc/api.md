## Zendesk Widget API

## Introduction

The Zendesk Widget API is a JavaScript API for controlling the display and data passed to the Zendesk Widget, a means of embedding Zendesk functionality (ticketing, live chat and Help Center knowledgebase search) on any website.

<b>Note</b>: All the API methods documented below assume that you have installed the Zendesk Widget JavaScript code snippet on your website or webpage(s).

You can find the widget snippet code for your Zendesk account by visiting the Widget admin page:
* Log in to your Zendesk
* Click the Admin icon (![](http://zen-marketing-documentation.s3.amazonaws.com/docs/en/manage_icon.png)) in the sidebar and
* Select Channels >  Widget

The associated code for each API call should be put just after the widget snippet, before the < /head> in the HTML source of your webpage. 'zE.hide', 'zE.activate' and 'zE.identify' can be used before <em>and</em> after page load (For example, associated with certain button clicks on your website).

### zE.setLocale

Out of the box, the Zendesk Widget will be displayed to the end user in a language that matches the browser header of their web browser. If you want to force the widget to be displayed in a specific language on your website, you can use 'zE.setLocale' to specify that language.

List of supported locales and associated codes: https://support.zendesk.com/api/v2/rosetta/locales/public.json

The below example shows how to force the widget to display in German:

```html
<script>
  zE(function() {
    zE.setLocale('de');
  });
</script>
```

End result: Widget displayed in German

![](https://cloud.githubusercontent.com/assets/445678/4971485/4340e4ac-68f6-11e4-81f5-7c276fae07d3.png)

### zE.identify

If you have access to your end user's name and email on your webpage you can use 'zE.identify' to pass that name and email to the widget. The widget will use this information to pre-populate the contact and/or pre-chat chat form to save the user having to type in their information (especially useful for end-users using your website on a mobile device).

```html
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>
```

End result example: Pre-populated contact form

![](https://cloud.githubusercontent.com/assets/445678/4971553/b52b0de4-68f7-11e4-94bf-b462d06c8877.png)

### zE.hide

'zE.hide' will completely hide all parts of the widget from the page. This can be invoked before page load or after.

**Before Page Load**
```html
<script>
  zE(function() {
    zE.hide();
  });
</script>
```

**After Page Load**
```html
  <button onclick="zE.hide();">Hide Zendesk Widget</button>
```

### zE.activate

'zE.activate' will activate and open the widget in its starting state (which will depend on the configuration you have setup in the widget admin).

**After Page Load** (e.g. when someone clicks on the 'Contact' button of your website, you could call zE.activate to pop the widget open)
```html
  <button onclick="zE.activate();">Activate Zendesk Widget</button>
```
