import { MessengerContainer, MessengerHeader, MessengerFooter } from 'src/'
import MessageLogError from 'src/messenger/MessageLogStatus/MessageLogError'

export default {
  title: 'Messenger/MessageLogError',
  component: MessageLogError,
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
    <MessageLogError />
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
    <MessageLogError />
  </MessengerContainer>
)
