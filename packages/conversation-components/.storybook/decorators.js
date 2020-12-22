import MessengerContainer from 'src/messenger/MessengerContainer'

export const MessengerContainerDecorator = (Story) => (
  <MessengerContainer>
    <Story />
  </MessengerContainer>
)
