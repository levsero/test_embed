import AttachmentStyles from 'component/attachment/Attachment.scss';
import AttachmentBoxStyles from 'component/attachment/AttachmentBox.scss';
import AttachmentListStyles from 'component/attachment/AttachmentList.scss';
import ButtonDropzoneStyles from 'component/button/ButtonDropzone.scss';
import ButtonIconStyles from 'component/button/ButtonIcon.scss';
import ButtonGroupStyles from 'component/button/ButtonGroup.scss';
import ButtonPillStyles from 'component/button/ButtonPill.scss';
import ButtonSecondaryStyles from 'component/button/ButtonSecondary.scss';
import ChannelChoiceMenuStyles from 'component/channelChoice/ChannelChoiceMenu.scss';
import ChannelChoiceDesktopStyles from 'component/channelChoice/ChannelChoiceDesktop.scss';
import ChannelChoicePopupMobileStyles from 'component/channelChoice/ChannelChoicePopupMobile.scss';
import ChannelChoiceMobileStyles from 'component/channelChoice/ChannelChoiceMobile.scss';
import ChannelChoicePopupDesktopStyles from 'component/channelChoice/ChannelChoicePopupDesktop.scss';
import ChatBoxStyles from 'component/chat/ChatBox.scss';
import ChatPopupStyles from 'component/chat/ChatPopup.scss';
import ChatContactDetailsPopup from 'component/chat/ChatContactDetailsPopup.scss';
import ChatHeaderStyles from 'component/chat/ChatHeader.scss';
import ChatFooterStyles from 'component/chat/ChatFooter.scss';
import ChatRatingGroupStyles from 'component/chat/ChatRatingGroup.scss';
import ChatPrechatFormStyles from 'component/chat/ChatPrechatForm.scss';
import ChatMenuStyles from 'component/chat/ChatMenu.scss';
import ChatGroupStyles from 'component/chat/ChatGroup.scss';
import ChatEventMessageStyles from 'component/chat/ChatEventMessage.scss';
import ChatReconnectionBubbleStyles from 'component/chat/ChatReconnectionBubble.scss';
import ChatFeedbackForm from 'component/chat/ChatFeedbackForm.scss';
import ChatStyles from 'component/chat/Chat.scss';
import ContainerStyles from 'component/container/Container.scss';
import DropdownStyles from 'component/field/Dropdown.scss';
import DropdownOptionStyles from 'component/field/DropdownOption.scss';
import FieldStyles from 'component/field/Field.scss';
import FlagStyles from 'component/Flag.scss';
import HelpCenterArticleStyles from 'component/helpCenter/HelpCenterArticle.scss';
import HelpCenterDesktopStyles from 'component/helpCenter/HelpCenterDesktop.scss';
import HelpCenterMobileStyles from 'component/helpCenter/HelpCenterMobile.scss';
import HelpCenterResultsStyles from 'component/helpCenter/HelpCenterResults.scss';
import IconFieldButtonStyles from 'component/button/IconFieldButton.scss';
import LoadingEllipsesStyles from 'component/loading/LoadingEllipses.scss';
import MessageBubbleStyles from 'component/chat/MessageBubble.scss';
import SearchFieldButtonStyles from 'component/button/SearchFieldButton.scss';
import SearchFieldStyles from 'component/field/SearchField.scss';
import SearchInputStyles from 'component/field/SearchInput.scss';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.scss';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.scss';
import TalkStyles from 'component/talk/Talk.scss';
import TalkPhoneFieldStyles from 'component/talk/TalkPhoneField.scss';

import { sharedStyles } from 'embed/sharedStyles.js';

export const webWidgetStyles = `
  ${sharedStyles}
  ${AttachmentStyles}
  ${AttachmentBoxStyles}
  ${AttachmentListStyles}
  ${ButtonDropzoneStyles}
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
  ${ChatEventMessageStyles}
  ${ChatReconnectionBubbleStyles}
  ${ChatFeedbackForm}
  ${ChatStyles}
  ${ContainerStyles}
  ${DropdownStyles}
  ${DropdownOptionStyles}
  ${FieldStyles}
  ${FlagStyles}
  ${HelpCenterArticleStyles}
  ${HelpCenterDesktopStyles}
  ${HelpCenterMobileStyles}
  ${HelpCenterResultsStyles}
  ${IconFieldButtonStyles}
  ${LoadingEllipsesStyles}
  ${MessageBubbleStyles}
  ${SearchFieldButtonStyles}
  ${SearchFieldStyles}
  ${SearchInputStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
  ${TalkStyles}
  ${TalkPhoneFieldStyles}
`;
