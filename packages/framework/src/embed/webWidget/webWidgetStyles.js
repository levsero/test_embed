import { sharedStyles } from 'embed/sharedStyles'
import AttachmentBoxStyles from 'src/component/attachment/AttachmentBox.scss'
import ButtonGroupStyles from 'src/component/button/ButtonGroup.scss'
import ButtonIconStyles from 'src/component/button/ButtonIcon.scss'
import ChannelChoiceMenuStyles from 'src/component/channelChoice/ChannelChoiceMenu.scss'
import ChatOnlineStyles from 'src/component/chat/ChatOnline.scss'
import UserProfileStyles from 'src/component/chat/UserProfile.scss'
import ChatAttachmentStyles from 'src/component/chat/attachment/Attachment.scss'
import ChatLogStyles from 'src/component/chat/chatting/ChatLog.scss'
import HistoryLogStyles from 'src/component/chat/chatting/HistoryLog.scss'
import ChattHistoryScreenStyles from 'src/component/chat/chatting/chatHistoryScreen/styles/index.scss'
import ChatGroupStyles from 'src/component/chat/chatting/log/messages/ChatGroup.scss'
import ButtonCardStyles from 'src/component/chat/chatting/structuredMessage/ButtonCard.scss'
import PanelCardStyles from 'src/component/chat/chatting/structuredMessage/PanelCard.scss'
import PrechatScreenStyles from 'src/component/chat/prechat/PrechatScreen.scss'
import ContainerStyles from 'src/component/container/Container.scss'
import FrameStyles from 'src/component/frame/Frame.scss'
import LoadingEllipsesStyles from 'src/component/loading/LoadingEllipses.scss'
import SharedComponentStyles from 'src/component/shared/styles'
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
