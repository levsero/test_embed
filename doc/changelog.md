## Changelog

<!-- Formatting guide:
• Added - for new features.
• Changed - for changes in existing functionality.
• Deprecated -  for soon-to-be removed features.
• Removed - for now removed features.
• Fixed - for any bug fixes.
• Security - in case of vulnerabilities -->

### 26 October 2020

- Fixed an issue that prevented `connectOnDemand` from establishing a Chat connection when the Web Widget was opened via the API.

### 7 October 2020

- Fixed an issue where the thumbs-up and thumbs-down icons were not rendered correctly on iOS.

### 29 September 2020

- Fixed an issue where proactive chats couldn't be reached if they started while the Web Widget was open on the Contact Form.
- Fixed an issue where end-users would lose their on-going chat session when Chat is suppressed via the API.

### 24 September 2020

- Fixed an issue where the Web Widget could not be positioned to the left on websites using right-to-left locales.

### 21 September 2020

- Changed the Chat offline form to clear the "message" text area after submission to help prevent end-users from re-submitting the same form multiple times.
- Fixed an issue where quick reply buttons would appear over the Chat menu.

### 14 September 2020

- Fixed an isse where the Web Widget failed to load on Internet Explorer 11.

### 4 September 2020

- Fixed an issue where the Web Widget would crash if passed invalid ticket form IDs via the API.

### 2 September 2020

- Added the ability to hide the description hint for individual ticket fields on a per-field basis.
- Added a [re-authentication API](https://developer.zendesk.com/embeddables/docs/widget/settings#authenticate) for authorizing access to restricted Help Center content.
- Fixed an issue where the minimize button in the Chat Badge did not work correctly.

### 26 August 2020

- Fixed an issue that caused an empty selection screen to appear when no ticket forms were available for a brand.

### 17 August 2020

- Fixed a slight visual regression for the chat badge where the input incorrectly had a border radius.

### 11 August 2020

- Fixed an issue where links in chat messages could not be selected by users.
- Fixed an issue where the Help Center search bar would resize slightly when entering a search query.

### 6 August 2020

- Added phone property to [`zE('webWidget', 'identify')` api](https://developer.zendesk.com/embeddables/docs/widget/core#identify)
- Fixed small bug causing the widget to crash if no `prefill` option is passed to the ticket forms fields API.

### 30 July 2020

- Added the [Talk Label API](https://developer.zendesk.com/embeddables/docs/widget/settings#talklabel), which allows the launcher label to be customised when Talk is enabled, and Chat and Help Center are disabled.

- Fixed inconsistencies in the margins used in widget positioning. Margins will now default to 16px on each side.

### 23 July 2020

- Fixed a bug where [on chat:end callbacks](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatend) would fire on historic chat end system messages.

### 22 July 2020

- Security improvements for translations.

### 20 July 2020

- Fixed the [chat:popout API](https://developer.zendesk.com/embeddables/docs/widget/chat#popout) to call the [on:chat:popout callback](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatpopout).
- Fixed some accessibility issues with the Help Center search input. Specifically added an aria-label for the Clear Search button

- Fixed a bug that caused the [Chat connected API](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatconnected) to not fire.
- Fixed console errors being shown when the [identify API](https://developer.zendesk.com/embeddables/docs/widget/core#identify) is called and the visitor has been banned from Chat.
- Changed the Chat offline form to use bouncing dots in the **Submit** button instead of a loading spinner page while the form is being submitted.

### 8 July 2020

- Fixed a bug where social logouts for Chat were frequently timing out.
- Fixed an issue where long URLs were overflowing in the Chat interface.

### 7 July 2020

- Fixed a bug that caused the launcher not to transition on first view. This bug also caused the launcher to initially appear too far to the right when positioned on the left of the screen.
- Fixed a bug that caused websites to be unresponsive on iOS 12 and older versions.

### 30 June 2020

- Fixed a bug that prevented Help Center article images loading for customers using host mapped domains.

### 25 June 2020

- Fixed a bug where nested callbacks in `$zopim(fn)` functions are not executed when placed right after the snippet.
- Fixed a minor scrollbar rendering bug in Firefox.
- Fixed the launcher to be more accessible to screen reader users on mobile devices.
- Changed the padding on a number of buttons, and fixed icon sizes in the Chat footer.

### 23 June 2020

- Fixed a bug that prevented Philippine phone numbers from rendering in the widget.

### 22 June 2020

- Fixed incorrect positioning of modals in Chat in IE11.
- Fixed a bug where `$zopim(fn)` callbacks were not being executed when placed right after the snippet.

### 4 June 2020

- Fixed a bug where the user avatar appeared on top of the message for right-to-left languages.
- Fixed scrolling behavior in Chat for long text replies and some structured messages.

### 3 June 2020

- Fixed alignment of alert icon in chat attachment error message.

### 2 June 2020

- Added a validation error when the feedback form is submitted with empty values rather than
  just disabling the Send button.

### 29 May 2020

- Updated the widget to use a more generic and consistent success page when the
  prechat form submits and sends an offline message.

### 27 May 2020

- Fixed a bug where the description of labels in ticket fields was not being displayed.

### 25 May 2020

- Fixed a bug where users could send a message while Chat was disconnected.

### 20 May 2020

- Fixed a bug that would cause the edit contact details form submission to fail if a user submitted an empty optional value.
- Fixed a bug where the back button in right-to-left languages was pointing to the
  left instead of to the right, and the exclamation icon in the Alert message box was in the left position instead of the right position.
- Fixed a bug that caused the widget to not be hidden when the `hide` API command
  was called straight after the `show` API command on page load.
- Fixed multi-line label spacing in contact forms.

### 14 May 2020

- Added improvements in the widget loading time by deferring when certain data is loaded and processed.

### 12 May 2020

- Fixed an issue that caused panel carousel structured messages not to appear in the chat log.
- Added a dark background overlay behind modals when they are opened in Chat.
- Added improvements to success and error notifications when submitting modal forms in Chat.

### 29 April 2020

- Added support for enhanced event tracking. For more information, refer to the [announcement](https://support.zendesk.com/hc/en-us/articles/360047581933-Announcing-enhanced-event-tracking-for-the-Web-Widget-in-Google-Analytics-and-other-analytics-tools) and the [API documentation](https://developer.zendesk.com/embeddables/docs/widget/core#on-userevent).
- Changed Answer Bot to now only download on-demand instead of when the widget starts on page load.

### 27 April 2020

- Fixed an issue where the agent's availability weren't updated after a department transfer triggered via the Chat Conversations API.

### 23 April 2020

- Fixed a bug that caused the chat log to lose scroll position when scrolling up to load more messages.

### 21 April 2020

- Fixed a bug where custom forms are not being displayed when the contact form is suppressed during load time and then unsuppressed.
- Fixed the chat history log displaying an incorrect date for some chats.
- Fixed the question prompt being incorrectly shown in Answer Bot when requesting feedback.

### 9 April 2020

- Fixed an error message when there are connection issues uploading an attachment in the contact form.

### 3 April 2020

- Fixed a bug where proactive chats were not displaying on Firefox mobile.
- Updated docs to include information about using empty arrays to reset custom filtering in ticket forms.
- Fixed a bug where submitting a ticket form a second time with attachments resulted in an indefinite loading spinner.

### 27 March 2020

- Fixed a bug where the Chat badge did not display the widget launcher after the user had interacted with it.

### 26 March 2020

- Added ARIA labels on the "remove attachment" icons in Support for accessibility purposes.
- Fixed a bug for mobile devices where Chat trigger messages are scrolled to the top of the page after the user scrolls to the bottom of a long page.
- Fixed minor visual bug by removing spacing near the widget footer section.
- Fixed the menu icon not being able to close the chat menu on iOS.
- Fixed the `updateSettings` API command so it respects changes in ticket forms.

### 19 March 2020

- Fixed a rendering bug for mobile proactive Chat pop-up where the second line of the message was cut off.

### 18 March 2020

- Fixed a bug where de-activated ticket forms took a very long time to stop showing up in the widget.
- Fixed a bug in the ticket submission form where user entries were lost between opening and closing the form.

### 16 March 2020

- Fixed the Answer Bot greeting being duplicated when the widget is opened by the `zE('webWidget', 'open')` API.
- Fixed a bug where users could not submit multiple support forms for customers with Answer Bot enabled.
- Fixed a bug where chats were being ended from the Chat rating page.
- Changed the Chat rating page where comments can now be submitted without a rating.

### 12 March 2020

- Added new `addTags` and `removeTags` APIs.
- Changed the socket connection to Talk, so that the Web Widget doesn't try to reconnect too quickly on a slow WebSocket service.

### 4 March 2020

- Fixed a bug which was stripping the "department" field and incorrectly routing chats when Chat department agents go offline.
- Fixed the nested check box rendering in conditional fields.

### 27 February 2020

- Fixed the attachments dropzone now covers the whole Web Widget.
- Fixed a bug in the Answer Bot article UI which hides the end of the article.

### 26 February 2020

- Fixed the chat options which are no longer cut off and updated the UI.

### 18 February 2020

- Fixed a bug that was causing support forms to crash when it included a field the widget does not support.

### 14 February 2020

- Fixed the "email transcript" option in Chat popout that now respects `emailTranscript: false` in zESettings.

### 13 February 2020

- Added the Zendesk logo in the Chat log when Chat is enabled and an agent is not typing.

### 11 February 2020

- Changed - Now when a chat agent re-requests a review, the review request will appear for the user, even if they had already reviewed the chat.

### 10 February 2020

- Fixed an issue where old API method names were being invoked under a specific set of circumstances.
- Fixed a bug where the Web Widget previewer wasn't being translated in Support.

### 7 February 2020

- Fixed a bug where interacting with the drop down field resulted in the Web Widget crashing on certain mobile devices.

### 30 January 2020

- Security - Added `SameSite: lax` to chat cookies to comply with Chrome 80s cookies security update: <https://www.chromestatus.com/feature/5088147346030592>
- Fixed visual bug that chat rating feedback buttons being pushed off the side of the agent panel if the agent had a very long Agent Name.
- Fixed a bug that prevented phone number from being set when using authenticated chat.

### 21 January 2020

- Security - Fixed Edit Contact Details appearing in the Chat Menu even when `User Profile` is disabled in Chat settings.
- Fixed a bug in the Chat Log scroll bar which caused it to have inconsistent sizing across browsers.
- Fixed social login buttons being visible in the pre-chat form despite `User Profile` being disabled in Chat settings.
- Fixed Chat menu visibility when viewing the widget in a pop-out window.

### 16 January 2020

- Fixed a bug where social network login buttons were opening tabs that wouldn't automatically close when authenticated.
- Fixed a bug where RTL styling was incorrect in form attachments.

### 14 January 2020

- Changed styling for attachments used in forms.

### 13 January 2020

- Changed - The priority order for values used in a form:
  - Fallback values for all forms, including values set from the prefill API
  - Specific locale values for all forms
  - Fallback values for a specific form
  - Specific locale values for a specific form
- Fixed tickets submitting despite `required` drop-down options having no value set.

### 08 January 2020

- Fixed an issue where the `on:open` and `on:closed` API callbacks were not being fired when `zE('webWidget', 'toggle')` was called.
- Fixed the chat box in Answer Bot in mobile to have a more accessible styling. with the Zendesk logo now appearing above the chat box.
- Fixed an issue where the `reset` and `logout` APIs were not working in cases where a search was performed before the API was executed.

### 06 January 2020

- Fixed an issue where Answer Bot articles were displaying the Original Article button when it should have been disabled by the settings API.
- Fixed an issue where the Help Center search form was not utilizing the `clear` API to clear forms.
- Added an automatic scroll to the agent typing indicator when it changes.
- Fixed an issue where the Original Article button in Articles was incorrectly positioned.
- Added hover effects for navigation buttons.
- Security: Updated various packages to address potential security vulnerabilities.

### 20 December 2019

- Fixed an issue where the Chat message notification did not respect end user dismissal in Help Center.
- Added `SameSite=Lax` to the cookie in the Chat popout page.
- Fixed an issue with the padding around error messages in the Talk form.

### 19 December 2019

- Fixed an issue where the height of the Web Widget was not being respected in Internet Explorer.
- Changed the way API errors are handled in the Web Widget. It now catches and reports useage errors in the browser console.

### 18 December 2019

- Fixed an issue where the Chat footer was not being rendered correctly in Internet Explorer.
- Fixed an issue where the Chat connection would break if bad data was passed to some Chat APIs.
- Fixed an issue where the Social login function would not redirect the user back to the Web Widget after logging in on iOS13.

### 17 December 2019

- Fixed an issue where end users were able to submit the Chat offline form while the feature was disabled.
- Fixed an issue where the "loading messages..." message in the Chat log prevented user scrolling.

### 13 December 2019

- Added an ARIA label on the Chat log to improve usability with screen readers.
- Added [connectOnPageLoad](https://support.zendesk.com/hc/en-us/articles/360039826494) setting. This allows site owners to defer the Chat web socket connection until an end user interacts with the Web Widget, significantly improving performance.

### 11 December 2019

- Fixed an issue where the ellipsis icon in Chat was not rendering correctly.

### 05 December 2019

- Fixed an issue where Chat `sendMsg` API would try to send a message before Chat was initialized.
- Changed Help Center to load only when users need it, saving end user data and reducing overall widget loading time.
- Fixed an issue where the Chat Menu wasn't displayed correctly in Safari.
- Fixed an issue where form prefill wasn't filling data on initial render.

### 26 November 2019

- Fixed an issue where the proactive chat notification could not be dismissed on mobile.
- Fixed an issue where bad data being passed to legacy `$zopim` APIs would cause the Web Widget to crash.

### 25 November 2019

- Fixed an issue where the Web Widget was attempting to send visitor paths to Chat before the connection had been initialized.
- Fixed an issue where the Web Widget crashed if `updatePath` was called with an empty string in the title attribute.
- Fixed an issue where end users saw the host page being scrolled to the top before the Web Widget was fully opened on mobile.
- Fixed an issue where Help Center articles could not be opened in a new window.
- Fixed the Talk setting on the Admin page to only be accessible for customers with a Team, Professional, or Enterprise Talk plan.

### 20 November 2019

- Fixed an issue where Japanese inputs in Safari were rendered with a 1-2 second lag.

### 19 November 2019

- Fixed an issue where proactive chats failed to open the Web Widget.

### 18 November 2019

- Fixed an issue where visitor information from the Web Widget wasn't populated in Chat.
- Fixed an issue which prevented Original Article buttons from being hidden via API.
- Fixed an issue where the chat log wasn't cleared properly when the end user disconnected from the session.

### 12 November 2019

- Fixed an issue where the Chat Badge send button was displayed incorrectly.

### 8 November 2019

- Fixed an issue where the 'Add to Help Center' button on the Admin page threw an error.

### 6 November 2019

- Fixed an issue where text wrapping broke formatting in the Web Widget on older verions of iOS.
- Changed the Help Center search input to provide a better user experience.
- Changed the appearance of the buttons on mobile to be more consistent with the desktop experience.

### 4 November 2019

- Fixed an issue where images weren't displaying correctly in the Web Widget when they had been resized in Help Center.

### 23 October 2019

- Fixed an issue with the `$zopim.livechat.setOnStatus` parameter. It was receiving an object with the Account Status as a key instead of the status as a string.

### 10 October 2019

- Fixed an issue where the prefill settings weren't displaying in the Ticket Forms.

### 9 October 2019

- Fixed an issue where the Chat Offline Form wasn't displaying newlines in the offline form greeting.

### 7 October 2019

- Fixed an issue where the escape key wasn't closing the Web Widget.

### 24 September 2019

- Fixed an issue where the `$zopim.livechat.getDisplay` wasn't returning `false` when the Web Widget was closed.

### 17 September 2019

- Added support for an [on chat:popout](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatpopout) API.

### 16 September 2019

- Changed Proactive Chats so they won't show the Web Widget if it is hidden using the [hide](https://developer.zendesk.com/embeddables/docs/widget/core#hide) API.

### 10 September 2019

- Fixed an issue where the Web Widget wasn't displaying on mobile Safari when the website had `overflow-x: hidden;` applied to the document body.

### 6 September 2019

- [Integrated Chat experience](https://support.zendesk.com/hc/en-us/articles/360002088268) was released to General Availability.

### 28 August 2019

- Changed the way the Web Widget behaves when the browser zooms in.

### 27 August 2019

- Changed the screen reader experience in the Web Widget by skipping over elements that aren't required for the screen reader to read and added more _aria_ labels.

### 12 August 2019

- Fixed an issue where the logout button wasn't displayed when an end user was authenticating using Facebook. Now the log out button is displayed next to the user's Facebook name and email and allows them to remove these details.

### 5 August 2019

- Changed the [setOnStatus](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatstatus) API to return the account status when it is initially defined.
- Fixed an issue where pre-chat form wasn't being displayed after logging out.

### 30 July 2019

- Changed the departments drop-down in the pre-chat form to be sorted alphabetically.
- Fixed an issue where the Edit Contact Details popup couldn't be edited after it was submitted once. Now it can be submitted as many times as needed.
- Fixed an issue where Chat was opening up on mobile and taking over the screen when a user navigated to a new page while a chat session was in progress.

### 24 July 2019

- Fixed an issue where calling Chat [get:isChatting](https://developer.zendesk.com/embeddables/docs/widget/chat#get-chatischatting) on page load throws an error in the console. Now it returns `false` until Chat connects.

### 18 July 2019

- Fixed an issue on mobile where the Chat menu would have an option to "Go Back" even when there was nothing to go back.

### 17 July 2019

- Fixed an issue where Answer Bot messages weren't respecting the [setLocale](https://developer.zendesk.com/embeddables/docs/widget/core#setlocale) API. Now they change to match the requested locale.

### 10 July 2019

- Added support for the Chat offline form to be accessed from Answer Bot.
- Added support for the Norwegian - Bokml (NB) locale to the Web Widget.

### 5 July 2019

- Fixed an issue where the Chat popout URL wasn't generating correctly when there were non-Latin characters in the customer's settings.

### 20 June 2019

- Fixed an issue where the [toggle](https://developer.zendesk.com/embeddables/docs/widget/core#toggle) API wasn't working for customers using Chat only.

### 12 June 2019

- [Answer Bot for Web Widget](https://support.zendesk.com/hc/en-us/articles/360024549853) was released to General Availability.

### 11 June 2019

- Added support for Loom videos in Help Center articles.

### 6 June 2019

- Added a 'Get in Touch' button to Answer Bot to make it easier for the end user to find help.

### 5 June 2019

- Added support for Contextual Help inside Answer Bot.
- Fixed issue where Answer Bot prompted end users for a query multiple times.

### 30 May 2019

- Added support for [Contact Options setting](https://developer.zendesk.com/embeddables/docs/widget/core#contactoptions) inside Answer Bot.

### 23 May 2019

- Fixed an issue where the browser focus was trapped inside the Web Widget.

### 14 May 2019

- Fixed an issue where visitors could start a chat session when the account is offline if they reconnect to a timed out chat session. They can now see the offline form and are unable to start a chat session.

### 13 May 2019

- Added support for [delaying contact information](https://developer.zendesk.com/embeddables/docs/widget/settings#contactonlyafterquery) until a customer query is made in Answer Bot.
- Changed the [on open](https://developer.zendesk.com/embeddables/docs/widget/core#on-open) and [on close](https://developer.zendesk.com/embeddables/docs/widget/core#on-close) APIs. They now fire when the [open](https://developer.zendesk.com/embeddables/docs/widget/core#open) and [close](https://developer.zendesk.com/embeddables/docs/widget/core#close) APIs are called. Previously they would only fire when the launcher or close button is clicked.

### 9 May 2019

- Added support for [Answer Bot suppress](https://developer.zendesk.com/embeddables/docs/widget/settings#suppress) setting.

### 25 April 2019

- Added support for passing an array of tags through to Chat with the tags API.
- Fixed an issue where some brands weren't getting passed into Chat as a tag.

### 16 April 2019

- Added [improved support for cookie law compliance](https://support.zendesk.com/hc/en-us/articles/360021463693-Improved-support-for-cookie-law-compliance-when-using-the-Web-Widget).

### 4 April 2019

- Added support for [Built-in Conditional Fields](https://support.zendesk.com/hc/en-us/articles/360022294753-Announcing-Built-in-Conditional-Ticket-Fields) in the Web Widget.

### 3 April 2019

- Fixed an issue where offline departments were present in the pre-chat form when the customer didn't have an Offline Form.

### 29 March 2019

- Fixed an issue where the logout API would hide content in the Web Widget after being called.
- Fixed an issue where the automatic translations feature would not render the translated messages.

### 25 March 2019

- Fixed an issue where the back button was displaying when there was nothing to go back to for customers that have Help Center and Talk enabled.

### 19 March 2019

- [Name field improvements](https://support.zendesk.com/hc/en-us/articles/360019872554-Announcing-Web-Widget-Name-Field-Improvements-) was released.

### 14 March 2019

- [Translation optimizations](https://support.zendesk.com/hc/en-us/articles/360019791353-Web-Widget-Performance-Improvement-Optimized-Translations) was released.

### 4 March 2019

- Fixed an issue where the chat started API callback was firing on page load for visitors that were already chatting.
- Fixed an issue where the unread messages count displayed on the launcher was showing an incorrect value.

### 27 Febuary 2019

- Fixed an issue where customer image was cropped in Chat Badge. Now it takes up the entire Badge.
- Fixed an issue where some icons weren't visible when the theme color was white. They now display as a darker color.

### 15 Febuary 2019

- Changed the default theme color for new accounts to '#1F73B7'. This color better meets accessibility WCAG 2.0 guidelines.
- Changed the URLs inside the pre-chat and offline form greeting messages. They now display as links.
- Fixed an issue where the Web Widget was loading slowly for customers with an invalid Talk configuration. Now if the configuration is invalid we don't try to connect to Talk.

### 11 Febuary 2019

- Added support for [hiding the popout button](https://developer.zendesk.com/embeddables/docs/widget/settings#navigation).
- Fixed an issue where the Chat chime sound was playing on page load for visitors that had a chat session in progress. It now only plays a sound when a new message is received.

### 7 Feburary 2019

- Fixed issue where Chat visitor name was being displayed incorrectly as a random string. It now displays the actual visitor name.

### 4 Febuary 2019

- Fixed an issue where Chat forms weren't populating with visitor name and email. They now appear if an [identify](https://developer.zendesk.com/embeddables/docs/widget/core#identify) or [prefill](https://developer.zendesk.com/embeddables/docs/widget/core#prefill) API call has been made.
- Fixed an issue where the Chat Previewer wasn't displaying on Firefox.

### 29 January 2019

- Fixed an issue where departments dropdown wasn't hiding when using the [filter](https://developer.zendesk.com/embeddables/docs/widget/settings#departments) setting with an empty array.

### 9 January 2019

- Fixed an issue where end users couldn't chat when all Chat agents status's was set to "away".

### 20 December 2018

- Added Chat popout. This allows end users to pop the current chat session out into a new window.

### 14 December 2018

- Fixed an issue where Chat menu wasn't displaying on mobile.
- Added Social Login to the Edit Contact Details menu in Chat.

### 10 December 2018

- Fixed an issue where the Web Widget launcher size wasn't updating when the locale was changed.

### 5 December 2018

- Added [Integrated Chat](https://support.zendesk.com/hc/en-us/articles/360002088268-Embed-personalized-omnichannel-support-with-the-Web-Widget-integrated-Chat-experience).

### 28 November 2018

- Fixed an issue on some responsive websites where the Web Widget wasn't taking up the full width of the screen on mobile.

### 14 November 2018

- Fixed an issue where [custom strings defined in zESettings](https://developer.zendesk.com/embeddables/docs/widget/settings#label) failed when missing a wildcard.
- Fixed an issue where the Web Widget would display an empty _iframe_ when `zE.activate` was called.

### 8 November 2018

- [Major Widget API](https://developer.zendesk.com/embeddables/docs/widget/introduction) refresh released!

### 8 October 2018

- Released an [update to the color contrast algorithm](https://support.zendesk.com/hc/en-us/articles/360001963507-Web-Widget-Automatic-Color-Contrast-Update) to meet accessibility WCAG 2.0 guidelines.

### 5 October 2018

- Released a [new Widget Admin feature](https://support.zendesk.com/hc/en-us/articles/360001963507-Web-Widget-Automatic-Color-Contrast-Update) to allow customers to customize the theme text color (which applies to launcher, header, button text color throughout the Widget) and override the potential impact of automated color contrast applied by the Widget.

### 20 September 2018

- Added launcherText for [color settings API](https://developer.zendesk.com/embeddables/docs/widget/settings#color) which sets the color of the Widget launcher text only.

### 31 August 2018

- Released improvements to CSP support to more closely comply with [Google CSP guidelines](https://csp.withgoogle.com/docs/adopting-csp.html) including support for the nonce attribute.
- Fixed an issue where theme color was being overwritten by default green color on contact form.

### 23 August 2018

- Released a significant upgrade to the Web Widget UI to use Zendesk Garden components and improve accessibility. This includes a larger base font size, improvements to color contrast, resizing, keyboard controls and screenreader support. Learn more [here](https://support.zendesk.com/hc/en-us/articles/360001899447).
- Released support for domain-level whitelisting. Now customers with a URL that does not contain www or a subdomain can use the whitelist-restricted Help Center content feature.

### 8 August 2018

- Released a fix for customers still using the legacy snippet and who have a host-mapped domain hard-coded into their snippet.

### 6 August 2018

- Executed a redirect for the legacy Web Widget snippet that enables future performance improvements. Learn more [here](https://support.zendesk.com/hc/en-us/articles/360000620507-Announcing-Web-Widget-Performance-improvements).

### 3 August 2018

- Released a minor optimization of the Contextual Help experience.
  - Widget now displays a visual indication when waiting for search results to be returned.
  - Widget now displays a message when Contextual Help search did not return any results.

### 25 June 2018

- Released minor changes to Web Widget design. Learn more [here](https://support.zendesk.com/hc/en-us/articles/360001558868-Update-to-Web-Widget-interface-and-experience).
  - Widget height is now fixed (except for initial Help Center search state).
  - The channel choice menu (when Talk and Chat are enabled or when enabled via the channel choice API) is now displayed as a separate “screen” in the Web Widget. Previously this was a pop-up menu displayed above the Help Center search results or article view.
  - Form submission (contact form and callback form) and Talk Call Us screens now also conform to the new fixed height with minor visual design updates.

### 18 June 2018

- Released an emergency fix to Contextual Help to mitigate traffic issues. The change has altered the user experience. Previously the widget would pre-load Contextual Help results so that the results would appear immediately after clicking on the launcher. Now there is a slight delay prior to displaying results.

### 14 June 2018

- Released an update to the Web Widget snippet which is now available to all customers in the Setup tab of Widget admin.

### 28 March 2018

- Fixed prefill issues. Prefill now appears for any field when submitting a second ticket via the Web Widget without refreshing the page, and for the description field when ticket form is not enabled.

### 26 March 2018

- Fixed an issue with Web Widget embedded in restricted Help Centers with hostmapped domains. The new snippet now works for restricted Help Centers with hostmapping.

### 07 March 2018

- Released Web Widget performance improvements, including the new "Asset Composer" snippet. See announcement [here](https://support.zendesk.com/hc/en-us/articles/360000620507).
- Fixed an issue where Chat wasn't appearing after an Agent came online. The Widget now behaves as expected, opening to Chat.
- Fixed an issue where a line became visible after scrolling in the Widget on mobile. The line no longer appears.

### 05 March 2018

- Fixed an issue with tables in Help Center articles. The Widget now allows horizontal scrolling for articles with multiple tables.

### 01 March 2018

- Fixed an issue with content padding for configuration where no ticket form(s) and no Zendesk logo was enabled.

### 28 February 2018

- Header color will now match the theme color. It was previously grey.
- Enhanced the [color setting](/embeddables/docs/widget/zesettings#color) API. It now allows customizing the color of specific Widget elements.
- View original article button is now a clickable icon at top right of the Widget article (previously at bottom of the article).

### 22 February 2018

- Fixed an issue with Contextual Help search results and zE.setHelpCenterSuggestions. It now displays max 3 results.
- Fixed an issue with tables in Help Center articles. It now allows horizontal scrolling.

### 13 February 2018

- Added [mobile offset](/embeddables/docs/widget/zesettings#offset) to settings.
- Removed the "view more" button. Display up to 9 results by default.
