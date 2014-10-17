## Zendesk widget API

### zE.identify

Use 'zE.identify' to pass user name and email to the widget, then widget can prepopulate those information for the user when the user interacts with contact form and/or chat.

```javascript
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>
```
