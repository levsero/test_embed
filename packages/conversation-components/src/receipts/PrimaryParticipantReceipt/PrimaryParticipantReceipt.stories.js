/* eslint no-console:0 */
import { MESSAGE_STATUS } from 'src/constants'
import PrimaryParticipantReceipt from './'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator,
} from '../../../.storybook/decorators'

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const oneMinute = 60
const fifteenMinutes = 15 * oneMinute

export default {
  title: 'Components/PrimaryParticipantReceipt',
  component: PrimaryParticipantReceipt,
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
    status: {
      defaultValue: MESSAGE_STATUS.sent,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_STATUS),
      },
    },
  },
}

const Template = (args) => <PrimaryParticipantReceipt {...args} />

export const DefaultReceipt = Template.bind()
DefaultReceipt.args = {
  timeReceived: timeNowInSeconds,
  onRetry: () => console.log('onRetry callback fired'),
}
