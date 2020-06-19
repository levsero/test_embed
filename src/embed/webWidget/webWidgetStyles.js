import AttachmentBoxStyles from 'src/component/attachment/AttachmentBox.scss'
import ButtonIconStyles from 'component/button/ButtonIcon.scss'
import ButtonGroupStyles from 'component/button/ButtonGroup.scss'
import ChannelChoiceMenuStyles from 'component/channelChoice/ChannelChoiceMenu.scss'
import ChatAttachmentStyles from 'component/chat/attachment/Attachment.scss'
import PrechatFormStyles from 'component/chat/prechat/PrechatForm.scss'
import ChatGroupStyles from 'component/chat/chatting/log/messages/ChatGroup.scss'
import ChatLogStyles from 'component/chat/chatting/ChatLog.scss'
import HistoryLogStyles from 'component/chat/chatting/HistoryLog.scss'
import ChatOfflineFormStyles from 'component/chat/ChatOfflineForm.scss'
import UserProfileStyles from 'component/chat/UserProfile.scss'
import ChatOnlineStyles from 'component/chat/ChatOnline.scss'
import ChattHistoryScreenStyles from 'component/chat/chatting/chatHistoryScreen/styles/index.scss'
import PrechatScreenStyles from 'component/chat/prechat/PrechatScreen.scss'
import ContainerStyles from 'component/container/Container.scss'
import ImageMessageStyles from 'component/chat/chatting/ImageMessage.scss'
import LoadingEllipsesStyles from 'component/loading/LoadingEllipses.scss'
import FrameStyles from 'component/frame/Frame.scss'
import PanelCardStyles from 'component/chat/chatting/structuredMessage/PanelCard.scss'
import ButtonCardStyles from 'component/chat/chatting/structuredMessage/ButtonCard.scss'

import SharedComponentStyles from 'component/shared/styles'
import { sharedStyles } from 'embed/sharedStyles'
import gardenStyles from 'embed/gardenStyles'
import componentStyles from 'src/components/styles'

export const webWidgetStyles = `
  ${sharedStyles}
  ${gardenStyles}
  ${AttachmentBoxStyles}
  ${ButtonIconStyles}
  ${ButtonGroupStyles}
  ${ChannelChoiceMenuStyles}
  ${ChatAttachmentStyles}
  ${ChattHistoryScreenStyles}
  ${PrechatFormStyles}
  ${ChatGroupStyles}
  ${ChatLogStyles}
  ${HistoryLogStyles}
  ${ChatOfflineFormStyles}
  ${UserProfileStyles}
  ${ChatOnlineStyles}
  ${PrechatScreenStyles}
  ${ContainerStyles}
  ${ImageMessageStyles}
  ${LoadingEllipsesStyles}
  ${SharedComponentStyles}
  ${FrameStyles}
  ${PanelCardStyles}
  ${ButtonCardStyles}
  ${componentStyles}
`
