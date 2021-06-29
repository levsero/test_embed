import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import FileMessage from './'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator,
} from '../../../.storybook/decorators'

export default {
  title: 'Messages/FileMessage',
  component: FileMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    shape: {
      defaultValue: MESSAGE_BUBBLE_SHAPES.standalone,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_BUBBLE_SHAPES),
      },
    },
  },
}

const Template = (args) => <FileMessage {...args} />
const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const defaultProps = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds,
}

export const PrimaryParticipantFileMessage = Template.bind()
PrimaryParticipantFileMessage.args = {
  ...defaultProps,
  isPrimaryParticipant: true,
  mediaUrl: 'https://testEndpoint.test/attachments/abc123.pdf',
  mediaSize: 1000,
}

export const PrimaryParticipantFileMessageWithSetFileName = Template.bind()
PrimaryParticipantFileMessageWithSetFileName.args = {
  ...defaultProps,
  isPrimaryParticipant: true,
  mediaUrl: 'https://testEndpoint.test/attachments/abc123.pdf',
  mediaSize: 1000,
  fileName: 'Another name.pdf',
}

export const OtherParticipantFileMessage = Template.bind()
OtherParticipantFileMessage.args = {
  ...defaultProps,
  isPrimaryParticipant: false,
  mediaUrl: 'https://testEndpoint.test/attachments/?name=abc123.pdf',
  mediaSize: 1000,
}

export const OtherParticipantFileMessageWithLongUrlFileName = Template.bind()
OtherParticipantFileMessageWithLongUrlFileName.args = {
  ...defaultProps,
  isPrimaryParticipant: false,
  mediaUrl:
    'https://www.wildlife.vic.gov.au/__data/assets/pdf_file/0025/91384/Emus-are-big-and-have-long-necks-how-cool-are-they-so-cool.pdf',
  mediaSize: 1000,
}
