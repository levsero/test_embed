## Zendesk widget API


### zE.identify

Use 'zE.identify' to pass user name and email to the widget, then the widget can prepopulate that information for the user when the user interacts with contact form and/or chat.

```html
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>


### zE.hide

‘zE.hide’ will completely hide all parts of the widget from the page. This can be invoked before page load or after.

**Before Page Load**
```javascript
  <script>
    zE({hide: true});
  </script>
```

**After Page Load**
```javascript
  <button onclick="zE.hide();">Hide Zendesk Widget</button>
```


### zE.show

‘zE.show’ will show the widget with its first page open.

```javascript
  <button onclick="zE.show();">Show Zendesk Widget</button>
```
