import React from 'react'

import Widget from './'

export default {
  title: 'Messenger/Widget',
  component: Widget
}

const Template = args => <Widget {...args} />

export const MessengerWidget = Template.bind({})
MessengerWidget.args = {}
