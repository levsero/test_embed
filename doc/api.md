## Web Widget API v1

<span class="alert alert-block alert-warning">This page documents legacy zE methods. Zendesk introduced a new command syntax for greater flexibility. If you're still using these legacy methods, consider migrating to the <a href="https://developer.zendesk.com/embeddables/docs/widget/introduction">command syntax</a>.</span>

The Web Widget API v1 consists of the following methods:

* `zE.setLocale`
* `zE.identify`
* `zE.hide`
* `zE.show`
* `zE.activate`
* `zE.setHelpCenterSuggestions`

You can use the `zE.identify`, `zE.hide`, `zE.show`, and `zE.activate` methods before and after page load. For example, you can use them in click event handlers.

### zE.setLocale

`zE.setLocale(locale)`

The method takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Web Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE.setLocale()` to specify the language.

The following example displays the widget in German:

```html
<script type="text/javascript">
zE(function() {
  zE.setLocale('de');
});
</script>
```

**Note**: This code should be placed immediately after the Web Widget code snippet.

![Set Locale Example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/zE.SetLocale.png)

### zE.identify

`zE.identify(userObj)`

The method takes a JavaScript object with a `name`, `email` and optionally, `organization` property.

If you have access to your end user's name and email on the web page (for example, if your user is signed in), you can use `zE.identify()` to pass the details of that user to your Zendesk Support account, ensuring your user data is in sync.

Here's how it works: If the user's email doesn't already exist in your Zendesk Support account, a new user record with those details is created.

The Widget also uses the information in the `zE.identify()` call to pre-populate the contact or pre-chat chat form, saving the user from having to type in the information. This is especially useful for end users using your website on a mobile device (screenshot below).

Note: Passing an `organization` with `zE.identify()` only works for existing organizations in your Zendesk Support account. It does *not* create a new organization.

```html
<script type="text/javascript">
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

![Identify Example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/zE.Identify.png)

### zE.hide

`zE.hide()`

The method completely hides all parts of the Widget from the page. You can invoke it before or after page load.

**Before page load**

```html
<script type="text/javascript">
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
<script type="text/javascript">
if(loggedIn) {
  zE(function() {
    zE.show();
  });
}
</script>
```

**Note**: The widget will be displayed by default on page load when the Web Widget code snippet is present. You do not need to call `zE.show()` to display the widget unless `zE.hide()` is used.

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

**Note**: Calling `zE.activate()` will also display the widget if it is hidden, you do not need to call `zE.show()` to use `zE.activate()`.

### zE.setHelpCenterSuggestions

`zE.setHelpCenterSuggestions(options)`

The method enhances the contextual help provided by the Web Widget.

#### Options

* `zE.setHelpCenterSuggestions({ url: true })` - In single-page apps, sets the query parameters in the URL as search terms without requiring the end user to refresh the page. This function should be called each time you want to set the suggestions. For example, navigating on a single-page app.

* `zE.setHelpCenterSuggestions({ search: 'search string' })` - Searches the Help Center for the specified search string. If results are found, displays the results as top suggestions when users click the Web Widget.

* `zE.setHelpCenterSuggestions({ labels: ['label1'] })` -  For Guide Professional customers who use Help Center labels, searches the Help Center for articles with the given labels. If results are found, displays the results as top suggestions when users click the Web Widget.

**Note**: If you pass both search strings and labels, the labels are ignored.

#### Usage

Add the method in your HTML source code immediately after your Web Widget code snippet. Example:

```html
<script type="text/javascript">
zE(function() {
  zE.setHelpCenterSuggestions({ search: 'credit card' });
});
</script>
```

The `zE.setHelpCenterSuggestions()` method can be called multiple times, which can be useful in a single-page application.
