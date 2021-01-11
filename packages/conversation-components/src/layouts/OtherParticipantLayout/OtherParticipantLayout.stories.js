import styled from 'styled-components'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator
} from '../../../.storybook/decorators'
import OtherParticipantLayout from './'

export default {
  title: 'Components/OtherParticipantLayout',
  component: OtherParticipantLayout,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator]
}

const DummyMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  border: 1px solid #000;
`

const Template = args => (
  <OtherParticipantLayout {...args}>
    <DummyMessageContainer>Component children get inserted here</DummyMessageContainer>
  </OtherParticipantLayout>
)

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
export const EmptyLayout = Template.bind()
EmptyLayout.args = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds
}
