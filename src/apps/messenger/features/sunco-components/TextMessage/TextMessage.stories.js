import React from 'react'
import {
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS
} from 'src/apps/messenger/features/sunco-components/constants'
import TextMessage from './'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'

export default {
  title: 'Sunco/Text Message',
  component: TextMessage,
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

export const EmptyTextMessage = Template.bind()
EmptyTextMessage.args = {
  isPrimaryParticipant: true,
  shape: 'standalone',
  text: ''
}

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

export const MessageLogText = args => (
  <PrimaryParticipantLayout
    isFirstInGroup={false}
    avatar={undefined}
    label={undefined}
    isLastInLog={true}
    timeReceived={Date.now() / 1000}
    status={args.status}
  >
    <TextMessage {...args} />
  </PrimaryParticipantLayout>
)

MessageLogText.args = {
  isPrimaryParticipant: true,
  shape: 'standalone',
  text:
    'The emu (Dromaius novaehollandiae) is the second-largest living bird by height, after its ratite relative, the ostrich. It is endemic to Australia where it is the largest native bird and the only extant member of the genus Dromaius.'
}

MessageLogText.argTypes = {
  status: {
    defaultValue: MESSAGE_STATUS.sending,
    control: {
      type: 'inline-radio',
      options: Object.values(MESSAGE_STATUS)
    }
  }
}
