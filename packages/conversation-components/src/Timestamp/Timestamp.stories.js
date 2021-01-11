import Timestamp from './'
import { MessengerContainerDecorator, MessageLogListDecorator } from '../../.storybook/decorators'

export default {
  title: 'Components/Timestamp',
  component: Timestamp,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator]
}

const Template = args => <Timestamp {...args} />

export const TimeNowish = Template.bind()
TimeNowish.args = {
  timestamp: new Date().getTime()
}

export const FiveDaysAgo = Template.bind()
FiveDaysAgo.args = {
  timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 5
}
