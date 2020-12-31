import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import MessageBubble from './'

export default {
  title: 'Components/MessageBubble',
  component: MessageBubble,
  argTypes: {
    isPrimaryParticipant: {
      defaultValue: true
    },
    shape: {
      defaultValue: MESSAGE_BUBBLE_SHAPES.standalone,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_BUBBLE_SHAPES)
      }
    }
  }
}

export const WithText = args => (
  <MessageBubble {...args}>
    <p>Message bubble contains no inner styling by default</p>
  </MessageBubble>
)

export const WithPaddedText = args => (
  <MessageBubble {...args}>
    <p style={{ padding: '8px 12px' }}>Custom styled padded text</p>
  </MessageBubble>
)
