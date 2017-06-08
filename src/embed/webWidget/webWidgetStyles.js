import ChannelChoiceDesktopStyles from 'component/channelChoice/ChannelChoiceDesktop.sass';
import ChannelChoiceMobileStyles from 'component/channelChoice/ChannelChoicePopupMobile.sass';
import ChatBoxStyles from 'component/chat/ChatBox.sass';
import ChatHeaderStyles from 'component/chat/ChatHeader.sass';
import ChatStyles from 'component/chat/Chat.sass';
import DropdownStyles from 'component/field/Dropdown.sass';
import DropdownOptionStyles from 'component/field/DropdownOption.sass';
import HelpCenterArticleStyles from 'component/helpCenter/HelpCenterArticle.sass';
import HelpCenterDesktopStyles from 'component/helpCenter/HelpCenterDesktop.sass';
import HelpCenterMobileStyles from 'component/helpCenter/HelpCenterMobile.sass';
import HelpCenterResultsStyles from 'component/helpCenter/HelpCenterResults.sass';
import MessageBubbleStyles from 'component/chat/MessageBubble.sass';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';

import { sharedStyles } from 'embed/sharedStyles.js';

export const webWidgetStyles = `
  ${sharedStyles}
  ${ChannelChoiceDesktopStyles}
  ${ChannelChoiceMobileStyles}
  ${ChatBoxStyles}
  ${ChatHeaderStyles}
  ${ChatStyles}
  ${DropdownStyles}
  ${DropdownOptionStyles}
  ${HelpCenterArticleStyles}
  ${HelpCenterDesktopStyles}
  ${HelpCenterMobileStyles}
  ${HelpCenterResultsStyles}
  ${MessageBubbleStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
`;
