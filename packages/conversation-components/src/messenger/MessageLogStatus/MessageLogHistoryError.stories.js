import {
  MessengerContainer,
  MessengerHeader,
  MessengerFooter,
  MessageLogHistoryError,
  MessageLogList,
  MessengerBody,
  MessageLogError,
} from 'src/index'

export default {
  title: 'Messenger/MessageLogHistoryError',
  component: MessageLogError,
}

export const Basic = () => (
  <MessengerContainer>
    <MessengerHeader>
      <MessengerHeader.Content
        title="Augustine"
        description="Cats sister says hi"
        avatar="https://lucashills.com/emu_avatar.jpg"
      />
      <MessengerHeader.Close />
    </MessengerHeader>
    <MessengerBody>
      <MessageLogList>
        <MessageLogHistoryError />
      </MessageLogList>
    </MessengerBody>
    <MessengerFooter />
  </MessengerContainer>
)
