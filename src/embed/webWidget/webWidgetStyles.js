import AttachmentStyles from 'component/attachment/Attachment.sass';
import AttachmentBoxStyles from 'component/attachment/AttachmentBox.sass';
import AttachmentListStyles from 'component/attachment/AttachmentList.sass';
import ButtonIconStyles from 'component/button/ButtonIcon.sass';
import ButtonGroupStyles from 'component/button/ButtonGroup.sass';
import ButtonPillStyles from 'component/button/ButtonPill.sass';
import ButtonSecondaryStyles from 'component/button/ButtonSecondary.sass';
import ChannelChoiceMenuStyles from 'component/channelChoice/ChannelChoiceMenu.sass';
import ChannelChoiceDesktopStyles from 'component/channelChoice/ChannelChoiceDesktop.sass';
import ChannelChoicePopupMobileStyles from 'component/channelChoice/ChannelChoicePopupMobile.sass';
import ChannelChoiceMobileStyles from 'component/channelChoice/ChannelChoiceMobile.sass';
import ChannelChoicePopupDesktopStyles from 'component/channelChoice/ChannelChoicePopupDesktop.sass';
import ChatBoxStyles from 'component/chat/ChatBox.sass';
import ChatPopupStyles from 'component/chat/ChatPopup.sass';
import ChatContactDetailsPopup from 'component/chat/ChatContactDetailsPopup.sass';
import ChatHeaderStyles from 'component/chat/ChatHeader.sass';
import ChatFooterStyles from 'component/chat/ChatFooter.sass';
import ChatRatingGroupStyles from 'component/chat/ChatRatingGroup.sass';
import ChatPrechatFormStyles from 'component/chat/ChatPrechatForm.sass';
import ChatMenuStyles from 'component/chat/ChatMenu.sass';
import ChatGroupStyles from 'component/chat/ChatGroup.sass';
import ChatReconnectionBubbleStyles from 'component/chat/ChatReconnectionBubble.sass';
import ChatFeedbackForm from 'component/chat/ChatFeedbackForm.sass';
import ChatStyles from 'component/chat/Chat.sass';
import ContainerStyles from 'component/container/Container.sass';
import DropdownStyles from 'component/field/Dropdown.sass';
import DropdownOptionStyles from 'component/field/DropdownOption.sass';
import FieldStyles from 'component/field/Field.sass';
import HelpCenterArticleStyles from 'component/helpCenter/HelpCenterArticle.sass';
import HelpCenterDesktopStyles from 'component/helpCenter/HelpCenterDesktop.sass';
import HelpCenterMobileStyles from 'component/helpCenter/HelpCenterMobile.sass';
import HelpCenterResultsStyles from 'component/helpCenter/HelpCenterResults.sass';
import IconFieldButtonStyles from 'component/button/IconFieldButton.sass';
import LoadingEllipsesStyles from 'component/loading/LoadingEllipses.sass';
import MessageBubbleStyles from 'component/chat/MessageBubble.sass';
import SearchFieldButtonStyles from 'component/button/SearchFieldButton.sass';
import SearchFieldStyles from 'component/field/SearchField.sass';
import SearchInputStyles from 'component/field/SearchInput.sass';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';

import { sharedStyles } from 'embed/sharedStyles.js';

export const webWidgetStyles = `
  ${sharedStyles}
  ${AttachmentStyles}
  ${AttachmentBoxStyles}
  ${AttachmentListStyles}
  ${ButtonIconStyles}
  ${ButtonGroupStyles}
  ${ButtonPillStyles}
  ${ButtonSecondaryStyles}
  ${ChannelChoiceMenuStyles}
  ${ChannelChoiceDesktopStyles}
  ${ChannelChoicePopupDesktopStyles}
  ${ChannelChoiceMobileStyles}
  ${ChannelChoicePopupMobileStyles}
  ${ChatBoxStyles}
  ${ChatPopupStyles}
  ${ChatContactDetailsPopup}
  ${ChatHeaderStyles}
  ${ChatFooterStyles}
  ${ChatRatingGroupStyles}
  ${ChatPrechatFormStyles}
  ${ChatMenuStyles}
  ${ChatGroupStyles}
  ${ChatReconnectionBubbleStyles}
  ${ChatFeedbackForm}
  ${ChatStyles}
  ${ContainerStyles}
  ${DropdownStyles}
  ${DropdownOptionStyles}
  ${FieldStyles}
  ${HelpCenterArticleStyles}
  ${HelpCenterDesktopStyles}
  ${HelpCenterMobileStyles}
  ${HelpCenterResultsStyles}
  ${IconFieldButtonStyles}
  ${LoadingEllipsesStyles}
  ${MessageBubbleStyles}
<<<<<<< HEAD
<<<<<<< HEAD
  ${SearchFieldButtonStyles}
=======
=======
  ${SearchFieldStyles}
>>>>>>> Move SearchField to CSS modules
  ${SearchInputStyles}
>>>>>>> Move SearchInput to CSS modules
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
`;
