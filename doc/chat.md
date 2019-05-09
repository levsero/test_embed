## Chat API

The Web Widget includes a chat component that lets users chat with an agent. The component is represented by the `chat` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/chatWidget.png" alt="Chat Component Example" width="250px">

### Settings

The `chat` object has the following settings:

* [suppress](./settings#suppress)

In the [integrated Chat in the Web Widget](https://support.zendesk.com/hc/en-us/articles/360022185074), the `chat` object has the following additional settings:

* [title](./settings#title)
* [badge](./settings#badge)
* [concierge](./settings#concierge)
* [departments](./settings#departments)
* [hideWhenOffline](./settings#hidewhenoffline)
* [navigation](./settings#navigation)
* [prechatForm](./settings#prechatForm)
* [offlineForm](./settings#offlineForm)
* [notifications](./settings#notifications)
* [tags](./settings#tags)
* [authenticate](./settings#authenticate)

<a name="example-chat-settings"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    chat: {
      suppress: false,
      tags: ['vip'],
      notifications: {
        mobile: {
          disable: true
        }
      }
    }
  }
};
</script>
```
**_NOTE:_** The Integrated Chat feature must be enabled in Zendesk Support under Admin > Channels > Widget > Customization tab for the `chat` API settings to work.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/adminIntegratedChat.png" alt="Integrated Chat toggle" width="250px">

### Commands

The Chat component has the following commands:

- [Chat API](#chat-api)
  - [Settings](#settings)
    - [Example](#example)
  - [Commands](#commands)
    - [chat:send](#chatsend)
      - [Parameters](#parameters)
      - [Example](#example-1)
    - [get chat:isChatting](#get-chatischatting)
      - [Parameters](#parameters-1)
      - [Return value](#return-value)
    - [get chat:department](#get-chatdepartment)
      - [Parameters](#parameters-2)
      - [Example](#example-2)
      - [Return value](#return-value-1)
    - [get chat:departments](#get-chatdepartments)
      - [Parameters](#parameters-3)
      - [Return value](#return-value-2)
      - [Example](#example-3)
    - [chat:end](#chatend)
      - [Parameters](#parameters-4)
    - [updatePath](#updatepath)
      - [Parameters](#parameters-5)
      - [Example](#example-4)
    - [on chat:connected](#on-chatconnected)
      - [Parameters](#parameters-6)
      - [Example](#example-5)
    - [on chat:start](#on-chatstart)
      - [Parameters](#parameters-7)
      - [Example](#example-6)
    - [on chat:end](#on-chatend)
      - [Parameters](#parameters-8)
      - [Example](#example-7)
    - [on chat:status](#on-chatstatus)
      - [Parameters](#parameters-9)
      - [Example](#example-8)
    - [on chat:departmentStatus](#on-chatdepartmentstatus)
      - [Parameters](#parameters-10)
      - [Example](#example-9)
    - [on chat:unreadMessages](#on-chatunreadmessages)
      - [Parameters](#parameters-11)
      - [Example](#example-10)
    - [popout](#popout)
      - [Parameters](#parameters-12)
      - [Example](#example-11)

#### chat:send

`zE('webWidget', 'chat:send', message<string>);`

Makes the visitor send a message. Starts a chat session if one is not already in progress.

##### Parameters

* `message`: String. Message to be sent

##### Example

```html
<script type="text/javascript">
zE('webWidget', 'chat:send', 'I\'d like the Jambalaya, please');
</script>
```


#### get chat:isChatting

`zE('webWidget:get', 'chat:isChatting');`

Checks whether a chat session is in progress.

##### Parameters

None

##### Return value

Boolean


#### get chat:department

`zE('webWidget:get', 'chat:department', department<int|string>);`

Returns an object containing information about the specified department, including its id, name and status. Otherwise returns `undefined` if the department is not found or not enabled.

##### Parameters

* `department`: Integer or string. ID or name of the department

##### Example

```html
<script type="text/javascript">
zE('webWidget:get', 'chat:department', 'Accounting');
</script>
```

##### Return value

* An object containing information about the specified department, including its id, name, and status
* Otherwise `undefined` if the department is not found or not enabled


#### get chat:departments

`zE('webWidget:get', 'chat:departments');`

Returns a list of all enabled departments containing information about each department including its `id`, `name` and `status`. Returns `undefined` if chat is not connected.

**NOTE:** This function should only be called after the widget is connected (see example).

##### Parameters

None

##### Return value

* An array of objects containing information about each department, including its `id`, `name`, and `status`.

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:connected', function() {
  const departments = zE('webWidget:get', 'chat:departments')
  departments.forEach((department) => { console.log(department) })
});
</script>
```

#### chat:end

`zE('webWidget', 'chat:end');`

Ends the current chat session.

##### Parameters

None


#### updatePath

`zE('webWidget', 'updatePath', options<object>);`

Programmatically updates the visitor’s webpath.

**Note**: Chat triggers set to run "when a visitor has loaded the chat widget" will be fired when the visitor path is changed.

##### Parameters

* `options`: Object (optional). If not specified, the current page’s location and title will be used; if specified, the updated page url and title will be taken from the options object

##### Example

```html
<script type="text/javascript">
// Without options
zE('webWidget', 'updatePath');

// With options
zE('webWidget', 'updatePath', {
  url: 'http://example.com',
  title: "Ready to rock'n'roll!"
});
</script>
```


#### on chat:connected

`zE('webWidget:on', 'chat:connected', callback<function>);`

Registers a callback to be fired when the widget successfully connects to the server.

##### Parameters

* `callback`: Function. The callback to perform on chat connection

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:connected', function() {
  console.log('successfully connected to Zendesk Chat!');
});
</script>
```


#### on chat:start

`zE('webWidget:on', 'chat:start', callback<function>);`

Registers a callback to be fired when a chat starts.

##### Parameters

* `callback`: Function. The callback to perform on chat start

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:start', function() {
  console.log('successfully started a Zendesk Chat!');
});
</script>
```


#### on chat:end

`zE('webWidget:on', 'chat:end', callback<function>);`

Registers a callback to be fired when a chat ends.

A chat only ends when the visitor (and not the agent) ends the chat, or when the visitor has been idle for an extended period of time.

##### Parameters

* `callback`: Function. The callback to perform on chat end

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:end', function() {
  console.log('successfully ended a Zendesk Chat session!');
});
</script>
```


#### on chat:status

`zE('webWidget:on', 'chat:status', function(status<string>) {});`

Registers a callback to be fired when the account status changes.

##### Parameters

* `callback`: Function. The callback to perform on account status change. Contains one parameter, `status`, a string that can be one of 'online'|'away'|'offline'

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:status', function(status) {
  console.log('This chat session is now', status);
});
</script>
```

#### on chat:departmentStatus

`zE('webWidget:on', 'chat:departmentStatus', function(department<object>) {});`

Registers a callback to be fired when a department status changes.

##### Parameters

* `callback`: Function. The callback to perform on each department status change. Contains one parameter, `department`, an object that contains the `name`, `id` and `status` of the changed department.

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:departmentStatus', function(dept) {
  console.log('department', dept.name, 'changed to', dept.status);
});
</script>
```


#### on chat:unreadMessages

`zE('webWidget:on', 'chat:unreadMessages', function(number<int>) {});`

Registers a callback to be fired when the number of unread messages changes.

##### Parameters

* `callback`: Function. The callback to perform on unread messages. Contains one parameter, `number`, an integer detailing the number of unread messages.

##### Example

```html
<script type="text/javascript">
zE('webWidget:on', 'chat:unreadMessages', function(number) {
  console.log(`It seems you have ${number} unread messages!`);
});
</script>
```

#### popout

`zE('webWidget', 'popout');`

Attempts to open the live chat widget in a new window on desktop.

May not work on some devices or configurations.

Important: Should only be called from a user event listener callback.  See example.

##### Parameters

None

##### Example

```html
<a href="javascript:void(zE('webWidget', 'popout'))">Open chat in new window</a>
```
