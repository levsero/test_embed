/* eslint no-console:0 */
import MessengerFooter from './'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'

export default {
  title: 'Messenger/MessengerFooter',
  component: MessengerFooter,
  decorators: [MessengerContainerDecorator]
}

const Template = args => <MessengerFooter {...args} />

export const EmptyFooter = Template.bind()
EmptyFooter.args = {
  onSendMessage: value => console.log('Footer send message: ', value)
}
