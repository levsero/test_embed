## Changelog

<!---
Formatting guide:

• Added - for new features.
• Changed - for changes in existing functionality.
• Deprecated -  for soon-to-be removed features.
• Removed - for now removed features.
• Fixed - for any bug fixes.
• Security - in case of vulnerabilities
-->

### 24 September 2019

- Fixed an issue where the `$zopim.livechat.getDisplay` wasn't returning false when the Web Widget was closed.

### 17 September 2019

- Added support for an [on chat:popout](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatpopout) API.

### 16 September 2019

- Changed Proactive Chats so they won't show the Web Widget if it is hidden using the [hide](https://developer.zendesk.com/embeddables/docs/widget/core#hide) API.

### 10 September 2019

- Fixed an issue where the Web Widget wasn't displaying on mobile safari when the website had `overflow-x: hidden;` on it's document body.

### 6 September 2019

- [Integrated Chat experience](https://support.zendesk.com/hc/en-us/articles/360002088268) was released to General Availability.

### 28 August 2019

- Changed the way the Web Widget behaves when the browser Zooms in.

### 27 August 2019

- Changed the screen reader experience in the Web Widget by skipping over elements that aren't required for the screen reader to read and adding more aria labels.

### 21 August 2019

- Fixed an issue where brands with commas in them were causing Chat to error when set as a tag. Now the commas are stripped out before sending them to Chat.

### 12 August 2019

- Fixed an issue where the logout button wasn't displayed when an end user was logged in using Facebook. Now the log out button is displayed next to the user profile details.

### 5 August 2019

- Changed the [setOnStatus](https://developer.zendesk.com/embeddables/docs/widget/chat#on-chatstatus) API to return the account status when it is initially defined.
- Fixed an issue where Prechat Form wasn't being displayed after logging out.

### 30 July 2019

- Changed the Departments Dropdown in the Prechat Form to be sorted alphabetically.
- Fixed issue where the Edit Contact Details popup couldn't be edited after it was submitted once. Now it can be submitted as many times as needed.
- Fixed an issue where Chat was opening up on mobile and taking over the screen on navigation when a chat session was in progress.

### 24 July 2019

- Fixed an issue where calling Chat [get:isChatting](https://developer.zendesk.com/embeddables/docs/widget/chat#get-chatischatting) on page load throws an error in the console. Now it just returns false until chat connects.

### 18 July 2019

- Fixed an issue on mobile where the Chat Menu would have an option to "Go Back" even when there was nothing to go back too.

### 17 July 2019

- Fixed an issue where the Answer Bot messages weren't changing language when the [setLocale](https://developer.zendesk.com/embeddables/docs/widget/core#setlocale) API was called. Now it changes to match the locale from the API.

### 10 July 2019

- Added support for the Chat Offline Form to be accessed from Answer Bot.
- Added support for the Norwegian - Bokml (NB) locale to the Web Widget.

### 5 July 2019

- Fixed an issue where the popout url wasn't generating correctly when there were non latin characters in the customers settings.

### 20 June 2019

- Fixed an issue where the [toggle](https://developer.zendesk.com/embeddables/docs/widget/core#toggle) API wasn't working with customers that only had Chat enabled.

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

- Fixed an issue where visitors can start a chat session when the account is offline if they reconnect to a timed out chat session. Now they see the Offline Form and can't start chatting.

### 13 May 2019

- Added support for [delaying contact information](https://developer.zendesk.com/embeddables/docs/widget/settings#contactonlyafterquery) until a customer query is made in Answer Bot.
- Changed the [on open](https://developer.zendesk.com/embeddables/docs/widget/core#on-open) and [on close](https://developer.zendesk.com/embeddables/docs/widget/core#on-close) APIs now fire when the [open](https://developer.zendesk.com/embeddables/docs/widget/core#open) and [close](https://developer.zendesk.com/embeddables/docs/widget/core#close) APIs are called.

### 9 May 2019

- Added support for [Answer Bot suppress](https://developer.zendesk.com/embeddables/docs/widget/settings#suppress) setting.

### 25 April 2019

- Added support for passing an array of tags through to Chat with the tags API.
- Fixes an issue where some brands weren't getting passed into Chat as a tag.

### 16 April 2019

- Added [Improved support for cookie law compliance](https://support.zendesk.com/hc/en-us/articles/360021463693-Improved-support-for-cookie-law-compliance-when-using-the-Web-Widget).

### 4 April 2019

- Added support for [Built in Conditional Fields](https://support.zendesk.com/hc/en-us/articles/360022294753-Announcing-Built-in-Conditional-Ticket-Fields) in the Web Widget.

### 3 April 2019

- Fixed an issue where offline departments were selectable in Prechat Form when the customer didn't have an Offline Form.

### 29 March 2019

- Fixed an issue where the logout API would hide content in the Web Widget after being called.
- Fixed an issue where the Automatic Translations feature would not render the translated messages.

### 25 March 2019

- Fixed an issue where the back button was displaying when there was nothing to go back to for customers that have Help Center and Talk enabled.

### 19 March 2019

- [Name field improvements](https://support.zendesk.com/hc/en-us/articles/360019872554-Announcing-Web-Widget-Name-Field-Improvements-) was released.

### 14 March 2019

- [Translation optimizations](https://support.zendesk.com/hc/en-us/articles/360019791353-Web-Widget-Performance-Improvement-Optimized-Translations) was released.

### 4 March 2019

- Fixed an issue where the chat started API callback was firing on page load for visitors that were already chatting.
- Fixed an issue where the unread messages count displayed on the laucher was showing more messages then there was.

### 27 Febuary 2019

- Fixed an issue where customer image was cropped in chat badge. Now it takes up the entire badge.
- Fixed an issue where some icons weren't visible when the theme color was white. They now display as a darker color.

### 15 Febuary 2019

- Changed the default theme color for new accounts to '#1F73B7'. This color better meets accessibility WCAG 2.0 guidelines.
- Changed the URLs inside the prechat and offline form grettings now display as links.
- Fixed an issue where the Web Widget was loading slowly for customers with an invalid talk configuration. Now if the configuration is invalid we don't try to connect to Talk.

### 11 Febuary 2019

- Added support for [hiding the popout button](https://developer.zendesk.com/embeddables/docs/widget/settings#navigation).
- Fixed an issue where the Chat chime sound was playing on page load for visitor that has a chat session in progress. It now only plays a sound when a new message comes through.

### 7 Feburary 2019

- Fixed issue where Chat visitor name was being displayed incorrectly as a random string. It now displays the actual visitor name.

### 4 Febuary 2019

- Fixed an issue where Chat forms weren't populating with visitor name and email. They now appear if an identify or prefill API call has been made.
- Fixed an issue where the Chat Previewer wasn't displaying on Firefox.

### 29 January 2019

- Fixed an issue where departments dropdown wasn't hiding when using the filter setting.

### 9 January 2019

- Fixed an issue where end users couldn't chat when Chat's account status was set to "away".

### 20 December 2018

- Added Chat Popout. This allows end users to pop chat out into a new window.

### 14 December 2018

- Fixed an issue where Chat Menu wasn't displaying on mobile.
- Added Social Login to the Edit Contact Details menu in chat.

### 10 December 2018

- Fixed an issue where the Web Widget Launchers size wasn't updating when a locale is changed.

### 5 December 2018

- Added the [Integrated Chat LA](https://support.zendesk.com/hc/en-us/articles/360002088268-Embed-personalized-omnichannel-support-with-the-Web-Widget-integrated-Chat-experience).

### 28 November 2018

- Fixed an issue on some responsive website where the widget wasn't taking up the full width of the screen on mobile.

### 14 November 2018

- Fixed an issue where custom strings were failing when missing a wildcard.
- Fixed an issue where the Web Widget would display an empty iframe when zE.activate was called.

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
