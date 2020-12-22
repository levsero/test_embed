import MessengerContainer from './'

export default {
  title: 'Messenger/MessengerContainer',
  component: MessengerContainer
}

const Template = args => <MessengerContainer {...args} />

export const EmptyContainer = Template.bind()
EmptyContainer.args = {}
