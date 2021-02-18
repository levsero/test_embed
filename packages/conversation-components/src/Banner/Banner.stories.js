import { BANNER_STATUS } from '../constants'
import { MessengerContainerDecorator } from '../../.storybook/decorators'
import Banner from './'

export default {
  title: 'Components/Banner',
  component: Banner,
  decorators: [MessengerContainerDecorator],
  argTypes: {
    status: {
      defaultValue: BANNER_STATUS.success,
      control: {
        type: 'inline-radio',
        options: Object.values(BANNER_STATUS),
      },
    },
  },
}

const Template = (args) => <Banner {...args} />

export const OnlineBanner = Template.bind()
OnlineBanner.args = {
  status: BANNER_STATUS.success,
  message: "You're back online!",
}

export const OfflineBanner = Template.bind()
OfflineBanner.args = {
  status: BANNER_STATUS.fatal,
  message: 'Offline. You will not receive messages.',
}
