## Zendesk widget API


### zE.identify

Use 'zE.identify' to pass user name and email to the widget, then the widget can prepopulate that information for the user when the user interacts with contact form and/or chat.

```html
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>
```
This code should be put just after the widget snippet in the HTML source.

### zE.hide

‘zE.hide’ will completely hide all parts of the widget from the page. This can be invoked before page load or after.

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

‘zE.activate’ will activate and show the widget with its first page open.

```html
  <button onclick="zE.activate();">Activate Zendesk Widget</button>
```
