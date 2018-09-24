## Core

Core settings and commands affect the entire widget.


### Settings

The Web Widget has the following core settings:

* [authenticate](./settings#authenticate)
* [color](./settings#color)
* [offset](./settings#offset)
* [position](./settings#position)
* [zIndex](./settings#zindex)
* [contactOptions](#contactoptions)
* [launcher](#launcher)

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

#### Contact options settings

The widget's `contactOptions` object, which represents a component that lets the user choose between starting a chat or submitting a ticket, has the following settings:

* enabled (Boolean)
* [contactButton](./settings#contactbutton)
* [chatLabelOnline](./settings#chatlabelonline)
* [chatLabelOffline](./settings#chatlabeloffline)
* [contactFormLabel](./settings#contactformlabel)

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

#### Launcher settings

The widget's `launcher` object, which represents the launcher button, has the following settings:

* [chatLabel](./settings#chatlabel)
* [label](./settings#label)

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


### Commands

The Web Widget has the following core commands:

* [get isOpen](#get-isopen)
* [on show](#on-show)
* [on hide](#on-hide)
* [perform hide](#perform-hide)
* [perform show](#perform-show)
* [perform logout](#perform-logout)
* [perform identify](#perform-identify)
* [perform prefill](#perform-prefill)
* [perform setLocale](#perform-setlocale)
* [perform updateSettings](#perform-updatesettings)


#### get isOpen

`zE('webWidget:get', 'isOpen');`

Gets the current visibility of the widget.

##### Parameters

None

##### Return value

Boolean


#### on show

`zE('webWidget:on', 'show', callback<function>);`

Executes a callback when the widget is shown.

##### Parameters

* `callback`: Function. Contains the code to be exected

##### Example

```javascript
  zE('webWidget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
```


#### on hide

`zE('webWidget:on', 'hide', callback<function>);`

Executes a callback when the widget is hidden.

##### Parameters

* `callback`: Function. Contains the code to be executed

##### Example

```javascript
  zE('webWidget:on', 'hide', () => {
    console.log("The widget has been hidden!");
  });
```

#### perform hide

`zE('webWidget:perform', 'hide');`

Hides all parts of the Widget from the page. You can invoke it before or after page load.

##### Parameters

None

##### Example

**Before page load**

```html
<script>
  zE('webWidget:perform', 'hide');
</script>
```

**After page load**

```html
  <button onclick="zE('webWidget:perform', 'hide')">Hide Web Widget</button>
```


#### perform show

`zE('webWidget:perform', 'show');`

Displays the widget on the host page in the state it was in before it was hidden.

The widget is displayed by default on page load. You don't need to call `show` to display the widget unless you use `hide`.

##### Example

```html
<script>
  zE('webWidget:perform', 'show');
</script>
```


#### perform logout

[comment]: <> (Not sure about the 'perform' verb here. I've tried a few others)
[comment]: <> (i.e., execute, run, but can't find a better suiting one.)
[comment]: <> (The same applies for the other perform ones)

`zE('webWidget:perform', 'logout');`

Clears an end user's session.

##### Parameters

None


#### perform identify

`zE('webWidget:perform', 'identify', data<object>);`

Identifies an end user to Zendesk.

If you have access to your end user's name and email, use this command to pass the details to your Zendesk Support account.

If the user's email doesn't already exist in your Zendesk Support account, a new user record with the details is created.

The Widget also uses the information to pre-populate the contact or pre-chat chat form.

##### Parameters

* `data`: Object. Contains a `name`, `email` and optionally, `organization` property

##### Example

```javascript
  zE('webWidget:perform', 'identify', {
    name: 'Akira Kogane',
    email: 'akira@voltron.com',
    organization: 'Voltron, Inc.'
  });
```

*Note*: Passing an organization only works for existing organizations in your Zendesk Support account. It does not create a new organization.


#### perform prefill

`zE('webWidget:perform', 'prefill', data<object>);`

Pre-fills an end-user's details on forms inside the Web Widget.

##### Parameters

* `data`: Object. Contains a `name` and `email`.

##### Example

```javascript
  zE('webWidget:perform', 'prefill', {
    name: 'Isamu Kurogane',
    email: 'isamu@voltron.com',
  });
```

#### perform setLocale

`zE('webWidget:setLocale', data<string>);`

Sets the widget locale.

The command takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Web Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE.setLocale()` to specify the language.

The following example displays the widget in German:

**Note**: This code should be placed immediately after the Web Widget code snippet

##### Parameters

* `data`: String. The locale string to change the widget locale too

##### Example

```javascript
  zE('webWidget:perform', 'setLocale', 'de');
```


#### perform updateSettings

`zE('webWidget:perform', 'updateSettings', data<object>);`

Updates the Web Widget's [zESettings](./settings). Can update multiple settings at once.

##### Parameters

* `data`: Object. Matches the structue defined in [zESettings](./settings)

##### Example

```javascript
  zE('webWidget:perform', 'updateSettings', {
    webWidget: {
      chat: {
        departments: {
          enabled: ['finance', 'hr', 'sales'],
          selected: 'sales'
        }
      }
    }
  });
```
