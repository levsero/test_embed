import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import MessengerHeader from './index'

export default {
  title: 'Messenger/MessengerHeader',
  component: MessengerHeader,
  decorators: [MessengerContainerDecorator],
}

const channels = {
  messenger: true,
  instagram: false,
  whatsapp: undefined,
}

const Template = (args) => (
  <MessengerHeader {...args}>
    <MessengerHeader.Content
      title={args.title}
      description={args.description}
      avatar={args.avatar}
    />
    {args.showMenu && <MessengerHeader.Menu isOpen={args.isMenuOpen} channels={channels} />}
    {args.showCloseButton && <MessengerHeader.Close />}
  </MessengerHeader>
)

export const AllFields = Template.bind()
AllFields.args = {
  title: 'My company title',
  description: 'a catchy little punchline',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  showCloseButton: true,
  isMenuOpen: true,
  showMenu: true,
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

export const TitleAndAvatarAndDescription = Template.bind()
TitleAndAvatarAndDescription.args = {
  title: 'My company title',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  description: 'a catchy little punchline',
}

export const TitleAndControls = Template.bind()
TitleAndControls.args = {
  title: 'My company title',
  showMenu: true,
  showCloseButton: true,
}

export const TitleAndDescriptionAndControls = Template.bind()
TitleAndDescriptionAndControls.args = {
  title: 'My company title',
  description: 'a catchy little punchline',
  showMenu: true,
  showCloseButton: true,
}

export const TitleAndAvatarAndDescriptionAndControls = Template.bind()
TitleAndAvatarAndDescriptionAndControls.args = {
  title: 'My company title',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  description: 'a catchy little punchline',
  showMenu: true,
  showCloseButton: true,
}
