import ConversationScreenStyles from './ConversationScreen.scss'
import FooterStyles from './footer/Footer.scss'
import MessageGroupStyles from './messageGroup/MessageGroup.scss'

import MessageGroupMessagesStyles from './messageGroup/messages/style.scss'
import MessageGroupResultsStyles from './messageGroup/messages/results/style.scss'
import MessageGroupBotTypingStyles from './messageGroup/messages/botTyping/style.scss'
import MessageGroupChannelChoiceStyles from './messageGroup/messages/channelChoice/style.scss'
import MessageGroupFeedbackStyles from './messageGroup/messages/feedback/style.scss'

export const conversationScreenStyles = `
  ${ConversationScreenStyles}
  ${FooterStyles}
  ${MessageGroupStyles}
  ${MessageGroupMessagesStyles}
  ${MessageGroupResultsStyles}
  ${MessageGroupChannelChoiceStyles}
  ${MessageGroupFeedbackStyles}
  ${MessageGroupBotTypingStyles}
`
