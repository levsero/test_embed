import React from 'react'
import { widgetOpened } from 'src/apps/messenger/store/visibility'

import App from './'

export default {
  title: 'Messenger/Messenger',
  component: App
}

const Template = args => <App {...args} />

export const Messenger = Template.bind({})
export const OpenMessenger = Template.bind({})

Messenger.args = {
  actions: []
}

OpenMessenger.args = {
  actions: [widgetOpened()]
}
