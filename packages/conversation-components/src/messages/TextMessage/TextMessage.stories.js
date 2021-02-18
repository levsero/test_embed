import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import TextMessage from './'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator,
} from '../../../.storybook/decorators'

export default {
  title: 'Messages/TextMessage',
  component: TextMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    shape: {
      defaultValue: MESSAGE_BUBBLE_SHAPES.standalone,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_BUBBLE_SHAPES),
      },
    },
    status: {
      defaultValue: MESSAGE_STATUS.sent,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_STATUS),
      },
    },
  },
}

const Template = (args) => <TextMessage {...args} />
const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const defaultProps = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds,
}

export const ShortMessage = Template.bind()
ShortMessage.args = {
  ...defaultProps,
  text: 'Emus are lovely',
}

export const LongMessage = Template.bind()
LongMessage.args = {
  ...defaultProps,
  text:
    'The emu (Dromaius novaehollandiae) is the second-largest living bird by height, after its ratite relative, the ostrich. It is endemic to Australia where it is the largest native bird and the only extant member of the genus Dromaius.',
}

export const UrlMessage = Template.bind()
UrlMessage.args = {
  ...defaultProps,
  text: 'For more results, go to www.google.com',
}
