import OtherParticipantReceipt from './'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator
} from '../../../.storybook/decorators'

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)

export default {
  title: 'Components/OtherParticipantReceipt',
  component: OtherParticipantReceipt,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator]
}

const Template = args => <OtherParticipantReceipt {...args} />

export const DefaultReceipt = Template.bind()
DefaultReceipt.args = {
  timeReceived: timeNowInSeconds
}
