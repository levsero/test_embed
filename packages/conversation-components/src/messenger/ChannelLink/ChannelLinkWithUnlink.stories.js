/* eslint-disable no-console */
import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import ChannelLinkWithUnlink from './ChannelLinkWithUnlink'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithUnlink,
  decorators: [MessengerContainerDecorator],
}

export const LinkWithUnlink = (args) => {
  return (
    <ChannelLinkContainer>
      <ChannelLinkWithUnlink {...args} />
    </ChannelLinkContainer>
  )
}

LinkWithUnlink.args = {
  channelId: 'messenger',
  onDisconnect: () => console.log('Disconnect clicked'),
}
