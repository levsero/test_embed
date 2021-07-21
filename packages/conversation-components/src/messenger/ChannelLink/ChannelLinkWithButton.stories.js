/* eslint-disable no-console */
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import { ChannelLinkWithButton } from '.'

export default {
  title: 'Messenger/ChannelLink',
  component: ChannelLinkWithButton,
  decorators: [MessengerContainerDecorator],
}

const Template = (args) => <ChannelLinkWithButton {...args} />

export const LinkUsingButton = Template.bind()
LinkUsingButton.args = {
  channelId: 'messenger',
  url: 'www.awesomeurl.com',
  handleBackButtonClick: () => console.log('Close Clicked'),
}
