import OtherParticipantReceipt from './'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator,
} from '../../../.storybook/decorators'

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const oneMinute = 60
const fifteenMinutes = 15 * oneMinute

export default {
  title: 'Components/OtherParticipantReceipt',
  component: OtherParticipantReceipt,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    timeReceived: {
      control: {
        type: 'range',
        defaultValue: timeNowInSeconds,
        min: timeNowInSeconds - fifteenMinutes,
        max: timeNowInSeconds,
        step: oneMinute,
      },
    },
  },
}

const Template = (args) => <OtherParticipantReceipt {...args} />

export const DefaultReceipt = Template.bind()
DefaultReceipt.args = {
  timeReceived: timeNowInSeconds,
}
