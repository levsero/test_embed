import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import MessageLogList from 'src/messenger/MessageLogList'
import MessengerContainer from 'src/messenger/MessengerContainer'

export const MessengerContainerDecorator = (Story) => (
  <MessengerContainer>{Story()}</MessengerContainer>
)

export const ChannelLinkContainerDecorator = (Story) => (
  <ChannelLinkContainer>{Story()}</ChannelLinkContainer>
)

export const MessageLogListDecorator = (Story) => (
  <MessageLogList>
    <Story />
  </MessageLogList>
)
