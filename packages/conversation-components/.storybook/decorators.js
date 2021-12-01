import MessageLogList from 'src/messenger/MessageLogList'
import MessengerContainer from 'src/messenger/MessengerContainer'

export const MessengerContainerDecorator = (Story) => (
  <MessengerContainer>{Story()}</MessengerContainer>
)

export const MessageLogListDecorator = (Story) => (
  <MessageLogList>
    <Story />
  </MessageLogList>
)
