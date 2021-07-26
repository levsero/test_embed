/* eslint no-console:0 */
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import MessengerFooter from './'

export default {
  title: 'Messenger/MessengerFooter',
  component: MessengerFooter,
  decorators: [MessengerContainerDecorator],
}

const Template = (args) => <MessengerFooter {...args} />

export const EmptyFooter = Template.bind()
EmptyFooter.args = {
  onSendMessage: (value) => console.log('Footer send message: ', value),
}
