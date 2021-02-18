import styled from 'styled-components'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator,
} from '../../../.storybook/decorators'
import { MESSAGE_STATUS } from 'src/constants'
import PrimaryParticipantLayout from './'

export default {
  title: 'Components/PrimaryParticipantLayout',
  component: PrimaryParticipantLayout,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    status: {
      defaultValue: MESSAGE_STATUS.sent,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_STATUS),
      },
    },
  },
}

const DummyMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  border: 1px solid #000;
`

const Template = (args) => (
  <PrimaryParticipantLayout {...args}>
    <DummyMessageContainer>Component children get inserted here</DummyMessageContainer>
  </PrimaryParticipantLayout>
)

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
export const EmptyLayoutt = Template.bind()
EmptyLayoutt.args = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds,
}
