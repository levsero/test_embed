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
