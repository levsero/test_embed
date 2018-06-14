# Zendesk zE() Queue API for the Web Widget

As the Web Widget integrates more services, channels and features, we've focused on designing a consistent and coherent API, using a callback queue that ensures commands are executed after the widget has loaded on a given page.

Note that to start using this API, you will need to embed the widget using the new snippet, which can be found on the Widget's setup page.

All commands follow a basic syntax:

```JavaScript
zE('web_widget:<action>', '<event|property>', <parameters>);
```

## Example

```JavaScript
  zE('web_widget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
```

## General Commands

#### get isOpen

Get the current visibility of the widget.

```JavaScript
zE('web_widget:get', 'isOpen');
```

##### Parameters

None

##### Return value

Boolean

---

#### on show

Executes a callback when the widget is shown.

```JavaScript
zE('web_widget:on', 'show', callback<function>);
```

##### Parameters

* `callback`: Function. Contains the code to be exected

##### Example

```JavaScript
  zE('web_widget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
```

---

#### on hide

Executes a callback when the widget is hidden.

```JavaScript
zE('web_widget:on', 'show', callback<function>);
```

##### Parameters

* `callback`: Function. Contains the code to be exected

##### Example

```JavaScript
  zE('web_widget:on', 'hide', () => {
    console.log("The widget has been hidden!");
  });
```

---

#### perform logout

[comment]: <> (Not sure about the 'perform' verb here. I've tried a few others)
[comment]: <> (i.e., execute, run, but can't find a better suiting one.)
[comment]: <> (The same applies for the other perform ones)

Clears an end-user's session.

```JavaScript
  zE('web_widget:perform', 'logout');
```

##### Parameters

None

---

#### perform identify

zE('web_widget:perform', 'identify', data<hash>);

Identifies an end-user to Zendesk.

If you have access to your end user's name and email use perform identify to pass the details their details to your Zendesk Support account.

If the user's email doesn't already exist in your Zendesk Support account, a new user record with those details is created.

The Widget also uses the information to pre-populate the contact or pre-chat chat form.

##### Parameters

* `data`: Hash. Contains a `name`, `email` and optionally, `organization` property

##### Example

```JavaScript
  zE('web_widget:perform', 'identify', {
    name: 'Akira Kogane',
    email: 'akira@voltron.com',
    organization: 'Voltron, Inc.'
  });
```
*Note*: Passing an organization only works for existing organizations in your Zendesk Support account. It does not create a new organization.

---

#### perform prefill

zE('web_widget:perform', 'prefill', data<hash>);

Pre-fills an end-user's details on forms inside the Web Widget.

##### Parameters

* `data`: Hash. Contains a `name`, and `email`.

##### Example

```JavaScript
  zE('web_widget:perform', 'identify', {
    name: 'Isamu Kurogane',
    email: 'isamu@voltron.com',
  });
```
---

## Channel-Specific Commands

### Chat

#### set chat:title

Set the title of the chat window.

```JavaScript
  zE('web_widget:set', 'chat:title', title<string>);
```

##### Parameters

* `title`: String. The title of the chat window

##### Example

```JavaScript
  zE('web_widget:set', 'chat:title', "Acme Inc. Support");
```

---

#### set chat:tags

Add tags to the current chat session.
*Note*: All tags are converted to lowercase.

```JavaScript
  zE('web_widget:set', 'chat:tags', tag1 [,tag2, ...]);
```

##### Parameters

* `tag1`: String. A single tag, or
* `[tag1, tag2, ...]`: Array of strings. Multiple tags

##### Example

```JavaScript
  zE('web_widget:set', 'chat:tags', ['vip', 'customer', 'support']);
```
---

#### remove chat:tags

Remove tag(s) from the current chat session.

```JavaScript
  zE('web_widget:remove', 'chat:tags', tag1 [,tag2, ...]);
```

##### Parameters

* `tag1`: String. A single tag, or
* `[tag1, tag2, ...]`: Array of strings. Multiple tags

##### Example

```JavaScript
  zE('web_widget:remove', 'chat:tags', ['vip', 'enterprise']);
```
---

#### send chat:message

Make the visitor send a message.  Starts a chat session if one is not already in progress.

```JavaScript
  zE('web_widget:send', 'chat:message', message<string>);
```

##### Parameters

* `message`: String. Message to be sent

##### Example

```JavaScript
  zE('web_widget:send', 'chat:message', 'I\'d like the Jambalaya, please');
```
---

#### get chat:isChatting

Checks whether a chat session is in progress.

```JavaScript
  zE('web_widget:get', 'chat:isChatting');
```

##### Parameters

None

##### Return value

Boolean

---

#### perform chat:end

zE('web_widget:perform', 'chat:end');

End the current chat session.

##### Parameters

None

---

#### on chat:connected

Register a callback to be fired when the widget successfully connects to the server.

```JavaScript
  zE('web_widget:on', 'chat:connected', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat connection

##### Example

```JavaScript
  zE('web_widget:on', 'chat:connected', () => {
    console.log('successfully connected to Zendesk Chat!');
  });
```
---


#### on chat:start

Register a callback to be fired when a chat starts.


```JavaScript
  zE('web_widget:on', 'chat:start', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat start

##### Example

```JavaScript
  zE('web_widget:on', 'chat:start', () => {
    console.log('successfully started a Zendesk Chat!');
  });
```
---


#### on chat:end

Register a callback to be fired when a chat ends.

A chat only ends when the visitor (and not the agent) ends the chat, or when the visitor has been idle for an extended period of time.

```JavaScript
  zE('web_widget:on', 'chat:end', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat end

##### Example

```JavaScript
  zE('web_widget:on', 'chat:end', () => {
    console.log('successfully ended a Zendesk Chat session!');
  });
```
---

#### on chat:status

Register a callback to be fired when the account status changes.  The callback will also be called once when this function is executed.

*Note*: The callback will also be called when a department’s status changes.

```JavaScript
  zE('web_widget:on', 'chat:status', status<string>, callback<function>);
```

##### Parameters

* `status`: String. One of 'online'|'away'|'offline'
* `callback`: Function. The callback to perform on status

##### Example

```JavaScript
  zE('web_widget:on', 'chat:status', 'offline', () => {
    console.log('This chat session is now offline');
  });
```
---


#### on chat:unreadMessages

Register a callback to be fired when the number of unread messages changes.  The callback will also be called once when this function is executed.

```JavaScript
  zE('web_widget:on', 'chat:unreadMessages', (number<int>) => {});
```

##### Parameters

* `callback`: Function. The callback to perform on unread messages. Contains one parameter, `number`, an integer detailing the number of unread messages.

##### Example

```JavaScript
  zE('web_widget:on', 'chat:unreadMessages', (number) => {
    console.log(`It seems you have ${number} undead messages!`);
  });
```
---

### Chat Departments

#### set chat:departments
[comment]: <> (This is meant to be used for zopim's departments.filter)
[comment]: <> (It seemed to me that `set` was clearer as a verb for this)
[comment]: <> (but I'm on the fence. We could also use 'web_widget:filter', 'chat:departments')
[comment]: <> (but I'm on the fence.)
[comment]: <> (We could also use 'web_widget:filter', 'chat:departments')

Display only the specified departments in the pre-chat form. All other departments will be hidden regardless of their status.

Department names are matched in a case-insensitive manner.

Passing in no additional parameters causes all departments to be displayed.  If none of department names or IDs passed in are valid (e.g. an empty string is passed in), the department dropdown menu will be hidden.

```JavaScript
  zE('web_widget:set', 'chat:departments', department1<int|string> [,department2<int|string>, ...]);
```

##### Parameters

* `department1`: String or integer. A single department, either by name or ID, or
* `[department1, department2, ...]`: Array of strings or integers. Multiple departments by name or ID

##### Example

```JavaScript
  zE('web_widget:set', 'chat:departments', ['finance', 'hr', 'sales']);
```
---

#### set chat:departments:label

Set the department label.

```JavaScript
  zE('web_widget:set', 'chat:departments:label', label<string>);
```

##### Parameters

* `label`: String. Label for department selection

##### Example

```JavaScript
  zE('web_widget:set', 'chat:departments:label', 'Select a department');
```
---

#### set chat:departments:visitorDepartment

Set the visitor’s default department for the current session.

Chat requests will be routed to this department unless the visitor selects another department in the pre-chat form or the department is offline.

*Note*: If the visitor has already started chatting, changes to the default department will not affect the department of the started chat. The changes to the default department will also not take effect until a page change or refresh. The department of the started chat will persist and be taken as the default department until a page change or refresh, even when the visitor has explicitly ended the chat.

Offline messages will also be routed to this department.

```JavaScript
  zE('web_widget:set', 'chat:departments:visitorDepartment', department<int|string>);
```

##### Parameters

* `department`: Integer or String. ID or name of the department to be set

##### Example

```JavaScript
  zE('web_widget:set', 'chat:departments:visitorDepartment', 'Sales');
```
---

#### clear chat:departments:visitorDepartment

Clear the visitor’s default department.

*Note*: If the visitor has already started chatting, changes to the default department will not affect the department of the started chat. The changes to the default department will also not take effect until a page change or refresh. The department of the started chat will persist and be taken as the default department until a page change or refresh, even when the visitor has explicitly ended the chat.


```JavaScript
  zE('web_widget:clear', 'chat:departments:visitorDepartment');
```

##### Parameters

None

#### get chat:departments:department

Return an object containing information about the specified department, including its ID, name and status. Return undefined if the department is not found or not enabled.

```JavaScript
  zE('web_widget:get', 'chat:departments:department', department<int|string>);
```

##### Parameters

* `department`: Integer or String. ID or name of the department

##### Example

```JavaScript
  zE('web_widget:get', 'chat:departments:department', 'Accounting');
```

##### Return value

* An object containing information about the specified department, including its id, name and status.
* `undefined` if the department is not found or not enabled.

---

#### get chat:departments:all

Return a list of all enabled departments containing information about each department including its id, name and status.

```JavaScript
  zE('web_widget:get', 'chat:departments:all');
```

##### Parameters

None

##### Return value

* An array of objects containing information about each department, including its id, name and status.

---


### Chat Concierge

#### set chat:concierge:avatar

Set the concierge’s avatar.


```JavaScript
  zE('web_widget:set', 'chat:concierge:avatar', path<string>);
```

##### Parameters

* `path`: String. Contains the avatar's full path

##### Example

```JavaScript
  zE('web_widget:set', 'chat:concierge:avatar', 'https://example.com/img/avatar.jpg');
```
---

#### set chat:concierge:name

Set the concierge’s name.


```JavaScript
  zE('web_widget:set', 'chat:concierge:name', name<string>);
```

##### Parameters

* `name`: String. Contains the concierge's name

##### Example

```JavaScript
  zE('web_widget:set', 'chat:concierge:name', 'Jane Doe');
```
---

#### set chat:concierge:title

Set the concierge’s title.


```JavaScript
  zE('web_widget:set', 'chat:concierge:title', title<string>);
```

##### Parameters

* `title`: String. Contains the concierge's title

##### Example

```JavaScript
  zE('web_widget:set', 'chat:concierge:title', 'Live Support');
```
---

### Chat Prechat

#### set chat:prechat:greetings

Set the greeting messages displayed on the chat button for each status on the desktop widget.

Status can be "online" or "offline".


```JavaScript
  zE('web_widget:set', 'chat:prechat:greetings', greetings<hash>);
```

##### Parameters

* `greetings`: Hash. May contain keys for 'offline' and 'online'

##### Example

```JavaScript
  zE('web_widget:set', 'chat:prechat:greetings', {
    online: 'Chat with us',
    offline: 'Leave us a message'
  });
```
---

### Chat Offline

#### set chat:offline:greeting

Set the greeting message displayed on the offline form.

```JavaScript
  zE('web_widget:set', 'chat:offline:greetings', greeting<string>);
```

##### Parameters

* `greeting`: String. Contains the greeting for the offline form

##### Example

```JavaScript
  zE('web_widget:set', 'chat:offline:greeting', "We're currently offline. Please leave us a message");
```
---


### Chat Visitor

#### set chat:visitor:path

Programmatically update visitor’s webpath.

Note: Chat triggers set to run "when a visitor has loaded the chat widget" will be fired when the visitor path is changed.

```JavaScript
  zE('web_widget:set', 'chat:visitor:path', options<hash>?);
```

##### Parameters

* `options`: Hash (optional). If not specified, the current page’s location and title will be used; if specified, the updated page url and title will be taken from the options object

##### Example

```JavaScript
  // Without options
  zE('web_widget:set', 'chat:visitor:path');

  // With options
  zE('web_widget:set', 'chat:visitor:path', {
    url: 'http://example.com',
    title: "Ready to rock'n'roll!"
  });
```
---


### Chat Mobile

#### set chat:mobile:notifications

Disable/enable the showing of mobile notifications. This method should be called on every page that notifications should be disabled, as they are enabled by default.

Note: the mobile notifications feature is mobile overlay mode only.


```JavaScript
  zE('web_widget:set', 'chat:mobile:notifications', enabled<boolean>);
```

##### Parameters

* `enabled`: Boolean. The desired state for mobile notifications

##### Example

```JavaScript
  zE('web_widget:set', 'chat:mobile:notifications', false);
```
---































zE('web_widget:get', 'isOpen');



