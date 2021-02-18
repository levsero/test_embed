import MessengerHeader from './'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'

export default {
  title: 'Messenger/MessengerHeader',
  component: MessengerHeader,
  decorators: [MessengerContainerDecorator],
}

const Template = (args) => <MessengerHeader {...args} />

export const AllFields = Template.bind()
AllFields.args = {
  title: 'My company title',
  description: 'a catchy little punchline',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  showCloseButton: true,
}

export const TitleOnly = Template.bind()
TitleOnly.args = {
  title: 'My company title',
}

export const TitleAndDescription = Template.bind()
TitleAndDescription.args = {
  title: 'My company title',
  description: 'a catchy little punchline',
}

export const TitleAndAvatar = Template.bind()
TitleAndAvatar.args = {
  title: 'My company title',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
}
