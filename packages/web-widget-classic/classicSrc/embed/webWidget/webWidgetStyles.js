import AttachmentBoxStyles from 'classicSrc/component/attachment/AttachmentBox.scss'
import ButtonGroupStyles from 'classicSrc/component/button/ButtonGroup.scss'
import ButtonIconStyles from 'classicSrc/component/button/ButtonIcon.scss'
import ChannelChoiceMenuStyles from 'classicSrc/component/channelChoice/ChannelChoiceMenu.scss'
import ChatOnlineStyles from 'classicSrc/component/chat/ChatOnline.scss'
import UserProfileStyles from 'classicSrc/component/chat/UserProfile.scss'
import ChatAttachmentStyles from 'classicSrc/component/chat/attachment/Attachment.scss'
import ChatLogStyles from 'classicSrc/component/chat/chatting/ChatLog.scss'
import HistoryLogStyles from 'classicSrc/component/chat/chatting/HistoryLog.scss'
import ChattHistoryScreenStyles from 'classicSrc/component/chat/chatting/chatHistoryScreen/styles/index.scss'
import ChatGroupStyles from 'classicSrc/component/chat/chatting/log/messages/ChatGroup.scss'
import ButtonCardStyles from 'classicSrc/component/chat/chatting/structuredMessage/ButtonCard.scss'
import PanelCardStyles from 'classicSrc/component/chat/chatting/structuredMessage/PanelCard.scss'
import PrechatScreenStyles from 'classicSrc/component/chat/prechat/PrechatScreen.scss'
import ContainerStyles from 'classicSrc/component/container/Container.scss'
import FrameStyles from 'classicSrc/component/frame/Frame.scss'
import LoadingEllipsesStyles from 'classicSrc/component/loading/LoadingEllipses.scss'
import SharedComponentStyles from 'classicSrc/component/shared/styles'
import componentStyles from 'classicSrc/components/styles'
import { sharedStyles } from 'classicSrc/embed/sharedStyles'

export const webWidgetStyles = `
  ${sharedStyles}
  ${AttachmentBoxStyles}
  ${ButtonIconStyles}
  ${ButtonGroupStyles}
  ${ChannelChoiceMenuStyles}
  ${ChatAttachmentStyles}
  ${ChattHistoryScreenStyles}
  ${ChatGroupStyles}
  ${ChatLogStyles}
  ${HistoryLogStyles}
  ${UserProfileStyles}
  ${ChatOnlineStyles}
  ${PrechatScreenStyles}
  ${ContainerStyles}
  ${LoadingEllipsesStyles}
  ${SharedComponentStyles}
  ${FrameStyles}
  ${PanelCardStyles}
  ${ButtonCardStyles}
  ${componentStyles}
`
