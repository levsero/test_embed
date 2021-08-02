import { MessengerContainerDecorator } from '../../.storybook/decorators'
import { NOTIFICATION_TYPES } from '../constants'
import Notification from './index'

export default {
  title: 'Components/Notification',
  component: Notification,
  decorators: [MessengerContainerDecorator],
  argTypes: {
    messageType: {
      defaultValue: 'connectError',
      control: {
        type: 'select',
        options: Object.values(NOTIFICATION_TYPES),
      },
    },
  },
}

const Template = (args) => <Notification {...args} />

export const Default = Template.bind()
Default.args = {
  messageType: NOTIFICATION_TYPES.connectError,
}
