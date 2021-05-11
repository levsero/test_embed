## Chat API

The Web Widget includes a chat component that lets users chat with an agent. The component is represented by the `chat` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/chatWidget.png" alt="Chat Component Example" width="250px">

### Settings

The `chat` object has the following settings:

- [suppress](./settings#suppress)
- [title](./settings#title)
- [badge](./settings#badge)
- [concierge](./settings#concierge)
- [connectOnPageLoad](./settings#connectOnPageLoad)
- [departments](./settings#departments)
- [hideWhenOffline](./settings#hidewhenoffline)
- [menuOptions](./settings#menuoptions)
- [navigation](./settings#navigation)
- [prechatForm](./settings#prechatform)
- [profileCard](./settings#profilecard)
- [offlineForm](./settings#offlineform)
- [notifications](./settings#notifications)
- [authenticate](./settings#authenticate)

The integrated Chat experience is enabled in Zendesk Support under **Admin** > **Channels** > **Widget** and turning the Chat toggle on. If you're not a Support admin, ask one to enable it for you.

<a name="example-chat-settings"></a>

#### Example

```html
<script type="text/javascript">
  window.zESettings = {
    webWidget: {
      chat: {
        suppress: false,
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

### Commands

The chat component has the following commands:

- [chat:send](#chatsend)
- [get chat:isChatting](#get-chatischatting)
- [get chat:department](#get-chatdepartment)
- [get chat:departments](#get-chatdepartments)
- [chat:end](#chatend)
- [updatePath](#updatepath)
- [on chat:connected](#on-chatconnected)
- [on chat:start](#on-chatstart)
- [on chat:end](#on-chatend)
- [on chat:status](#on-chatstatus)
- [on chat:departmentStatus](#on-chatdepartmentstatus)
- [on chat:unreadMessages](#on-chatunreadmessages)
- [popout](#popout)
- [on chat:popout](#on-chatpopout)
- [chat:addTags](#chataddtags)
- [chat:removeTags](#chatremovetags)
- [chat:reauthenticate](#chatreauthenticate)

#### chat:send

`zE('webWidget', 'chat:send', message<string>);`

Makes the visitor send a message. Starts a chat session if one is not already in progress.

##### Parameters

- `message`: String. Message to be sent

Passing non-string types results in an error. No message is sent.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'chat:send', "I'd like the Jambalaya, please");
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

Returns an object containing information about the specified department, including its `id`, `name`, and `status`. Otherwise returns `undefined` if the department is not found or not enabled.

**Note**: This function should only be called after the widget is connected. See the examples.

##### Parameters

- `department`: Integer or string. Id or name of the department

Any other input types will return `undefined`.

##### Examples

```html
<script type="text/javascript">
  zE('webWidget:on', 'chat:connected', function() {
    const department = zE('webWidget:get', 'chat:department', 'Accounting');
    console.log(department);
  });
</script>
```

```html
<script type="text/javascript">
  zE('webWidget:on', 'chat:connected', function() {
    const department = zE('webWidget:get', 'chat:department', 5);
    console.log(department);
  });
</script>
```

##### Return value

- An object containing information about the specified department, including its id, name, and status
- Otherwise `undefined` if the department is not found or not enabled

#### get chat:departments

`zE('webWidget:get', 'chat:departments');`

Returns a list of all enabled departments containing information about each department including its `id`, `name`, and `status`. Returns `undefined` if chat is not connected.

**Note**: This function should only be called after the widget is connected. See the example.

##### Parameters

None

##### Return value

- An array of objects containing information about each department, including its `id`, `name`, and `status`.

##### Example

```html
<script type="text/javascript">
  zE('webWidget:on', 'chat:connected', function() {
    const departments = zE('webWidget:get', 'chat:departments');
    departments.forEach(department => {
      console.log(department);
    });
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

Programmatically updates the visitor’s web path.

**Note**: Chat triggers set to run "when a visitor has loaded the chat widget" will be fired when the visitor path is changed.

##### Parameters

- `options`: Object (optional). An object with two keys: `url` (for the URL of the page) and `title` (to set the page's title). If not specified or invalid, the location and title of the current page will be used.

If passed non-object types or objects with other keys, the chat reverts back to using the location and title of the current page.

##### Examples

```html
<script type="text/javascript">
  // Without options
  zE('webWidget', 'updatePath');
</script>
```

```html
<script type="text/javascript">
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

- `callback`: Function. The callback to perform on chat connection

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

- `callback`: Function. The callback to perform on chat start

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

- `callback`: Function. The callback to perform on chat end

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

- `callback`: Function. The callback to perform on account status change. Contains one parameter, `status`, a string that can be one of 'online'|'away'|'offline'

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

- `callback`: Function. The callback to perform on each department status change. Contains one parameter, `department`, an object that contains the `name`, `id` and `status` of the changed department.

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

- `callback`: Function. The callback to perform on unread messages. Contains one parameter, `number`, an integer detailing the number of unread messages.

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
The popout command functions when the Chat status is "online".
It may not work on some devices or configurations.

**Important**: This command should only be called from a user event listener callback. See example.

##### Parameters

None

##### Example

```html
<a href="javascript:void(zE('webWidget', 'popout'))">Open chat in new window</a>
```

#### on chat:popout

`zE('webWidget:on', 'chat:popout', callback<function>);`

Registers a callback to be performed when a chat pop-out window is opened.

##### Parameters

- `callback`: Function. The callback to perform when a chat pop-out window is opened.

##### Example

```html
<script type="text/javascript">
  zE('webWidget:on', 'chat:popout', function() {
    console.log('Live chat widget has been opened in another window.');
  });
</script>
```

#### chat:addTags

`zE('webWidget', 'chat:addTags', tags<array<string>>);`

Add tags to a given chat session to provide extra context.

##### Parameters

- `tags`: Array<String>. Tags to add to a given chat session. They should not contain any spaces or special characters except for underscores or hyphens. Note that the API also supports providing tags as separate string arguments. 

Passing non-string types results in an error. No message is sent.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'chat:addTags', ['help center', 'change password']);
  zE('webWidget', 'chat:addTags', 'help center', 'change password'); // separate string arguments
</script>
```

#### chat:removeTags

`zE('webWidget', 'chat:removeTags', tags<array<string>>);`

Remove tags from a given chat session.

##### Parameters

- `tags`: Array<String>. Tags to remove from a given chat session. Note that the API also supports providing tags as separate string arguments (see example below).

Passing non-string types results in an error. No message is sent.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'chat:removeTags', ['help center', 'change password']);
  zE('webWidget', 'chat:removeTags', 'help center', 'change password'); // separate string arguments
</script>
```

#### chat:reauthenticate

`zE('webWidget', 'chat:reauthenticate');`

Reauthenticate users during a session. This API is particularly useful in these cases:

- Signing in a new user during an anonymous session without reloading the page.
- Signing in a new user user after a previous user has logged out without reloading the page.

**Note**: The API only applies authentication if the `jwtFn` is provided. Please see [authenticate](./settings#authenticate) settings for more details.

##### Example

```html
<script type="text/javascript">
  zE('webWidget', 'chat:reauthenticate');
</script>
```
