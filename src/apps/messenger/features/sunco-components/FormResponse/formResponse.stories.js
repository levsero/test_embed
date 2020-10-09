import React from 'react'
import FormResponse from './'

export default {
  title: 'Sunco/FormResponse',
  component: FormResponse
}

const Template = args => <FormResponse {...args} />

export const TextFieldOnlyFormResponse = Template.bind()
TextFieldOnlyFormResponse.args = {
  fields: [
    {
      _id: 'asdf87asdf76as8d7f6ds7af876',
      label: 'Your first name',
      text: 'Cordelia'
    },
    {
      _id: 'asd87sd897s897ds8d79',
      label: 'Your last name',
      text: 'the greyhound'
    }
  ],
  isFirstInGroup: true,
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  label: 'I am a test user'
}
