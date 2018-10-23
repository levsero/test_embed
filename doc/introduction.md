## Introduction

The Web Widget API is a JavaScript API for controlling the display and data passed to and from the Web Widget. You can embed the Web Widget in any website to provide your customers with Zendesk functionality such as ticketing, live chat, talk, and Help Center content.

Embed the widget in your website using the latest `script` tag available in Zendesk Support. See [Adding the Web Widget to your website or Help Center](https://support.zendesk.com/hc/en-us/articles/115009522787). If you don't have access to Zendesk Support, ask a Support admin to get the tag for you.

The Web Widget API consists of commands and settings, which are described in the rest of this doc.


### Commands

All commands follow the same basic syntax:

```js 
zE('webWidget:<action>', '<event|property>', <parameters>);
```

#### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'show', () => {
  console.log("The widget has been shown!");
});
</script>
```

The commands are grouped into core commands that affect the entire widget and channel-specific commands.

* [Core](./core#commands)
* [Chat](./chat#commands)
* [Help Center](./help_center#commands)


### Settings

You can specify various settings for the Web Widget by defining a `window.zESettings` object. Make sure to specify any setting before the Web Widget snippet.

#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: { horizontal: '100px', vertical: '150px' }
  }
};
</script>
```

The settings are grouped into core settings that affect the entire widget and channel-specific settings.

* [Core](./core#settings)
* [Tickets](./tickets#settings)
* [Help Center](./help_center#settings)
* [Chat](./chat#settings)
* [Talk](./talk#settings)
