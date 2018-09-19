## Introduction

The Web Widget API lets you interact with the Web Widget and its channel-specific components such as Chat.

To start using the API, you must embed the widget in your website using the latest `script` tag available in Zendesk Support. See [Adding the Web Widget to your website or Help Center](https://support.zendesk.com/hc/en-us/articles/115009522787). If you don't have access to Zendesk Support, ask a Support admin to get the tag for you.

The Web Widget API consists of commands and settings.

### Commands

All commands follow the following basic syntax:

```javascript
  zE('webWidget:<action>', '<event|property>', <parameters>);
```

#### Example

```javascript
  zE('webWidget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
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

