import AttachmentBoxStyles from 'src/component/attachment/AttachmentBox.scss'
import ButtonIconStyles from 'component/button/ButtonIcon.scss'
import ButtonGroupStyles from 'component/button/ButtonGroup.scss'
import ChannelChoiceMenuStyles from 'component/channelChoice/ChannelChoiceMenu.scss'
import ChatAttachmentStyles from 'component/chat/attachment/Attachment.scss'
import ChatGroupStyles from 'component/chat/chatting/log/messages/ChatGroup.scss'
import ChatLogStyles from 'component/chat/chatting/ChatLog.scss'
import HistoryLogStyles from 'component/chat/chatting/HistoryLog.scss'
import UserProfileStyles from 'component/chat/UserProfile.scss'
import ChatOnlineStyles from 'component/chat/ChatOnline.scss'
import ChattHistoryScreenStyles from 'component/chat/chatting/chatHistoryScreen/styles/index.scss'
import PrechatScreenStyles from 'component/chat/prechat/PrechatScreen.scss'
import ContainerStyles from 'component/container/Container.scss'
import LoadingEllipsesStyles from 'component/loading/LoadingEllipses.scss'
import FrameStyles from 'component/frame/Frame.scss'
import PanelCardStyles from 'component/chat/chatting/structuredMessage/PanelCard.scss'
import ButtonCardStyles from 'component/chat/chatting/structuredMessage/ButtonCard.scss'

import SharedComponentStyles from 'component/shared/styles'
import { sharedStyles } from 'embed/sharedStyles'
import componentStyles from 'src/components/styles'

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
