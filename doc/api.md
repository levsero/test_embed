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

‘zE.hide’ will completely hide the widget from the page. This can be envoked on page load so it never shows up or at some other point in the runtime

```
  <script>
    zE({hideAll: true});
  </script>
```

```
  <button onclick="zE.hide()">Hide Zendesk Widget</button>
```


### zE.show

‘zE.show’ will show the widget in whatever state it was previously in before hidden.

```
  <button onclick="zE.show()">Show Zendesk Widget</button>
>>>>>>> Basic documentation
```
