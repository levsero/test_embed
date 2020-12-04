import React from 'react'
import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'
import MessageBubble from './'

export default {
  title: 'Sunco/Message Bubble',
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

export const Empty = args => <MessageBubble {...args} />

export const WithText = args => (
  <MessageBubble {...args}>
    <p>Some dummy text</p>
  </MessageBubble>
)

export const WithPaddedText = args => (
  <MessageBubble {...args}>
    <p style={{ padding: '8px 12px' }}>Some padded text</p>
  </MessageBubble>
)
