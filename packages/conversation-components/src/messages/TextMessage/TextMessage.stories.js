import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import TextMessage from './'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator
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
        options: Object.values(MESSAGE_BUBBLE_SHAPES)
      }
    }
  }
}

const Template = args => <TextMessage {...args} />

export const ShortMessage = Template.bind()
ShortMessage.args = {
  isPrimaryParticipant: true,
  shape: 'standalone',
  text: 'Emus are lovely'
}

export const LongMessage = Template.bind()
LongMessage.args = {
  isPrimaryParticipant: true,
  shape: 'standalone',
  text:
    'The emu (Dromaius novaehollandiae) is the second-largest living bird by height, after its ratite relative, the ostrich. It is endemic to Australia where it is the largest native bird and the only extant member of the genus Dromaius.'
}

export const UrlMessage = Template.bind()
UrlMessage.args = {
  isPrimaryParticipant: true,
  shape: 'standalone',
  text: 'For more results, go to www.google.com'
}
