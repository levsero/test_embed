import React from 'react'
import { rem } from 'polished'

import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import Form from './'

export default {
  title: 'Sunco/Form',
  component: Form,
  argTypes: { handleSubmit: { action: 'form submitted' }, onChange: { action: 'user typed' } }
}

/* eslint-disable no-console */
const Template = args => (
  <div
    style={{
      width: rem('380px', baseFontSize),
      height: rem('700px', baseFontSize),
      border: '1px solid black'
    }}
  >
    <Form {...args} />
  </div>
)

export const TextFieldOnlyForm = Template.bind()
TextFieldOnlyForm.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  fields: [
    {
      _id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text'
    },
    {
      _id: '2',
      name: 'last_name',
      label: 'Last Name',
      type: 'text'
    }
  ],
  values: { '1': 'asdf' },
  isFirstInGroup: true,
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  label: 'I am a test user',
  status: '',
  formStatus: { failure: 'failure', pending: 'pending', success: 'success' }
}
/* eslint-enable no-console */
