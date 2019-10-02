## Core API

Core settings and commands affect the entire widget.

### Settings

The Web Widget has the following core settings:

- [authenticate](./settings#authenticate)
- [color](./settings#color)
- [cookies](./settings#cookies)
- [offset](./settings#offset)
- [position](./settings#position)
- [zIndex](./settings#zindex)
- [contactOptions](#contactoptions)
- [launcher](#launcher)

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

#### contactOptions

The widget's `contactOptions` object, which represents a component that lets the user choose between starting a chat or submitting a ticket, has the following settings:

- enabled (Boolean)
- [contactButton](./settings#contactbutton)
- [chatLabelOnline](./settings#chatlabelonline)
- [chatLabelOffline](./settings#chatlabeloffline)
- [contactFormLabel](./settings#contactformlabel)

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/contactOptions.png" alt="Contact Options Example" width="250px">

To learn more about contact options, see [Offering end-users multiple contact options](https://support.zendesk.com/hc/en-us/articles/229167008#topic_spt_fb1_l1b) in the Support Help Center.

**Note:** `chatLabelOnline` and `contactFormLabel` applies to the contact options shown to the end user on the Answer Bot channel.
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

#### launcher

The widget's `launcher` object, which represents the launcher button, has the following settings:

- [chatLabel](./settings#chatlabel)
- [label](./settings#label)
- mobile
- [labelVisible](./settings#labelvisible)

<a name="example-launcher-settings"></a>

#### Example

```html
<script type="text/javascript">
  window.zESettings = {
    webWidget: {
      launcher: {
        chatLabel: {
          '*': 'Chat now'
        },
        mobile: {
          labelVisible: true
        }
      }
    }
  };
</script>
```

### Commands

The Web Widget has the following core commands:

- [clear](#clear)
- [close](#close)
- [get display](#get-display)
- [hide](#hide)
- [identify](#identify)
- [logout](#logout)
- [on open](#on-open)
- [on close](#on-close)
- [open](#open)
- [prefill](#prefill)
- [reset](#reset)
- [setLocale](#setlocale)
- [show](#show)
- [toggle](#toggle)
- [updatePath](#updatepath)
- [updateSettings](#updatesettings)

#### clear

`zE('webWidget', 'clear');`

Clears all forms in the Web Widget.

##### Parameters

None

#### close

`zE('webWidget', 'close');`

If the widget is opened, this command closes the widget and shows the launcher.

##### Parameters

None

#### get display

`zE('webWidget:get', 'display');`

Gets the current widget display. Depending on what you features you have enabled, you can use the command to display Help Center, Contact Form, Help Center, Chat, Talk, contact options, and Answer Bot.

#### hide

`zE('webWidget', 'hide');`

Hides all parts of the widget from the page. You can invoke it before or after page load.

##### Parameters

None

##### Example

Before page load:

```html
<script type="text/javascript">
  zE('webWidget', 'hide');
</script>
```

After page load:

```html
<button onclick="zE('webWidget', 'hide')">Hide Web Widget</button>
```

#### identify

`zE('webWidget', 'identify', data<object>);`

Identifies an end user to Zendesk.

If you have access to your end user's name and email, use this command to pass the details to your Zendesk Support account.

If the user's email doesn't already exist in your Zendesk Support account, a new user record with the details is created.

User record creation is queued and there might be a few minutes delay before the user record appears in your Zendesk Support account. However, during high API traffic periods, Identify API calls are throttled and might be dropped resulting in user records not being created.

Identify API calls are throttled in several ways to prevent API abuse:

- IP address: A limit to identify users on a single IP address.
- Limit the creation of user records per account: Up to 50,000 user records created daily by a Zendesk Support account.
- Payload: Throttled when a Zendesk Support account makes more than one API call using the same email address every 12 hours.

The Identify API call occurs when the widget loads. In the event that a ticket is submitted before a user record is created by the Identify API call, the details in the ticket are used for creating a user record.

**Note:**

- The Identify API call can only specify an organization when a user record is first created. It can't be used to modify organizations on existing user records.

- The Identify API only prepopulates the user's details in the Chat forms (Prechat, Chat Offline and Update Contact Details forms). To prefill all forms in any product configuration, please use [prefill](#prefill).

##### Parameters

- `data`: Object. Contains the properties `name`, `email`, and optional `organization`.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'identify', {
    name: 'Akira Kogane',
    email: 'akira@voltron.com',
    organization: 'Voltron, Inc.'
  });
</script>
```
**Note:** Passing an organization only works for existing organizations in your Zendesk Support account. It does not create a new organization.

#### logout

`zE('webWidget', 'logout');`

Clears an end user's session.

##### Parameters

None

#### on open

`zE('webWidget:on', 'open', callback<function>);`

Executes a callback when the widget is opened.

##### Parameters

- `callback`: Function. Contains the code to be executed.

##### Example

```html
<script type="text/javascript">
  zE('webWidget:on', 'open', function() {
    console.log('The widget has been opened!');
  });
</script>
```

#### on close

`zE('webWidget:on', 'close', callback<function>);`

Executes a callback when the widget is closed.

##### Parameters

- `callback`: Function. Contains the code to be executed.

##### Example

```html
<script type="text/javascript">
  zE('webWidget:on', 'close', function() {
    console.log('The widget has been closed!');
  });
</script>
```

#### open

`zE('webWidget', 'open');`

Forces the widget to open.

##### Parameters

None

#### prefill

`zE('webWidget', 'prefill', data<object>);`

Pre-fills an end-user's details on forms inside the Web Widget.

##### Parameters

- `data`: Object. Contains a `name`, `email` and `phone` objects.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'prefill', {
    name: {
      value: 'isamu',
      readOnly: true // optional
    },
    email: {
      value: 'isamu@voltron.com',
      readOnly: true // optional
    },
    phone: {
      value: '61431909749',
      readOnly: true // optional
    }
  });
</script>
```

#### reset

`zE('webWidget', 'reset');`

Completely resets the state of the widget. To preserve end-user experience, this API only functions when the widget is minimized.

##### Parameters

None

#### setLocale

`zE('webWidget', 'setLocale', data<string>);`

Sets the widget locale.

The command takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Web Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE('webWidget', 'setLocale', data<string>);` to specify the language.

**Note**: This code should be placed immediately after the Web Widget code snippet

##### Parameters

- `data`: String. The locale string to change the widget locale to.

##### Example

The following example displays the widget in German:

```html
<script type="text/javascript">
  zE('webWidget', 'setLocale', 'de');
</script>
```

#### show

`zE('webWidget', 'show');`

Displays the widget on the host page in the state it was in before it was hidden.

The widget is displayed by default on page load. You don't need to call `show` to display the widget unless you use `hide`.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'show');
</script>
```

#### toggle

`zE('webWidget', 'toggle');`

Opens the widget if it was closed, or closes the widget if it was opened.

##### Parameters

None

#### updatePath

`zE('webWidget', 'updatePath', data<object>);`

Updates the visitor path by setting the title to the current user's page title and url to the user's current url.

**Note**: This API also updates the path within Chat.

##### Parameters

- `data`: Object. This object accepts two optional string parameters `title` and `url`.

#### updateSettings

`zE('webWidget', 'updateSettings', data<object>);`

Updates the Web Widget's [zESettings](./settings). It can update multiple settings at once. However, it cannot update the [authenticate](./settings#authenticate) setting since authentication occurs during page load, not during Web Widget runtime.

##### Parameters

- `data`: Object. Matches the structure defined in [zESettings](./settings)

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'updateSettings', {
    webWidget: {
      chat: {
        departments: {
          enabled: ['finance', 'hr', 'sales'],
          select: 'sales'
        }
      }
    }
  });
</script>
```
