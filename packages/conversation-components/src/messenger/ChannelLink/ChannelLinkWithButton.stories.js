import ChannelLinkContainer from 'src/messenger/ChannelLinkContainer'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import ChannelLinkWithButton from './ChannelLinkWithButton'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithButton,
  decorators: [MessengerContainerDecorator],
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
