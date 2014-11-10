## Zendesk Widget API

## Introduction

The Zendesk Widget API is a JavaScript API for controlling the display and data passed to the Zendesk Widget, a means of embedding Zendesk functionality (ticketing, live chat and Help Center knowledgebase search) on any website.

With all the API methods documented below, the associated code should be put just after the widget snippet before the </head> tag in the HTML source of your webpages. The exceptions are hide and activate which can be used after page load (For example, associated with certain button clicks on your website).

You can find the widget snippet code for your Zendesk account by logging in to your Zendesk, clicking the Admin icon ( ![ ](http://zen-marketing-documentation.s3.amazonaws.com/docs/en/manage_icon.png)) in the sidebar and then selecting Channels >  Widget. 

### zE.setLocale

Out of the box, the Zendesk Widget will be displayed to the end user in a language that matches the browser header of their web browser. If you want to force the widget to be displayed in a specific language on your website, you can use 'zE.setLocale' to specify that language.

The below example shows how to force the widget to display in Spanish:

```html
<script>
  zE(function() {
    zE.setLocale('es-ES');
  });
</script>
```

### zE.identify

Use 'zE.identify' to pass a name and email to the widget. The widget will then pre-populate that information when the user interacts with the contact form and/or chat.

```html
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>
```

### zE.hide

'zE.hide' will completely hide all parts of the widget from the page. This can be invoked before page load or after.

**Before Page Load**
```javascript
  zE(function() {
    zE.hide();
  });
```

**After Page Load**
```html
  <button onclick="zE.hide();">Hide Zendesk Widget</button>
```

### zE.activate

'zE.activate' will activate and open the widget in its starting state (which will depend on the configuration you have setup in the widget admin).

```html
  <button onclick="zE.activate();">Activate Zendesk Widget</button>
```
