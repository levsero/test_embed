import MessengerContainer from 'src/messenger/MessengerContainer'

export const MessengerContainerDecorator = (Story) => {
  return (
    <MessengerContainer>
      <Story />
    </MessengerContainer>
  )
}
