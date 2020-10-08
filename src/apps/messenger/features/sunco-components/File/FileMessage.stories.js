import React from 'react'
import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'
import FileMessage from './'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

export default {
  title: 'Sunco/File Message',
  component: FileMessage,
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
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  mediaSize: 1000,
  mediaUrl: 'this is a url.com',
  isPrimaryParticipant: true,
  shape: 'standalone'
}

export const OtherParticipantFileMessage = Template.bind()
OtherParticipantFileMessage.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  mediaSize: 1000,
  mediaUrl: 'this is a url.com',
  isPrimaryParticipant: false,
  shape: 'standalone'
}

export const OtherParticipantFileMessageWithLongName = Template.bind()
OtherParticipantFileMessageWithLongName.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  mediaSize: 1000,
  mediaUrl:
    'https://www.wildlife.vic.gov.au/__data/assets/pdf_file/0025/91384/Emus-are-big-and-have-long-necks-how-cool-are-they-so-cool.pdf',
  isPrimaryParticipant: false,
  shape: 'standalone'
}
