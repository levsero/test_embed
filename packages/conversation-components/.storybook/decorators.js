import MessengerContainer from 'src/messenger/MessengerContainer'
import MessageLogList from 'src/messenger/MessageLogList'

export const MessengerContainerDecorator = Story => (
  <MessengerContainer>
    <Story />
  </MessengerContainer>
)

export const MessageLogListDecorator = Story => (
  <MessageLogList>
    <Story />
  </MessageLogList>
)
