/* eslint no-console:0 */
import Footer from './'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'

export default {
  title: 'Messenger/Footer',
  component: Footer,
  decorators: [MessengerContainerDecorator]
}

const Template = args => <Footer {...args} />

export const EmptyFooter = Template.bind()
EmptyFooter.args = {
  onSendMessage: value => console.log('Footer send message: ', value)
}
