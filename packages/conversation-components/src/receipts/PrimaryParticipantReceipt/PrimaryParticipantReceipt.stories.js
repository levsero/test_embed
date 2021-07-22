/* eslint no-console:0 */
import { MESSAGE_STATUS } from 'src/constants'
import {
  MessengerContainerDecorator,
  MessageLogListDecorator,
} from '../../../.storybook/decorators'
import PrimaryParticipantReceipt from './'

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)

export default {
  title: 'Components/PrimaryParticipantReceipt',
  component: PrimaryParticipantReceipt,
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

const Template = (args) => <PrimaryParticipantReceipt {...args} />

export const DefaultReceipt = Template.bind()
DefaultReceipt.args = {
  timeReceived: timeNowInSeconds,
  onRetry: () => console.log('onRetry callback fired'),
}
