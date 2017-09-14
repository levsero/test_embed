import AttachmentStyles from 'component/attachment/Attachment.sass';
import AttachmentBoxStyles from 'component/attachment/AttachmentBox.sass';
import ButtonIconStyles from 'component/button/ButtonIcon.sass';
import ChannelChoiceStyles from 'component/channelChoice/ChannelChoice.sass';
import ChannelChoiceDesktopStyles from 'component/channelChoice/ChannelChoiceDesktop.sass';
import ChannelChoicePopupMobileStyles from 'component/channelChoice/ChannelChoicePopupMobile.sass';
import ChannelChoiceMobileStyles from 'component/channelChoice/ChannelChoiceMobile.sass';
import ChatBoxStyles from 'component/chat/ChatBox.sass';
import ChatPopupStyles from 'component/chat/ChatPopup.sass';
import ChatHeaderStyles from 'component/chat/ChatHeader.sass';
import ChatFooterStyles from 'component/chat/ChatFooter.sass';
import ChatPrechatFormStyles from 'component/chat/ChatPrechatForm.sass';
import ChatMenuStyles from 'component/chat/ChatMenu.sass';
import ChatGroupStyles from 'component/chat/ChatGroup.sass';
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
  ${AttachmentStyles}
  ${AttachmentBoxStyles}
  ${ButtonIconStyles}
  ${ChannelChoiceStyles}
  ${ChannelChoiceDesktopStyles}
  ${ChannelChoiceMobileStyles}
  ${ChannelChoicePopupMobileStyles}
  ${ChatBoxStyles}
  ${ChatPopupStyles}
  ${ChatHeaderStyles}
  ${ChatFooterStyles}
  ${ChatPrechatFormStyles}
  ${ChatMenuStyles}
  ${ChatGroupStyles}
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
