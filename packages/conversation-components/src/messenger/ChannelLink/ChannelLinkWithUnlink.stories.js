/* eslint-disable no-console */
import {
  MessengerContainerDecorator,
  ChannelLinkContainerDecorator,
} from '../../../.storybook/decorators'
import ChannelLinkWithUnlink from './ChannelLinkWithUnlink'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithUnlink,
  decorators: [ChannelLinkContainerDecorator, MessengerContainerDecorator],
}

const Template = (args) => <ChannelLinkWithUnlink {...args} />

export const LinkWithUnlink = Template.bind()
LinkWithUnlink.args = {
  channelId: 'messenger',
  onDisconnect: () => console.log('Disconnect clicked'),
}
