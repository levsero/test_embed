## Settings

You can specify various settings for the Web Widget by defining a `window.zESettings` object. Example:

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: { horizontal: '100px', vertical: '150px' }
  }
};
</script>
```

Make sure to specify any setting before the Web Widget snippet.

For an overview of how the Web Widget works, see [Understanding the end-user experience](https://support.zendesk.com/hc/en-us/articles/203908456#topic_bkd_qgd_bq) in the Support Help Center.


### General settings

The Web Widget has the following general settings:

* [authenticate](#authenticate)
* [color](#color)
* [offset](#offset)
* [position](#position)
* [zIndex](#zindex)

<a name="example-general"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    color: { theme: '#78a300' }
  }
};
</script>
```

### Error reporting

The Web Widget sends any errors that occur to a reporting service used by Zendesk to help diagnose and address issues. This error reporting can be disabled setting `errorReporting` to `false`.

<a name="example-error-reporting"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  errorReporting: false
};
</script>
```

### Contact form settings

The widget's `contactForm` object, which represents the contact form, has the following settings:

* [attachments](#attachments)
* [fields](#fields)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)

<a name="example-contact-form"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      attachments: false
    }
  }
};
</script>
```


### Contact options settings

The widget's `contactOptions` object, which represents a component that lets the user choose between starting a chat or submitting a ticket, has the following settings:

* enabled (Boolean)
* [contactButton](#contactbutton)
* [chatLabelOnline](#chatlabelonline)
* [chatLabelOffline](#chatlabeloffline)
* [contactFormLabel](#contactformlabel)

To learn more about contact options, see [Offering end-users multiple contact options](https://support.zendesk.com/hc/en-us/articles/229167008#topic_spt_fb1_l1b) in the Support Help Center.

<a name="example-contact-options"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactOptions: {
      enabled: true,
      contactButton: { '*': 'Get in touch' }
    }
  }
};
</script>
```


### Help Center settings

The widget's `helpCenter` object, which represents the Help Center component, has the following settings:

* [chatButton](#chatbutton)
* [filter](#filter)
* [messageButton](#messagebutton)
* [originalArticleButton](#originalarticlebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)

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


### Chat settings

The widget's `chat` object, which represents the Chat component, has the following setting:

* [suppress](#suppress)

<a name="example-chat-settings"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    chat: {
      suppress: true
    }
  }
};
</script>
```

### Talk settings

The widget's `talk` object, which represents the Talk component, has the following setting:

* [nickname](#nickname)

<a name="example-talk-settings"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    talk: {
      nickname: 'Sales Support'
    }
  }
};
</script>
```


### Launcher settings

The widget's `launcher` object, which represents the launcher button, has the following settings:

* [chatLabel](#chatlabel)
* [label](#label)

<a name="example-launcher-settings"></a>
#### Example

```html
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

### Settings reference

* [attachments](#attachments)
* [authenticate](#authenticate)
* [chatButton](#chatbutton)
* [chatLabel](#chatlabel)
* [chatLabelOnline](#chatlabelonline)
* [chatLabelOffline](#chatlabeloffline)
* [color](#color)
* [contactButton](#contactbutton)
* [contactFormLabel](#contactformlabel)
* [fields](#fields)
* [filter](#filter)
* [label](#label)
* [messageButton](#messagebutton)
* [nickname](#nickname)
* [offset](#offset)
* [originalArticleButton](#originalarticlebutton)
* [position](#position)
* [searchPlaceholder](#searchplaceholder)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)
* [zIndex](#zindex)


#### attachments

Disables attaching files to tickets submitted through the Web Widget.

##### Availability

* contactForm

<a name="example-attachments"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      attachments: false
    }
  }
};
</script>
```

##### Related Settings

* [fields](#fields)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)


#### authenticate

Gives the user access to restricted Help Center content. To use this setting, you must configure the Web Widget settings in the admin interface, and then create a JWT token based on a shared secret generated by the configuration. For details, see [Setting up the Web Widget to show restricted content](https://support.zendesk.com/hc/en-us/articles/222874768#topic_jxn_rpz_pw).

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    authenticate: { jwt: 'YOUR_JWT_TOKEN' }
  }
};
</script>
```

Tokens expire after two hours. You can remove them from local storage sooner by running the following function when the user logs out:

```javascript
zE(function() {
  zE.logout();
});
```


#### chatButton

Replaces the default string on the button in the Help Center form that opens the Chat interface.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_chat_btn.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

The string can't exceed 25 characters.

##### Availability

* helpCenter

<a name="example-chatbutton"></a>
##### Example

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

##### Related settings

* [filter](#filter)
* [messageButton](#messagebutton)
* [originalArticleButton](#originalarticlebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)


#### chatLabel

Replaces the default string on the launcher button when Chat is enabled and Help Center is not.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_chat_label.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* launcher

<a name="example-chatlabel"></a>
##### Example

```html
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

##### Related setting

* [label](#label)


#### chatLabelOffline

Replaces the default string that informs the user that chat is unavailable when [contactOptions](#contact-options-settings) is enabled.

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactOptions

<a name="example-chatlabeloffline"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactOptions: {
      enabled: true,
      chatLabelOnline: { '*': 'Live Chat' },
      chatLabelOffline: { '*': 'Chat is unavailable' }
    }
  }
};
</script>
```

##### Related settings

* [contactButton](#contactbutton)
* [chatLabelOnline](#chatlabelonline)
* [contactFormLabel](#contactformlabel)


#### chatLabelOnline

Replaces the default string of the link that lets a user start a chat when [contactOptions](#contact-options-settings) is enabled.

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactOptions

<a name="example-chatlabelonline"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactOptions: {
      enabled: true,
      chatLabelOnline: { '*': 'Live Chat' }
    }
  }
};
</script>
```

##### Related settings

* [contactButton](#contactbutton)
* [chatLabelOffline](#chatlabeloffline)
* [contactFormLabel](#contactformlabel)


#### color

Sets a color theme for the Web Widget. The `color` property consists of an object, itself with different properties to fully customize several of the widget's elements using color HEX codes as their value.

The `theme` property may be used as a base, determining the overall color scheme of the widget:

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    color: { theme: '#78a300' }
  }
};
</script>
```

You can define a number of additional options to target specific elements:

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    color: {
      theme: '#FF69B4',
      launcher: '#CC3A83',
      launcherText: '#E589B7',
      button: '#8A0648',
      resultLists: '#691840',
      header: '#203D9D',
      articleLinks: '#FF4500'
    }
  }
};
</script>
```

None of these elements are mandatory, and elements that are not defined will be based on either the `theme` color or the color [defined in the settings page](https://support.zendesk.com/hc/en-us/articles/115009692388-Configuring-the-components-in-your-Web-Widget), in that order of priority.

For accessibility, the Web Widget enforces a minimum contrast ratio between colors to ensure the widget meets a minimum 'AA' accessibility rating as specified by the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG20-TECHS/G18.html).

Set a custom combination of `launcher` and `launcherText` colors to control both the Widget's launcher button's background and foreground.

Examples of elements customized using `color` properties:

![Widget launcher](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_color_launcher.png)

![Search results](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_color_results.png)

![Article view](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_color_article.png)

##### Related settings

* [offset](#offset)
* [position](#position)
* [zIndex](#zindex)


#### contactButton

Replaces the default string on the button that opens the contact options component, which lets the user choose between starting a chat or submitting a ticket.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_contact_options.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactOptions

<a name="example-contactbutton"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactOptions: {
      enabled: true,
      contactButton: { '*': 'Get in touch' }
    }
  }
};
</script>
```

##### Related settings

* [chatLabelOnline](#chatlabelonline)
* [chatLabelOffline](#chatlabeloffline)
* [contactFormLabel](#contactformlabel)


#### contactFormLabel

Replaces the default string of the link that lets the user submit a ticket when [contactOptions](#contact-options-settings) is enabled.

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactOptions

<a name="example-contactformlabel"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactOptions: {
      enabled: true,
      contactFormLabel: { '*': 'Leave us a message' }
    }
  }
};
</script>
```

##### Related settings

* [contactButton](#contactbutton)
* [chatLabelOnline](#chatlabelonline)
* [chatLabelOffline](#chatlabeloffline)


#### fields

Pre-populates the value of one or more text fields in the contact form.

**Note**: The API doesn't support pre-populating drop-down fields. However, you can set default values for custom drop-down fields in the Support admin interface (**Manage** > **Ticket Fields**).

For a default system field, specify the field name as the field `id`. Example:

```javascript
fields: [
  { id: 'description', prefill: { '*': 'My text' } }
]
```

For a custom field, specify the custom field's id as the `id`. To get the id, see [List Ticket Fields](https://developer.zendesk.com/rest_api/docs/core/ticket_fields#list-ticket-fields) in the Zendesk API docs. Example:

```javascript
fields: [
  { id: 2142225, prefill: { '*': 'My text' } }
]
```

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactForm

<a name="example-fields"></a>
##### Example

```html
<script type="text/javascript">
zESettings = {
  webWidget: {
    contactForm: {
      fields: [
        { id: 'description', prefill: { '*': 'My field text' } },
        { id: 2142225, prefill: { '*': 'My custom field text' } }
      ]
    }
  }
};
</script>
```

##### Related settings

* [attachments](#attachments)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)


#### filter

Limits Help Center search results to a specified category, section, or label. The `filter` property consists of an object with a `category`, `section`, or `label` property.

##### Availability

* helpCenter

<a name="example-filter"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      filter: {
        section: '200154474'
      }
    }
  }
};
</script>
```

For more examples, see [Limiting search results](https://support.zendesk.com/hc/en-us/articles/229167008#topic_usl_bbq_mx) in the Zendesk Support Help Center.

##### Related settings

* [chatButton](#chatbutton)
* [messageButton](#messagebutton)
* [originalArticleButton](#originalarticlebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)


#### label

Replaces the default string on the launcher button.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_launcher.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* launcher

<a name="example-label"></a>
##### Example

```html
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

##### Related setting

* [chatLabel](#chatlabel)


#### messageButton

Replaces the default string on the button in the Help Center form that opens the contact form.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_message_btn.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

The string can't exceed 25 characters.

##### Availability

* helpCenter

<a name="example-messagebutton"></a>
##### Example

```html
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

##### Related settings

* [chatButton](#chatbutton)
* [filter](#filter)
* [originalArticleButton](#originalarticlebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)


#### nickname

An admin can choose to set up more than one configuration for how Talk behaves in the Web Widget. Each configuration can customize call routing and display options. The `nickname` property tells the Web Widget which of the available configurations to use on the current page.

The value of the `nickname` property must match exactly the nickname of the Talk configuration you want to use, including any spaces and capitalization.

The nickname is publicly visible to anyone who looks at the page source code, so create the nickname accordingly.

##### Availability

* talk

<a name="example-nickname"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    talk: {
      nickname: 'Sales Support'
    }
  }
};
</script>
```

#### offset

Moves the Web Widget vertically and horizontally. The `offset` property consists of an object with `horizontal` and `vertical` properties with '##px' string values.

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: {
      horizontal: '100px',
      vertical: '150px'
    }
  }
};
</script>
```

To specify an offset for mobile devices, add a `mobile` property to the `offset` object, and specify `horizontal` and `vertical` values. Example:

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    offset: {
      horizontal: '100px',
      vertical: '150px',
      mobile: {
        horizontal: '230px',
        vertical: '100px'
      }
    }
  }
};
</script>
```

##### Related settings

* [authenticate](#authenticate)
* [color](#color)
* [position](#position)
* [zIndex](#zindex)


#### originalArticleButton

Hides the "View Original Article" button.

##### Availability

* helpCenter

<a name="example-originalarticlebutton"></a>
##### Example

```html
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

##### Related settings

* [chatButton](#chatbutton)
* [filter](#filter)
* [messageButton](#messagebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)


#### position

Positions the Web Widget on the left side of the page instead of the right side, and on the upper side instead of the lower side. The `position` property consists of an object with `horizontal` and `vertical` properties. The possible value for `horizontal` is 'left' (the default is right). The possible value for `vertical` is 'top' (the default is bottom).

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    position: { horizontal: 'left', vertical: 'top' }
  }
};
</script>
```

##### Related settings

* [authenticate](#authenticate)
* [color](#color)
* [offset](#offset)
* [zIndex](#zindex)


#### searchPlaceholder

Replaces the placeholder text displayed in the Help Center search box that says "How can we help?"

##### Availability

* helpCenter

<a name="example-searchplaceholder"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    helpCenter: {
      searchPlaceholder: {
        '*': 'Search our Help Center',
        'fr': "Cherchez dans le centre d'aide"
      }
    }
  }
};
</script>
```

##### Related settings

* [chatButton](#chatbutton)
* [filter](#filter)
* [messageButton](#messagebutton)
* [originalArticleButton](#originalarticlebutton)
* [suppress](#suppress)
* [title](#title)


#### selectTicketForm

Replaces the text in the contact form that prompts the end user to select a ticket form when more than one form is available. See [ticketForms](#ticketforms). The default text is "Please select your issue".

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactForm

<a name="example-selectticketform"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      selectTicketForm: {
        '*': 'Please choose:'
      }
    }
  }
};
</script>
```

![image](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_select_form.png)

##### Related settings

* [attachments](#attachments)
* [fields](#fields)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)


#### subject

Inserts a Subject field in the contact form. The form doesn't have one by default to enhance the user experience and conserve space in the Web Widget.

##### Availability

* contactForm

<a name="example-subject"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      subject: true
    }
  }
};
</script>
```

##### Related settings

* [attachments](#attachments)
* [fields](#fields)
* [selectTicketForm](#selectticketform)
* [suppress](#suppress)
* [tags](#tags)
* [ticketForms](#ticketforms)
* [title](#title)


#### suppress

Suppresses the Help Center, Chat, or contact form in the Web Widget on that page.

##### Availability

* chat
* contactForm
* helpCenter
* talk

<a name="example-suppress"></a>
##### Example

```html
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


#### tags

Adds one or more [tags](https://support.zendesk.com/hc/en-us/articles/203662096-Using-tags) to any ticket created with the Web Widget.

Note: The tags are visible in the JavaScript console in the user's browser.

##### Availability

* contactForm

<a name="example-tags"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      tags: ['website', 'store']
    }
  }
};
</script>
```

##### Related settings

* [attachments](#attachments)
* [fields](#fields)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [ticketForms](#ticketforms)
* [title](#title)


#### ticketForms

Specifies one or more [ticket forms](https://support.zendesk.com/hc/en-us/articles/203661636) for the contact form. If you list more than one ticket form, a dropdown menu appears in the contact form prompting the end user to select a form. You can change the text that prompts the end user with the [selectTicketForm](#selectticketform) object.

Ticket forms are listed by id. Example:

```javascript
ticketForms: [
  {id: 426353},
  {id: 429981}
]
```

To get a ticket form id, see [List Ticket Forms](https://developer.zendesk.com/rest_api/docs/core/ticket_forms#list-ticket-forms) in the Zendesk API docs.

You can include the [fields](#fields) object to pre-populate one or more fields in one or more ticket forms. Example:

```javascript
ticketForms: [
 {
   id: 426353,
   fields: [
     {
        id: 'description',
        prefill: {
          '*': 'My field text'
        }
      }
    ]
  },
  ...
]
```

##### Availability

* contactForm

<a name="example-ticketforms"></a>
##### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    contactForm: {
      ticketForms: [
        { id: 426353 }
      ]
    }
  }
};
</script>
```

##### Related settings

* [attachments](#attachments)
* [fields](#fields)
* [selectTicketForm](#selectticketform)
* [subject](#subject)
* [suppress](#suppress)
* [tags](#tags)
* [title](#title)


#### title

Replaces the default title string with a custom string.

![example](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/ww_api_title.png)

You can use different strings for different locales or use one string for all locales by using an asterisk (\*) for the locale. You can also use the asterisk to specify a fallback string in case the browser isn't set to a listed locale.

##### Availability

* contactForm
* helpCenter

<a name="example-title"></a>
##### Example

```html
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


##### Related settings

* [chatButton](#chatbutton)
* [filter](#filter)
* [messageButton](#messagebutton)
* [originalArticleButton](#originalarticlebutton)
* [searchPlaceholder](#searchplaceholder)
* [suppress](#suppress)
* [title](#title)


#### zIndex

Specifies the stack order of the Widget on the page. When two elements overlap, the z-index values of the elements determine which one covers the other. An element with a greater z-index value covers an element with a smaller one.

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    zIndex: 999999
  }
};
</script>
```

##### Related settings

* [color](#color)
* [offset](#offset)
* [position](#position)

