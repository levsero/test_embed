import React from 'react'
import { BANNER_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import Banner from './'

export default {
  title: 'Sunco/Banner',
  component: Banner,
  argTypes: {
    status: {
      defaultValue: BANNER_STATUS.success,
      control: {
        type: 'inline-radio',
        options: Object.values(BANNER_STATUS)
      }
    }
  }
}

const Template = args => <Banner {...args} />

export const OnlineBanner = Template.bind()
OnlineBanner.args = {
  status: BANNER_STATUS.success,
  message: "You're back online!"
}

export const OfflineBanner = Template.bind()
OfflineBanner.args = {
  status: BANNER_STATUS.fatal,
  message: 'Offline. You will not receive messages.'
}
