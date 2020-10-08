import React from 'react'

import Header from './'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

export default {
  title: 'Messenger/Header',
  component: Header
}

const Template = args => <Header {...args} />

export const ThisHeader = Template.bind({})
ThisHeader.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' },
      title: 'this is the title',
      description: 'and a description',
      avatar:
        'https://img.favpng.com/3/24/18/respiratory-syncytial-virus-infectious-disease-influenza-infection-coronavirus-png-favpng-X7mEunxt70G9utsSkcd5GT8Px.jpg'
    })
  ]
}
