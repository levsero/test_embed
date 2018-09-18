# zE() API for the Web Widget

As the Web Widget integrates more services, channels and features, we've focused on designing a consistent and coherent API that allows interacting with a wide range of Zendesk channels inside the widget.

**Note**: To start using this API, you will need to embed the widget using the new snippet, which can be found on the Widget's setup page.

**Note**: If you're looking for the Widget code for your pages, you can get it from the admin pages of your Zendesk Support account. After signing in to your Zendesk Support account, click the Admin icon (![icon](https://zen-marketing-documentation.s3.amazonaws.com/docs/en/manage_icon.png)) in the sidebar and select **Channels** >  **Widget**.

For more information on setting up the Web Widget, this [support article](https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website) will guide you through your setup.

All commands follow a basic syntax:

```JavaScript
  zE('webWidget:<action>', '<event|property>', <parameters>);
```

## Example

```JavaScript
  zE('webWidget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
```

## General Commands

#### get isOpen

Get the current visibility of the widget.

```JavaScript
  zE('webWidget:get', 'isOpen');
```

##### Parameters

None

##### Return value

Boolean

---

#### on show

Executes a callback when the widget is shown.

```JavaScript
  zE('webWidget:on', 'show', callback<function>);
```

##### Parameters

* `callback`: Function. Contains the code to be exected

##### Example

```JavaScript
  zE('webWidget:on', 'show', () => {
    console.log("The widget has been shown!");
  });
```

---

#### on hide

Executes a callback when the widget is hidden.

```JavaScript
  zE('webWidget:on', 'hide', callback<function>);
```

##### Parameters

* `callback`: Function. Contains the code to be exected

##### Example

```JavaScript
  zE('webWidget:on', 'hide', () => {
    console.log("The widget has been hidden!");
  });
```

---

#### perform hide

The method completely hides all parts of the Widget from the page. You can invoke it before or after page load.

```JavaScript
  zE('webWidget:perform', 'hide');
```

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

```JavaScript
  zE('webWidget:perform', 'show');
```

The method displays the Widget on the host page in the state it was in when it was hidden.

```html
<script>
  zE('webWidget:perform', 'show');
</script>
```

Note: The widget will be displayed by default on page load when the Web Widget code snippet is present. You do not need to call `show` to display the widget unless `hide` is used.

---

#### perform logout

[comment]: <> (Not sure about the 'perform' verb here. I've tried a few others)
[comment]: <> (i.e., execute, run, but can't find a better suiting one.)
[comment]: <> (The same applies for the other perform ones)

Clears an end-user's session.

```JavaScript
  zE('webWidget:perform', 'logout');
```

##### Parameters

None

---

#### perform identify

zE('webWidget:perform', 'identify', data<hash>);

Identifies an end-user to Zendesk.

If you have access to your end-user's name and email use perform identify to pass the details to your Zendesk Support account.

If the user's email doesn't already exist in your Zendesk Support account, a new user record with those details is created.

The Widget also uses the information to pre-populate the contact or pre-chat chat form.

##### Parameters

* `data`: Hash. Contains a `name`, `email` and optionally, `organization` property

##### Example

```JavaScript
  zE('webWidget:perform', 'identify', {
    name: 'Akira Kogane',
    email: 'akira@voltron.com',
    organization: 'Voltron, Inc.'
  });
```
*Note*: Passing an organization only works for existing organizations in your Zendesk Support account. It does not create a new organization.

---

#### perform prefill

zE('webWidget:perform', 'prefill', data<hash>);

Pre-fills an end-user's details on forms inside the Web Widget.

##### Parameters

* `data`: Hash. Contains a `name`, and `email`.

##### Example

```JavaScript
  zE('webWidget:perform', 'prefill', {
    name: 'Isamu Kurogane',
    email: 'isamu@voltron.com',
  });
```
---

#### perform setLocale

zE('webWidget:setLocale', data<string>);

The method takes a locale string as an argument. For a list of supported locales and associated codes, see <https://support.zendesk.com/api/v2/rosetta/locales/public.json>.

By default, the Web Widget is displayed to the end user in a language that matches the browser header of their web browser. If you want to force the Widget to be displayed in a specific language on your website, you can use `zE.setLocale()` to specify the language.

The following example displays the widget in German:

**Note**: This code should be placed immediately after the Web Widget code snippet

##### Parameters

* `data`: String. The locale string to change the widget locale too

##### Example

```JavaScript
  zE('webWidget:perform', 'setLocale', 'de');
```
---

#### perform updateSettings

zE('webWidget:updateSettings', data<hash>);

Updates the Web Widget's [zESettings](https://developer.zendesk.com/embeddables/docs/widget/zesettings). Can update multiple settings at once.

##### Parameters

* `data`: Hash. Matches the structue defined in [zESettings](https://developer.zendesk.com/embeddables/docs/widget/zesettings)

##### Example

```JavaScript
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
---


### Chat

#### send chat:message

Make the visitor send a message.  Starts a chat session if one is not already in progress.

```JavaScript
  zE('webWidget:send', 'chat:message', message<string>);
```

##### Parameters

* `message`: String. Message to be sent

##### Example

```JavaScript
  zE('webWidget:send', 'chat:message', 'I\'d like the Jambalaya, please');
```
---

#### get chat:isChatting

Checks whether a chat session is in progress.

```JavaScript
  zE('webWidget:get', 'chat:isChatting');
```

##### Parameters

None

##### Return value

Boolean

---

#### perform chat:end

zE('webWidget:perform', 'chat:end');

End the current chat session.

##### Parameters

None

---

#### on chat:connected

Register a callback to be fired when the widget successfully connects to the server.

```JavaScript
  zE('webWidget:on', 'chat:connected', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat connection

##### Example

```JavaScript
  zE('webWidget:on', 'chat:connected', () => {
    console.log('successfully connected to Zendesk Chat!');
  });
```
---


#### on chat:start

Register a callback to be fired when a chat starts.


```JavaScript
  zE('webWidget:on', 'chat:start', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat start

##### Example

```JavaScript
  zE('webWidget:on', 'chat:start', () => {
    console.log('successfully started a Zendesk Chat!');
  });
```
---


#### on chat:end

Register a callback to be fired when a chat ends.

A chat only ends when the visitor (and not the agent) ends the chat, or when the visitor has been idle for an extended period of time.

```JavaScript
  zE('webWidget:on', 'chat:end', callback<function>);
```

##### Parameters

* `callback`: Function. The callback to perform on chat end

##### Example

```JavaScript
  zE('webWidget:on', 'chat:end', () => {
    console.log('successfully ended a Zendesk Chat session!');
  });
```
---

#### on chat:status

Register a callback to be fired when the account status changes.  The callback will also be called once when this function is executed.

*Note*: The callback will also be called when a department’s status changes.

```JavaScript
  zE('webWidget:on', 'chat:status', status<string>, callback<function>);
```

##### Parameters

* `status`: String. One of 'online'|'away'|'offline'
* `callback`: Function. The callback to perform on status

##### Example

```JavaScript
  zE('webWidget:on', 'chat:status', 'offline', () => {
    console.log('This chat session is now offline');
  });
```
---


#### on chat:unreadMessages

Register a callback to be fired when the number of unread messages changes.  The callback will also be called once when this function is executed.

```JavaScript
  zE('webWidget:on', 'chat:unreadMessages', (number<int>) => {});
```

##### Parameters

* `callback`: Function. The callback to perform on unread messages. Contains one parameter, `number`, an integer detailing the number of unread messages.

##### Example

```JavaScript
  zE('webWidget:on', 'chat:unreadMessages', (number) => {
    console.log(`It seems you have ${number} unread messages!`);
  });
```
---

### Chat Departments

#### set chat:departments:label

Set the department label.

```JavaScript
  zE('webWidget:set', 'chat:departments:label', label<string>);
```

##### Parameters

* `label`: String. Label for department selection

##### Example

```JavaScript
  zE('webWidget:set', 'chat:departments:label', 'Select a department');
```
---

#### get chat:departments:department

Return an object containing information about the specified department, including its ID, name and status. Otherwise return `undefined` if the department is not found or not enabled.

```JavaScript
  zE('webWidget:get', 'chat:departments:department', department<int|string>);
```

##### Parameters

* `department`: Integer or String. ID or name of the department

##### Example

```JavaScript
  zE('webWidget:get', 'chat:departments:department', 'Accounting');
```

##### Return value

* An object containing information about the specified department, including its id, name and status.
* Otherwise `undefined` if the department is not found or not enabled.

---

#### get chat:departments:all

Return a list of all enabled departments containing information about each department including its id, name and status.

```JavaScript
  zE('webWidget:get', 'chat:departments:all');
```

##### Parameters

None

##### Return value

* An array of objects containing information about each department, including its id, name and status.

---

### Chat Visitor

#### updatePath

Programmatically update visitor’s webpath.

Note: Chat triggers set to run "when a visitor has loaded the chat widget" will be fired when the visitor path is changed.

```JavaScript
  zE('webWidget:set', 'chat:visitor:path', options<hash>?);
```

##### Parameters

* `options`: Hash (optional). If not specified, the current page’s location and title will be used; if specified, the updated page url and title will be taken from the options object

##### Example

```JavaScript
  // Without options
  zE('webWidget:updatePath');

  // With options
  zE('webWidget:updatePath', {
    url: 'http://example.com',
    title: "Ready to rock'n'roll!"
  });
```
---

### Help Center

#### perform setSuggestions

```JavaScript
  zE('webWidget:perform', 'helpCenter:setSuggestions', options<hash>);
```

The method enhances the contextual help provided by the Web Widget.

##### Parameters

* `{ url: true }` - In single-page apps, sets the query parameters in the URL as search terms without requiring the end user to refresh the page. This function should be called each time you want to set the suggestions. For example, navigating on a single-page app.

* `{ search: 'search string' }` - Searches the Help Center for the specified search string. If results are found, displays the results as top suggestions when users click the Web Widget.

* `{ labels: ['label1'] }` -  For Guide Professional customers who use Help Center labels, searches the Help Center for articles with the given labels. If results are found, displays the results as top suggestions when users click the Web Widget.

**Note**: If you pass both search strings and labels, the labels are ignored.

#### Usage

Add the method in your HTML source code immediately after your Web Widget code snippet. Example:

```html
<script>
  zE('webWidget:perform', 'helpCenter:setSuggestions', { search: 'credit card' });
</script>
```

The `zE.setHelpCenterSuggestions()` method can be called multiple times, which can be useful in a single-page application.
---
