import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import ImageMessage from './'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator
} from '../../../.storybook/decorators'

export default {
  title: 'Messages/ImageMessage',
  component: ImageMessage,
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

const Template = args => <ImageMessage {...args} />

export const StandaloneImageWithText = Template.bind()
StandaloneImageWithText.args = {
  isPrimaryParticipant: false,
  shape: 'standalone',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  text: 'Emus are lovely'
}

export const StandaloneImageWithLink = Template.bind()
StandaloneImageWithLink.args = {
  isPrimaryParticipant: false,
  shape: 'standalone',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  text:
    'Emus are lovely, for more information on the resilience of emus, go to https://en.wikipedia.org/wiki/Emu_War'
}

export const StandaloneImageWithNoText = Template.bind()
StandaloneImageWithNoText.args = {
  isPrimaryParticipant: false,
  shape: 'standalone',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  text: ''
}
