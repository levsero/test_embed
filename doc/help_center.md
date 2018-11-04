## Help Center

The Web Widget includes a Help Center component that lets users search for answers in an organization's Help Center. The component is represented by the `helpCenter` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_contextual_help.png" width="200">


### Settings

The `helpCenter` object has the following settings:

* [chatButton](./settings#chatbutton)
* [filter](./settings#filter)
* [messageButton](./settings#messagebutton)
* [originalArticleButton](./settings#originalarticlebutton)
* [searchPlaceholder](./settings#searchplaceholder)
* [suppress](./settings#suppress)
* [title](./settings#title)

<a name="example-hc-settings"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      chatButton: {
        'fr': 'Discutez avec une personne',
        '*': 'Chat with a person now'
      }
    }
  }
};
</script>
```


### Commands

The Help Center component has the following command:

* [helpCenter:setSuggestions](#helpcenter-setsuggestions)

#### helpCenter:setSuggestions

`zE('webWidget', 'helpCenter:setSuggestions', options<object>);`

Enhances the contextual help provided by the Web Widget.

##### Parameters

* `{ url: true }` - In single-page apps, sets the query parameters in the URL as search terms without requiring the end user to refresh the page. This function should be called each time you want to set the suggestions. For example, navigating on a single-page app.

* `{ search: 'search string' }` - Searches the Help Center for the specified search string. If results are found, displays the results as top suggestions when users click the Web Widget.

* `{ labels: ['label1'] }` -  For Guide Professional customers who use Help Center labels, searches the Help Center for articles with the given labels. If results are found, displays the results as top suggestions when users click the Web Widget.

**Note**: If you pass both search strings and labels, the labels are ignored.

##### Usage

Add the method in your HTML source code immediately after your Web Widget code snippet. Example:

```html
<script type="text/javascript">
zE('webWidget', 'helpCenter:setSuggestions', { search: 'credit card' });
</script>
```

The `zE.setHelpCenterSuggestions()` method can be called multiple times, which can be useful in a single-page application.

