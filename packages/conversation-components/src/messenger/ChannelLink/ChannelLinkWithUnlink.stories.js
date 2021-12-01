/* eslint-disable no-console */
import { withDesign } from 'storybook-addon-designs'
import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import { figmaAddOn, figmaUrl } from '../../../.storybook/figma'
import ChannelLinkWithUnlink from './ChannelLinkWithUnlink'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithUnlink,
  decorators: [MessengerContainerDecorator, withDesign],
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

LinkWithUnlink.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.channelLinking,
  },
}
