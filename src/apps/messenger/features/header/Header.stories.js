import React from 'react'

import Header from './'

export default {
  title: 'Messenger/Header',
  component: Header
}

const Template = args => <Header {...args} />

export const ThisHeader = Template.bind({})
ThisHeader.args = {}
