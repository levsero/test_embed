## Changelog
### 23 August 2018
- Released a significant upgrade to the Web Widget UI to use Zendesk Garden components and improve accessibility. This includes a larger base font size, improvements to color contrast, resizing, keyboard controls and screenreader support. Learn more [here](https://support.zendesk.com/hc/en-us/articles/360001899447).
- Released support for domain level whitelisting. Now customers with a URL that does not contain www or a subdomain can use the whitelist restricted Help Center content feature.

### 8 August 2018
- Released a fix for customers still using the legacy snippet and who have a host-mapped domain hard-coded into their snippet. 

### 6 August 2018
- Executed a redirect for the legacy Web Widget snippet that enables future performance improvements. Learn more [here](https://support.zendesk.com/hc/en-us/articles/360000620507-Announcing-Web-Widget-Performance-improvements).

### 3 August 2018
- Released a minor optimization of the Contextual Help experience.
  - Widget now displays a visual indication when waiting for search results to be returned
  - Widget now displays a message when Contextual Help search did not return any results

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
- Enhanced the [color setting](/embeddables/docs/widget/zesettings#color) api. It now allows customizing the color of specific Widget elements.
- View original article button is now a clickable icon at top right of the Widget article (previously at bottom of the article).

### 22 February 2018
- Fixed an issue with Contextual Help search results and zE.setHelpCenterSuggestions. It now displays max 3 results.
- Fixed an issue with tables in Help Center articles. It now allows horizontal scrolling.

### 13 February 2018
- Added [mobile offset](/embeddables/docs/widget/zesettings#offset) to settings.
- Removed the "view more" button. Display up to 9 results by default.
