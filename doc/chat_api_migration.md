## Migrating from the Chat Widget syntax to the unified Web Widget syntax

We aliased the vast majority of the legacy `$zopim.livechat` APIs so they'll continue to work without the need to update any code.  To see which APIs are planned or currently in-progress, see [Planned APIs](#planned-apis) below.

In some cases, subtle differences might exist in how the APIs behave in the Web Widget compared to the Chat widget. For example, the Web Widget doesn't have any separation between its launcher and window, so if you call `hide` or `setOffset` the Web Widget applies it to the entire widget instead of just the launcher or window. Refer to the notes of each API below for more detail.

If you intend to continue using the `$zopim.livechat` syntax for some time before migrating to the new `zE` syntax, refer to [this article](https://support.zendesk.com/hc/en-us/articles/115007912068-Using-the-Chat-widget-JavaScript-API) to understand how to correctly wrap `$zopim.livechat` API calls when using `zE`.

To read detailed descriptions for each API, refer to the [Web Widget developer documentation](https://developer.zendesk.com/embeddables/docs/widget/introduction).

### General APIs

| **$zopim.livechat syntax** | **zE syntax** |
| -------------------------- | ------------------------------------------- |
| button.hide | zE('webWidget', 'hide') |
| button.show | zE('webWidget', 'show') |
| window.toggle | zE('webWidget', 'toggle') |
| window.hide | zE('webWidget', 'hide') |
| window.show | zE('webWidget', 'open') |
| window.getDisplay | zE('webWidget:get', 'display') |
| isChatting | zE('webWidget:get', 'chat:isChatting') |
| removeTags | zESettings.webWidget.chat.tags |
| addTags | zESettings.webWidget.chat.tags |
| say | zE('webWidget', 'chat:send', msg) |
| endChat | zE('webWidget', 'chat:end') |
| hideAll | zE('webWidget', 'hide') |
| set* | zE('webWidget', 'prefill', data<object>) and zE('webWidget', 'setLocale', data<string>) |

\* `$zopim.livechat.set()` currently supports the following APIs: name, email and language.

### Visitor Information

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| setName* | zE('webWidget', 'prefill', { name: { value: 'John Doe' [, readOnly: true|false] }}) |
| setEmail* | zE('webWidget', 'prefill', { email: { value: 'john@doe.com' [, readOnly: true|false] }}) |
| setPhone* | zE('webWidget', 'prefill', { phone: { value: '12345678' [, readOnly: true|false] }}) |
| sendVisitorPath | zE('webWidget', 'updatePath') |
| clearAll | zE('webWidget', 'logout') |

\* You can set the name, phone, and email at the same time using the new prefill API. To set multiple attributes concurrently, provide a prefill object that has a key for each attribute. Example:

```
zE('webWidget', 'prefill', {
    name: { … },
    email: { … },
    phone: { … }
})
```

### Events

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| setOnConnected | zE('webWidget:on', 'chat:connected', () => {}) |
| setOnChatStart | zE('webWidget:on', 'chat:start', () => {}) |
| setOnChatEnd | zE('webWidget:on', 'chat.end', () => {}) |
| setOnStatus | zE('webWidget:on', 'chat.status', (status) => {}) |
| setOnUnreadMsgs | zE('webWidget:on', 'chat.unreadMsgs', (msgs) => {}) |
| window.onShow | zE('webWidget:on', 'open', () => {}) |
| window.onHide | zE('webWidget:on', 'close', () => {}) |

### Customization APIs

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| button.setOffsetVertical | zESettings.webWidget.offset.vertical |
| button.setOffsetVerticalMobile   | zESettings.webWidget.offset.mobile.vertical |
| button.setOffsetHorizontal | zESettings.webWidget.offset.horizontal |
| button.setOffsetHorizontalMobile | zESettings.webWidget.offset.mobile.horizontal |
| button.setPosition* | zESettings.webWidget.position |
| button.setPositionMobile* | zESettings.webWidget.position |
| button.setColor | zESettings.webWidget.color.launcher |
| window.setColor | zESettings.webWidget.color.theme |
| window.setTitle | zESettings.webWidget.chat.title |
| window.setOffsetVertical | zESettings.webWidget.offset.vertical |
| window.setOffsetHorizontal | zESettings.webWidget.offset.horizontal |
| window.setPosition* | zESettings.webWidget.position |
| prechatForm.setGreetings | zESettings.webWidget.chat.prechatForm.greeting |
| offlineForm.setGreetings | zESettings.webWidget.chat.offlineForm.greeting |
| mobileNotifications.setDisabled  | zESettings.webWidget.chat.notifications.mobile.disable |
| theme.setColor* | zESettings.webWidget.color.theme |
| theme.setColors* | zESettings.webWidget.color.theme |
| theme.setProfileCardConfig | zESettings.webWidget.chat.profileCard.avatar, zESettings.webWidget.chat.profileCard.title, zESettings.webWidget.chat.profileCard.rating|
| setDisableGoogleAnalytics | zESettings.analytics |
| setGreetings | zESettings.webWidget.launcher.chatLabel|label |
| setStatus | Supported |
| button.setHideWhenOffline | zESettings.webWidget.launcher.setHideWhenChatOffline |

\* All of the position values supported in the legacy Chat Widget can be used excluding `tm` (Top middle), and `bm` (Bottom middle). See the complete list of position values in the [legacy Chat documentation](https://api.zopim.com/files/meshim/widget/controllers/liveChatAPI/Button-js.html#$zopim.livechat.button.setPosition). Please also note that setting the position for mobile or desktop will affect both mobile and desktop versions of the web widget.

\* `$zopim.livechat.theme.setColor` supports the primary color only.

\* `$zopim.livechat.theme.setColors` supports the primary color only.

### Concierge

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| concierge.setAvatar | zESettings.webWidget.chat.concierge.avatarPath |
| concierge.setName | zESettings.webWidget.chat.concierge.name |
| concierge.setTitle | zESettings.webWidget.chat.concierge.title |

### Departments

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| departments.filter | zESettings.webWidget.chat.departments.enabled |
| departments.setVisitorDepartment | zESettings.webWidget.chat.departments.select |
| departments.clearVisitorDepartment | zESettings.webWidget.chat.departments.select |
| departments.getDepartment | zE('webWidget:get', 'chat:department', id or name) |
| departments.getAllDepartments | zE('webWidget:get', 'chat:departments') |
| departments.setLabel | zESettings.webWidget.chat.prechatForm.departmentLabel |

### What APIs are not supported

Below is a list of the $zopim.livechat APIs that are not supported in the Web Widget.

#### Deprecated

| $zopim.livechat syntax | Notes |
| --- | --- |
| setDisableSound | Admin setting has replaced the need for this |
| setNotes | No longer supported for security reasons |
| appendNotes | As above |
| button.hide | Button launcher is no longer supported. Previous button-related functions such as offset/position continue to work with badge. |
| button.show | As above |
| bubble.show | Chat bubble feature is no longer supported |
| bubble.hide | As above |
| bubble.reset | As above |
| bubble.setTitle | As above |
| bubble.setText | As above |
| bubble.setColor | As above |
| getName | Due to low adoption of these APIs in the standalone Chat widget, they won't be migrated over to the new experience. If this is blocking a use case for you, please let us know what you are trying to achieve in the comments below. |
| getEmail | As above |
| getPhone | As above |
| setSize | As above |
| theme.reload | Theme API calls are applied automatically and do not require this subsequent call |
| theme.setFontConfig | Chat themes are no longer available |
| theme.setTheme | As above |
| cookieLaw.comply | Cookie law format is changing |

### What APIs are coming soon

#### Planned

| $zopim.livechat syntax | zE syntax |
| --- | --- |
| authenticate | zESettings.webWidget.authenticate.chat  |
| badge.hide | zE('webWidget', 'hide')
| badge.show | zE('webWidget', 'show')
| badge.setLayout | zESettings.webWidget.launcher.badge.layout |
| badge.setImage | zESettings.webWidget.launcher.badge.image  |
| badge.setColor | zESettings.webWidget.color.launcher |
| badge.setText | zESettings.webWidget.launcher.badge.label |
| setDefaultImplicitConsent | zESettings.cookies |
| window.popout | zE('webWidget', 'popout') |
