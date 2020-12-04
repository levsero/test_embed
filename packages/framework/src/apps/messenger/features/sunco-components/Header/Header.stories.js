import React from 'react'

import Header from './'

export default {
  title: 'Sunco/Header',
  component: Header
}

const Template = args => <Header {...args} />

export const AllFields = Template.bind()
AllFields.args = {
  title: 'My company title',
  description: 'a catchy little punchline',
  avatar: 'https://lucashills.com/emu_avatar.jpg'
}

export const TitleOnly = Template.bind()
TitleOnly.args = {
  title: 'My company title'
}

export const TitleAndDescription = Template.bind()
TitleAndDescription.args = {
  title: 'My company title',
  description: 'a catchy little punchline'
}

export const TitleAndAvatar = Template.bind()
TitleAndAvatar.args = {
  title: 'My company title',
  avatar: 'https://lucashills.com/emu_avatar.jpg'
}
