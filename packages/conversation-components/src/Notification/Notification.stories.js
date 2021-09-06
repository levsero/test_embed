import ThemeProvider from 'src/ThemeProvider'
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

// eslint-disable-next-line react/prop-types
const Template = ({ isFullScreen, ...args }) => (
  <ThemeProvider isFullScreen={isFullScreen}>
    <Notification {...args} />
  </ThemeProvider>
)

export const Default = Template.bind()
Default.args = {
  messageType: NOTIFICATION_TYPES.connectError,
  isFullScreen: false,
}
