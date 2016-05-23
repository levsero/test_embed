## Web Widget API

The Web Widget API is a JavaScript API for controlling the display and data passed to the Web Widget. The Web Widget embeds Zendesk functionality such as ticketing, live chat, and Help Center KB searches in a website.

The API consists of the following methods:

* `zE.setLocale`
* `zE.identify`
* `zE.hide`
* `zE.show`
* `zE.activate`
* `zE.setHelpCenterSuggestions`

You can use the `zE.identify`, `zE.hide`, `zE.show`, and `zE.activate` methods before and after page load. For example, you can use them in click event handlers.

**Note**: If you're looking for the Widget code for your pages, you can get it from the admin pages of your Zendesk account. After signing in to your Zendesk, click the Admin icon (![icon](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/manage_icon.png)) in the sidebar and select **Channels** >  **Widget**.

For more information on setting up the Web Widget, this [support article](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website) will guide you through your setup.

### zE.setLocale

`zE.setLocale(locale)`

The method takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Web Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE.setLocale()` to specify the language.

The following example displays the widget in German:

**Note**: This code should be placed immediately after the Web Widget code snippet

```html
<script>
  zE(function() {
    zE.setLocale('de');
  });
</script>
```

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_api_locale.png)

### zE.identify

`zE.identify(userObj)`

The method takes a JavaScript object with a `name`, `email` and optionally, `organization` property.

If you have access to your end user's name and email on the web page (for example, if your user is signed in), you can use `zE.identify()` to pass the details of that user to your Zendesk account, ensuring your user data is in sync.

Here's how it works: If the user's email doesn't already exist in your Zendesk, a new user record with those details is created.

The Widget also uses the information in the `zE.identify()` call to pre-populate the contact or pre-chat chat form, saving the user from having to type in the information. This is especially useful for end users using your website on a mobile device (screenshot below).

Note: Passing an `organization` with `zE.identify()` only works for existing organizations in your Zendesk account. It does *not* create a new organization.

```html
<script>
  zE(function() {
    zE.identify({
      name: 'John Citizen',
      email: 'john@example.com',
      organization: 'VIP'
    });
  });
</script>
```

The Widget contact form pre-populated using the data in `zE.identify()`:

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
  <button onclick="zE.hide();">Hide Web Widget</button>
```
### zE.show

`zE.show()`

The method displays the Widget on the host page in its starting 'button' state.

For example, when someone logs into your website, you could call `zE.show()` to conditionally render the widget for authenticated users only:

```html
<script>
  if(loggedIn) {
    zE(function() {
      zE.show();
    });
  }
</script>
```

Note: The widget will be displayed by default on page load when the Web Widget code snippet is present. You do not need to call `zE.show()` to display the widget unless `zE.hide()` is used.

### zE.activate

`zE.activate(options)`

The method activates and opens the Widget in its starting state. The starting state will depend on how you configured the Widget on the Widget admin page.

For example, when someone clicks a 'Contact' button of your website, you could call `zE.activate()` to pop open the widget:

**Parameters**
> options object -  hideOnClose: If `true`, hides the widget after the user closes it, `false` by default

**Default**

```html
  <button onclick="zE.activate();">Contact Us</button>
```

**With Options**

```html
  <button onclick="zE.activate({hideOnClose: true});">Contact Us</button>
```

Note: Calling `zE.activate()` will also display the widget if it is hidden, you do not need to call `zE.show()` to use `zE.activate()`.
