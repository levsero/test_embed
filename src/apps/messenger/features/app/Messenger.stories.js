import React from 'react'

import App from './'

export default {
  title: 'Messenger/Messenger',
  component: App
}

const Template = args => <App {...args} />

export const Messenger = Template.bind({})
Messenger.args = {}
