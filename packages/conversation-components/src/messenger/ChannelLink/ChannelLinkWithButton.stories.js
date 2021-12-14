import { withDesign } from 'storybook-addon-designs'
import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import { figmaAddOn, figmaUrl } from '../../../.storybook/figma'
import ChannelLinkWithButton from './ChannelLinkWithButton'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithButton,
  decorators: [MessengerContainerDecorator, withDesign],
}

export const LinkUsingButton = (args) => {
  return (
    <ChannelLinkContainer>
      <ChannelLinkWithButton {...args} />
    </ChannelLinkContainer>
  )
}
LinkUsingButton.args = {
  channelId: 'messenger',
  url: 'www.awesomeurl.com',
  status: 'success',
}

LinkUsingButton.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.channelLinking,
  },
}
