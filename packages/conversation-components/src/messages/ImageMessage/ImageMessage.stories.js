import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS, MESSAGE_TYPES } from 'src/constants'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator,
} from '../../../.storybook/decorators'
import ImageMessage from './'

export default {
  title: 'Messages/ImageMessage',
  component: ImageMessage,
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

const Template = (args) => <ImageMessage {...args} />
const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const defaultProps = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  mediaUrl:
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Emu_in_the_wild-1%2B_%282153629669%29.jpg',
  timeReceived: timeNowInSeconds,
}

const defaultPrimaryParticipantProps = {
  isPrimaryParticipant: true,
  errorReason: 'unknown',
  type: MESSAGE_TYPES.image,
}

export const PrimaryParticipantImageMessageWithNoText = Template.bind()
PrimaryParticipantImageMessageWithNoText.args = {
  ...defaultProps,
  ...defaultPrimaryParticipantProps,
}

export const PrimaryParticipantImageMessageWithText = Template.bind()
PrimaryParticipantImageMessageWithText.args = {
  ...defaultProps,
  ...defaultPrimaryParticipantProps,
  mediaSize: 1000,
  alt: 'Emu',
  text: 'Emus are lovely',
}

export const PrimaryParticipantImageMessageWithLink = Template.bind()
PrimaryParticipantImageMessageWithLink.args = {
  ...defaultProps,
  ...defaultPrimaryParticipantProps,
  alt: 'Emu',
  text:
    'Emus are lovely, for more information on the resilience of emus, go to https://en.wikipedia.org/wiki/Emu_War',
}

export const OtherParticipantImageMessageWithText = Template.bind()
OtherParticipantImageMessageWithText.args = {
  ...defaultProps,
  isPrimaryParticipant: false,
  alt: 'Emu',
  text: 'Emus are lovely',
}

export const OtherParticipantImageMessageWithLink = Template.bind()
OtherParticipantImageMessageWithLink.args = {
  ...defaultProps,
  isPrimaryParticipant: false,
  alt: 'Emu',
  text:
    'Emus are lovely, for more information on the resilience of emus, go to https://en.wikipedia.org/wiki/Emu_War',
}

export const OtherParticipantImageMessageWithNoText = Template.bind()
OtherParticipantImageMessageWithNoText.args = {
  ...defaultProps,
  isPrimaryParticipant: false,
  alt: 'Emu',
}
