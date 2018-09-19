## Chat

The Web Widget includes a chat component that lets users chat with an agent. The component is represented by the `chat` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_chat_started.png" width="200">

### Commands

The Chat component has the following commands:

* send message
* get isChatting
* get departments:department
* get departments:all
* perform end
* perform updatePath
* on connected
* on start
* on end
* on status
* on unreadMessages

#### send chat:message

`zE('webWidget:send', 'chat:message', message<string>);`

Makes the visitor send a message. Starts a chat session if one is not already in progress.

##### Parameters

* `message`: String. Message to be sent

##### Example

```javascript
  zE('webWidget:send', 'chat:message', 'I\'d like the Jambalaya, please');
```


#### get chat:isChatting

`zE('webWidget:get', 'chat:isChatting');`

Checks whether a chat session is in progress.


##### Parameters

None

##### Return value

Boolean


#### get chat:departments:department

`zE('webWidget:get', 'chat:departments:department', department<int|string>);`

Returns an object containing information about the specified department, including its ID, name and status. Otherwise returns `undefined` if the department is not found or not enabled.

##### Parameters

* `department`: Integer or string. ID or name of the department

##### Example

```javascript
  zE('webWidget:get', 'chat:departments:department', 'Accounting');
```

##### Return value

* An object containing information about the specified department, including its id, name, and status
* Otherwise `undefined` if the department is not found or not enabled


#### get chat:departments:all

`zE('webWidget:get', 'chat:departments:all');`

Returns a list of all enabled departments containing information about each department including its id, name and status.

##### Parameters

None

##### Return value

* An array of objects containing information about each department, including its id, name, and status.


#### perform chat:end

`zE('webWidget:perform', 'chat:end');`

Ends the current chat session.

##### Parameters

None


#### perform updatePath

`zE('webWidget:perform', 'chat:visitor:path', options<object>);`

Programmatically updates the visitor’s webpath.

**Note**: Chat triggers set to run "when a visitor has loaded the chat widget" will be fired when the visitor path is changed.

##### Parameters

* `options`: Object (optional). If not specified, the current page’s location and title will be used; if specified, the updated page url and title will be taken from the options object

##### Example

```javascript
  // Without options
  zE('webWidget:perform', 'chat:updatePath');

  // With options
  zE('webWidget:perform', 'chat:updatePath' {
    url: 'http://example.com',
    title: "Ready to rock'n'roll!"
  });
```


#### on chat:connected

`zE('webWidget:on', 'chat:connected', callback<function>);`

Registers a callback to be fired when the widget successfully connects to the server.

##### Parameters

* `callback`: Function. The callback to perform on chat connection

##### Example

```javascript
  zE('webWidget:on', 'chat:connected', () => {
    console.log('successfully connected to Zendesk Chat!');
  });
```


#### on chat:start

`zE('webWidget:on', 'chat:start', callback<function>);`

Registers a callback to be fired when a chat starts.

##### Parameters

* `callback`: Function. The callback to perform on chat start

##### Example

```javascript
  zE('webWidget:on', 'chat:start', () => {
    console.log('successfully started a Zendesk Chat!');
  });
```


#### on chat:end

`zE('webWidget:on', 'chat:end', callback<function>);`

Registers a callback to be fired when a chat ends.

A chat only ends when the visitor (and not the agent) ends the chat, or when the visitor has been idle for an extended period of time.

##### Parameters

* `callback`: Function. The callback to perform on chat end

##### Example

```javascript
  zE('webWidget:on', 'chat:end', () => {
    console.log('successfully ended a Zendesk Chat session!');
  });
```


#### on chat:status

`zE('webWidget:on', 'chat:status', status<string>, callback<function>);`

Registers a callback to be fired when the account status changes. The callback will also be called once when this function is executed.

*Note*: The callback will also be called when a department’s status changes.

##### Parameters

* `status`: String. One of 'online'|'away'|'offline'
* `callback`: Function. The callback to perform on status

##### Example

```javascript
  zE('webWidget:on', 'chat:status', 'offline', () => {
    console.log('This chat session is now offline');
  });
```


#### on chat:unreadMessages

`zE('webWidget:on', 'chat:unreadMessages', (number<int>) => {});`

Registers a callback to be fired when the number of unread messages changes. The callback will also be called once when this function is executed.

##### Parameters

* `callback`: Function. The callback to perform on unread messages. Contains one parameter, `number`, an integer detailing the number of unread messages.

##### Example

```javascript
  zE('webWidget:on', 'chat:unreadMessages', (number) => {
    console.log(`It seems you have ${number} unread messages!`);
  });
```


### Settings

The `chat` object has the following settings:

* [suppress](#suppress)

It also has the following additional settings in the [integrated Web and Chat Widget](https://chat.zendesk.com/hc/en-us/articles/360001024128) (early access).

* [title](./settings#title)
* [concierge](./settings#concierge)
* [departments](./settings#departments)
* [prechatForm](./settings#prechatForm)
* [offlineForm](./settings#offlineForm)
* [notifications](./settings#notifications)
* [tags](./settings#tags)

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
        mobile: false
      }
    }
  }
};
</script>
```
