import React from 'react'
import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'
import ImageMessage from './'
export default {
  title: 'Sunco/Image Message',
  component: ImageMessage,
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

const Template = args => <ImageMessage {...args} />

export const StandaloneImageWithText = Template.bind()
StandaloneImageWithText.args = {
  isPrimaryParticipant: false,
  shape: 'standalone',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  text: 'Emus are lovely'
}

export const StandaloneImageWithNoText = Template.bind()
StandaloneImageWithNoText.args = {
  isPrimaryParticipant: false,
  shape: 'standalone',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  text: ''
}
