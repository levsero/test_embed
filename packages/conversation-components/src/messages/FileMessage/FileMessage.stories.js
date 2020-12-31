import { MESSAGE_BUBBLE_SHAPES } from 'src/constants'
import FileMessage from './'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator
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
        options: Object.values(MESSAGE_BUBBLE_SHAPES)
      }
    }
  }
}

const Template = args => <FileMessage {...args} />

export const PrimaryParticipantFileMessage = Template.bind()
PrimaryParticipantFileMessage.args = {
  mediaSize: 1000,
  mediaUrl: 'this is a url.com',
  isPrimaryParticipant: true,
  shape: 'standalone'
}

export const OtherParticipantFileMessage = Template.bind()
OtherParticipantFileMessage.args = {
  mediaSize: 1000,
  mediaUrl: 'this is a url.com',
  isPrimaryParticipant: false,
  shape: 'standalone'
}

export const OtherParticipantFileMessageWithLongName = Template.bind()
OtherParticipantFileMessageWithLongName.args = {
  mediaSize: 1000,
  mediaUrl:
    'https://www.wildlife.vic.gov.au/__data/assets/pdf_file/0025/91384/Emus-are-big-and-have-long-necks-how-cool-are-they-so-cool.pdf',
  isPrimaryParticipant: false,
  shape: 'standalone'
}
