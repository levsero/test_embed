## Zendesk Widget API

The Zendesk Widget API is a JavaScript API for controlling the display and data passed to a Zendesk Widget. A Zendesk Widget embeds Zendesk functionality such as ticketing, live chat, and Help Center KB searches in a website.

The API consists of the following methods:

* `zE.setLocale`
* `zE.identify`
* `zE.hide`
* `zE.activate`

You can use the `zE.identify`, `zE.hide`, and `zE.activate` methods before and after page load. For example, you can use them in click event handlers.

**Note**: If you're looking for the Widget code for your pages, you can get it from the admin pages of your Zendesk account. After signing in to your Zendesk, click the Admin icon (![icon](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/manage_icon.png)) in the sidebar and select **Channels** >  **Widget**.

### zE.setLocale

`zE.setLocale(locale)`

The method takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Zendesk Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE.setLocale()` to specify the language.

The following example displays the widget in German:

```html
<script>
  zE(function() {
    zE.setLocale('de');
  });
</script>
```

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_api_locale.png)

### zE.identify

`zE.identify(user_obj)`

The method takes a JavaScript object with a `name` and an `email` property.

If you have access to your end user's name and email on the web page, you can use `zE.identify()` to pass the user's name and email to the Widget. The Widget uses the information to pre-populate the contact or pre-chat chat form, saving the user from having to type in the information. This is especially useful for end users using your website on a mobile device.

```html
<script>
  zE(function() {
    zE.identify({name: 'John Citizen', email: 'john@example.com'});
  });
</script>
```

The Widget could then use the information to pre-populate the contact form:

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_api_identify.png)

### zE.hide

`zE.hide()`

The method completely hides all parts of the Widget from the page. You can invoke it before or after page load.

**Before page load**

```html
<script>
  zE(function() {
    zE.hide();
  });
</script>
```

**After page load**

```html
  <button onclick="zE.hide();">Hide Zendesk Widget</button>
```

### zE.activate

`zE.activate()`

The method activates and opens the Widget in its starting state. The starting state will depend on how you configured the Widget on the Widget admin page.

For example, when someone clicks a 'Contact' button of your website, you could call `zE.activate()` to pop open the widget:

```html
  <button onclick="zE.activate();">Contact Us</button>
```
