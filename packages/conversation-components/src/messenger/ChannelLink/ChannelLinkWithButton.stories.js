/* eslint-disable no-console */
import {
  MessengerContainerDecorator,
  ChannelLinkContainerDecorator,
} from '../../../.storybook/decorators'
import ChannelLinkWithButton from './ChannelLinkWithButton'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithButton,
  decorators: [ChannelLinkContainerDecorator, MessengerContainerDecorator],
}

const Template = (args) => <ChannelLinkWithButton {...args} />

export const LinkUsingButton = Template.bind()
LinkUsingButton.args = {
  channelId: 'messenger',
  url: 'www.awesomeurl.com',
  handleBackButtonClick: () => console.log('Close Clicked'),
}
