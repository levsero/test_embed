import AttachmentStyles from 'component/attachment/Attachment.scss'
import AttachmentBoxStyles from 'component/attachment/AttachmentBox.scss'
import AttachmentListStyles from 'component/attachment/AttachmentList.scss'
import ButtonDropzoneStyles from 'component/button/ButtonDropzone.scss'
import ButtonIconStyles from 'component/button/ButtonIcon.scss'
import ButtonGroupStyles from 'component/button/ButtonGroup.scss'
import ButtonPillStyles from 'component/button/ButtonPill.scss'
import ChannelChoiceMenuStyles from 'component/channelChoice/ChannelChoiceMenu.scss'
import ChannelChoiceContainerStyles from 'component/channelChoice/ChannelChoiceContainer.scss'
import AgentListStyles from 'component/chat/agents/AgentList.scss'
import ChatBoxStyles from 'component/chat/chatting/ChatBox.scss'
import ChatPopupStyles from 'component/chat/ChatPopup.scss'
import ChatNotificationPopupStyles from 'component/chat/ChatNotificationPopup.scss'
import ChatContactDetailsPopupStyles from 'component/chat/ChatContactDetailsPopup.scss'
import ChatEmailTranscriptPopupStyles from 'component/chat/ChatEmailTranscriptPopup.scss'
import ChatHeaderStyles from 'component/chat/ChatHeader.scss'
import ChatHistoryLink from 'component/chat/ChatHistoryLink.scss'
import ChattingFooterStyles from 'component/chat/chatting/ChattingFooter.scss'
import RatingGroupStyles from 'component/chat/rating/RatingGroup.scss'
import PrechatFormStyles from 'component/chat/prechat/PrechatForm.scss'
import ChatMenuStyles from 'component/chat/ChatMenu.scss'
import ChatGroupStyles from 'component/chat/chatting/log/messages/ChatGroup.scss'
import EventMessageStyles from 'component/chat/chatting/log/events/EventMessage.scss'
import ChatLogStyles from 'component/chat/chatting/ChatLog.scss'
import HistoryLogStyles from 'component/chat/chatting/HistoryLog.scss'
import ChatReconnectionBubbleStyles from 'component/chat/ChatReconnectionBubble.scss'
import FeedbackForm from 'component/chat/rating/FeedbackForm.scss'
import ChatOfflineFormStyles from 'component/chat/ChatOfflineForm.scss'
import UserProfileStyles from 'component/chat/UserProfile.scss'
import ChatOfflineStyles from 'component/chat/ChatOffline.scss'
import ChatOperatingHoursStyles from 'component/chat/ChatOperatingHours.scss'
import ChatOfflineMessageFormStyles from 'component/chat/ChatOfflineMessageForm.scss'
import ChatMessagingChannelsStyles from 'component/chat/ChatMessagingChannels.scss'
import ChatOnlineStyles from 'component/chat/ChatOnline.scss'
import ChattingScreenStyles from 'component/chat/chatting/ChattingScreen.scss'
import ChattHistoryScreenStyles from 'component/chat/chatting/chatHistoryScreen/styles/index.scss'
import AgentScreenStyles from 'component/chat/agents/AgentScreen.scss'
import RatingScreenStyles from 'component/chat/rating/RatingScreen.scss'
import PrechatScreenStyles from 'component/chat/prechat/PrechatScreen.scss'
import ContainerStyles from 'component/container/Container.scss'
import NestedDropdownStyles from 'component/field/Dropdown/NestedDropdown.scss'
import ImageMessageStyles from 'component/chat/chatting/ImageMessage.scss'
import LoadingEllipsesStyles from 'component/loading/LoadingEllipses.scss'
import MessageErrorStyles from 'component/chat/chatting/MessageError.scss'
import ProgressBarStyles from 'component/attachment/ProgressBar.scss'
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.scss'
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.scss'
import LoadingBarContentStyles from 'component/loading/LoadingBarContent.scss'
import FrameStyles from 'component/frame/Frame.scss'
import PanelCardStyles from 'component/chat/chatting/structuredMessage/PanelCard.scss'
import ButtonCardStyles from 'component/chat/chatting/structuredMessage/ButtonCard.scss'
import answerBotStyles from 'component/answerBot/styles'
import helpCenterStyles from 'embeds/helpCenter/styles'

import SharedComponentStyles from 'component/shared/styles'
import { sharedStyles } from 'embed/sharedStyles'
import gardenStyles from 'embed/gardenStyles'
import componentStyles from 'src/components/styles'

export const webWidgetStyles = `
  ${sharedStyles}
  ${gardenStyles}
  ${AgentListStyles}
  ${AttachmentStyles}
  ${AttachmentBoxStyles}
  ${AttachmentListStyles}
  ${ButtonDropzoneStyles}
  ${ButtonIconStyles}
  ${ButtonGroupStyles}
  ${ButtonPillStyles}
  ${ChannelChoiceMenuStyles}
  ${ChannelChoiceContainerStyles}
  ${ChatBoxStyles}
  ${ChatPopupStyles}
  ${ChattHistoryScreenStyles}
  ${ChatNotificationPopupStyles}
  ${ChatContactDetailsPopupStyles}
  ${ChatEmailTranscriptPopupStyles}
  ${ChatHeaderStyles}
  ${ChatHistoryLink}
  ${ChattingFooterStyles}
  ${RatingGroupStyles}
  ${PrechatFormStyles}
  ${ChatMenuStyles}
  ${ChatGroupStyles}
  ${EventMessageStyles}
  ${ChatLogStyles}
  ${HistoryLogStyles}
  ${ChatReconnectionBubbleStyles}
  ${FeedbackForm}
  ${ChatOfflineFormStyles}
  ${ChatOfflineMessageFormStyles}
  ${ChatOfflineStyles}
  ${UserProfileStyles}
  ${ChatOperatingHoursStyles}
  ${ChatMessagingChannelsStyles}
  ${ChatOnlineStyles}
  ${ChattingScreenStyles}
  ${AgentScreenStyles}
  ${RatingScreenStyles}
  ${PrechatScreenStyles}
  ${ContainerStyles}
  ${NestedDropdownStyles}
  ${ImageMessageStyles}
  ${LoadingEllipsesStyles}
  ${MessageErrorStyles}
  ${ProgressBarStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
  ${LoadingBarContentStyles}
  ${SharedComponentStyles}
  ${FrameStyles}
  ${PanelCardStyles}
  ${ButtonCardStyles}
  ${answerBotStyles}
  ${helpCenterStyles}
  ${componentStyles}
`
