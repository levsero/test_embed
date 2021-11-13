import {
  MessengerContainer,
  MessengerHeader,
  MessengerFooter,
  MessageLogHistoryError,
  MessageLogList,
  MessengerBody,
} from 'src/index'
import Dropzone from './index'

export default {
  title: 'Messenger/Dropzone',
  component: Dropzone,
  argTypes: {
    forceDisplay: {
      defaultValue: true,
      control: {
        type: 'inline-radio',
        options: [true, false],
      },
    },
    children: { table: { disable: true } },
  },
}

export const Default = (args) => {
  return (
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
        <Dropzone {...args} onDrop={() => {}} />
        <MessageLogList>
          <MessageLogHistoryError />
        </MessageLogList>
      </MessengerBody>
      <MessengerFooter />
    </MessengerContainer>
  )
}
