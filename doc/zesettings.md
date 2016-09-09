## Settings

You can specify various settings for the Web Widget by defining a `window.zESettings` object. Example:

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: { horizontal: '100px', vertical: '150px' }
  }
};
</script>
```

The `webWidget` object can have the following properties:

* [offset](#offset)
* [chat.suppress](#suppress)
* [contactForm.suppress](#suppress)
* [helpCenter.suppress](#suppress)
* [contactForm.title](#title)
* [helpCenter.title](#title)
* [helpCenter.messageButton](#messageButton)
* [helpCenter.chatButton](#chatButton)
* [helpCenter.originalArticleButton](#originalArticleButton)
* [launcher.label](#label)
* [launcher.chatLabel](#chatLabel)


### offset

Moves the Web Widget vertically and horizontally. The `offset` property consists of an object with `horizontal` and `vertical` properties with '##px' string values.

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: { horizontal: '100px', vertical: '150px' }
  }
};
</script>
```

### suppress

Suppresses the Help Center, Chat, or contact form in the Web Widget on that page.

#### Availability

* chat
* contactForm
* helpCenter

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    chat: {
      suppress: true
    },
    helpCenter: {
      suppress: true
    }
  }
};
</script>
```

### title

Replaces the default title string with a custom string.

![example](https://support.zendesk.com/hc/user_images/BdjgvaDafRlnbyU09Jny3Q.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (`*`) for the locale.

#### Availability

* contactForm
* helpCenter

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      title: {
        'en-US': 'Search for help',
        'fr': 'Recherche d\'aide'
      }
    },
    contactForm: {
      title: {
        '*': 'Feedback'
      }
    }
  }
};
</script>
```

### messageButton

Replaces the default string on the button in the Help Center form that opens the contact form.

![example](https://support.zendesk.com/hc/user_images/-iPa0eoCPqKuLhkGOgAugw.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (`*`) for the locale.

The string can't exceed 25 characters.

#### Availability

* helpCenter

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      messageButton: {
        '*': 'Contact us now.'
      }
    }
  }
};
</script>
```

### chatButton

Replaces the default string on the button in the Help Center form that opens the Chat interface.

![example](https://support.zendesk.com/hc/user_images/UZH2vMZVWgnC6woZ_EeihA.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (`*`) for the locale.

The string can't exceed 25 characters.

#### Availability

* helpCenter

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      chatButton: {
        '*': 'Chat with a person now'
      }
    }
  }
};
</script>
```

### originalArticleButton

Hides the "View Original Article" button.

#### Availability

* helpCenter

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      originalArticleButton: false
    }
  }
};
</script>
```

### label

Replaces the default string on the launcher button.

![example](https://support.zendesk.com/hc/user_images/jvBVJXA0_vfJ8byykbSyFg.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (`*`) for the locale.

#### Availability

* launcher

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    launcher: {
      label: {
        'en-US': 'Need help?',
        'fr': 'Besoin d\'aide?'
      }
    }
  }
};
</script>
```

### chatLabel

Replaces the default string on the launcher button when Chat is enabled and Help Center is not.

![example](https://support.zendesk.com/hc/user_images/XhuqwmDp14XoQqrW8K-t-Q.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (`*`) for the locale.

#### Availability

* launcher

#### Example

```javascript
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    launcher: {
      chatLabel: {
        '*': 'Chat now'
      }
    }
  }
};
</script>
```
