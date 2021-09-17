import { MessengerContainer, MessengerHeader, MessengerFooter } from 'src/'
import MessageLogSpinner from 'src/messenger/MessageLogStatus/MessageLogSpinner'

export default {
  title: 'Messenger/MessageLogSpinner',
  component: MessageLogSpinner,
}

export const WithFooter = () => (
  <MessengerContainer>
    <MessengerHeader>
      <MessengerHeader.Content
        title="Augustine"
        description="Cats sister says hi"
        avatar="https://lucashills.com/emu_avatar.jpg"
      />
      <MessengerHeader.Close />
    </MessengerHeader>
    <MessageLogSpinner />
    <MessengerFooter />
  </MessengerContainer>
)

export const WithoutFooter = () => (
  <MessengerContainer>
    <MessengerHeader>
      <MessengerHeader.Content
        title="Augustine"
        description="Cats sister says hi"
        avatar="https://lucashills.com/emu_avatar.jpg"
      />
      <MessengerHeader.Close />
    </MessengerHeader>
    <MessageLogSpinner />
  </MessengerContainer>
)
